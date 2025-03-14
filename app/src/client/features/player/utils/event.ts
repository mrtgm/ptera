import type {
	GameEvent,
	GameState,
	MessageHistory,
	Stage,
} from "@/client/schema";

/**
 * キャンセル可能なイベント処理マネージャー
 */
export class EventManager {
	private isAutoMode = false;
	cancelTransitionRequests: Set<number> = new Set();
	private animationFrameIds: Map<number, number> = new Map();
	private disposed = false;

	setAutoMode(isAutoMode: boolean) {
		this.isAutoMode = isAutoMode;
	}

	addCancelRequest(eventId: number) {
		if (this.disposed) return;

		if (this.cancelTransitionRequests.size > 10) {
			// キャンセルリクエストが多すぎる場合はクリア
			this.cancelTransitionRequests.clear();
		}
		this.cancelTransitionRequests.add(eventId);
	}

	removeCancelRequest(eventId: number) {
		if (this.disposed) return;
		this.cancelTransitionRequests.delete(eventId);
	}

	clearCancelRequests() {
		if (this.disposed) return;

		this.cancelTransitionRequests.clear();
	}

	checkIfEventIsCanceled(eventId: number): boolean {
		if (this.disposed) return false;

		return this.cancelTransitionRequests.has(eventId);
	}

	private tapResolve?: () => void;
	private handleTap = (e: MouseEvent) => {
		if (e.target instanceof HTMLElement || e.target instanceof SVGElement) {
			if (e.target.closest("#ui") || e.target.closest("#history-modal")) return;
		}

		window.removeEventListener("click", this.handleTap);
		this.tapResolve?.();
		this.tapResolve = undefined;
	};

	private async waitForTap(eventId: number): Promise<void> {
		return new Promise<void>((resolve) => {
			const check = () => {
				if (this.disposed) {
					resolve();
					this.tapResolve = undefined;
					return;
				}
				if (this.isAutoMode) {
					resolve();
					this.tapResolve = undefined;
					return;
				}
				const frameId = requestAnimationFrame(check);
				this.animationFrameIds.set(eventId, frameId);
			};

			const frameId = requestAnimationFrame(check);
			this.animationFrameIds.set(eventId, frameId);

			this.tapResolve = resolve;
			window.addEventListener("click", this.handleTap);
		});
	}

	async waitCancelable(ms: number, eventId: number): Promise<void> {
		if (this.disposed) return;

		const startTime = performance.now();

		return new Promise<void>((resolve) => {
			const check = () => {
				if (this.disposed) {
					resolve();
					return;
				}

				if (
					performance.now() - startTime > ms ||
					this.checkIfEventIsCanceled(eventId)
				) {
					if (this.animationFrameIds.has(eventId)) {
						const frameId = this.animationFrameIds.get(eventId);
						if (frameId) cancelAnimationFrame(frameId);
						this.animationFrameIds.delete(eventId);
					}

					resolve();
					return;
				}

				const frameId = requestAnimationFrame(check);
				this.animationFrameIds.set(eventId, frameId);
			};

			const frameId = requestAnimationFrame(check);
			this.animationFrameIds.set(eventId, frameId);
		});
	}

	async animateText(
		text: string,
		eventId: number,
		onUpdate: (text: string) => void,
		speed = 50,
	): Promise<void> {
		if (this.disposed) return;

		let currentText = "";

		for (const char of text) {
			if (this.checkIfEventIsCanceled(eventId)) {
				onUpdate(text);
				this.removeCancelRequest(eventId);
				return;
			}

			currentText += char;
			onUpdate(currentText);

			await new Promise((resolve) => setTimeout(resolve, speed));
		}
	}

	async processEventsSequentially(
		events: GameEvent[],
		initialStage: Stage,
		onStageUpdate: (stage: Stage) => void,
		onStateUpdate: (state: GameState) => void,
		onHistoryUpdate: (event: MessageHistory) => void,
		onEventComplete?: (event: GameEvent) => void,
	): Promise<Stage> {
		if (this.disposed) return initialStage;

		let currentStage = { ...initialStage };

		for (const event of events) {
			currentStage = await this.processGameEvent(
				event,
				currentStage,
				onStageUpdate,
				onStateUpdate,
				onHistoryUpdate,
			);

			// イベント完了通知
			if (onEventComplete) {
				onEventComplete(event);
			}
		}

		return currentStage;
	}

	/**
	 * 単一のイベントを処理し、ステージを更新
	 */
	async processGameEvent(
		event: GameEvent,
		currentStage: Stage,
		onStageUpdate: (stage: Stage) => void,
		onStateUpdate: (state: GameState) => void,
		onHistoryUpdate: (event: MessageHistory) => void,
	): Promise<Stage> {
		if (this.disposed) return currentStage;

		let updatedStage = { ...currentStage };

		switch (event.eventType) {
			case "textRender": {
				// ダイアログを表示
				updatedStage = {
					...updatedStage,
					dialog: {
						...updatedStage.dialog,
						isVisible: true,
						characterName: event.characterName,
						text: "", // 最初は空にしておく
						transitionDuration: 0,
					},
				};
				onStageUpdate(updatedStage);

				const splitText = event.text.split("\n").filter(Boolean);
				for (const line of splitText) {
					// テキストをアニメーション表示
					await this.animateText(line, event.id, (partialText) => {
						const textUpdatedStage = {
							...updatedStage,
							dialog: {
								...updatedStage.dialog,
								text: partialText,
							},
						};
						updatedStage = textUpdatedStage; // 現在のステージを更新
						onStageUpdate(textUpdatedStage);
					});

					onHistoryUpdate({
						text: line,
						characterName: event.characterName || "",
					});

					if (!this.isAutoMode) {
						onStateUpdate("idle");
						await this.waitForTap(event.id);
						onStateUpdate("playing");
					} else {
						await new Promise((resolve) => setTimeout(resolve, 1000));
					}
				}

				break;
			}

			case "appearMessageWindow": {
				updatedStage = {
					...updatedStage,
					dialog: {
						...updatedStage.dialog,
						isVisible: true,
						transitionDuration: event.transitionDuration,
					},
				};
				onStageUpdate(updatedStage);
				await this.waitCancelable(event.transitionDuration, event.id);
				break;
			}

			case "hideMessageWindow": {
				updatedStage = {
					...updatedStage,
					dialog: {
						...updatedStage.dialog,
						isVisible: false,
						transitionDuration: event.transitionDuration,
					},
				};
				onStageUpdate(updatedStage);
				await this.waitCancelable(event.transitionDuration, event.id);
				break;
			}

			case "changeBackground": {
				updatedStage = {
					...updatedStage,
					background: {
						id: event.backgroundId,
						transitionDuration: event.transitionDuration,
					},
				};
				onStageUpdate(updatedStage);
				await this.waitCancelable(event.transitionDuration, event.id);
				break;
			}

			case "appearCharacter": {
				// 既存キャラクターのリストをコピー
				const updatedCharacters = [...updatedStage.characters.items];

				// 同じIDのキャラクターが既に存在するかチェック
				const existingIndex = updatedCharacters.findIndex(
					(c) => c.id === event.characterId,
				);

				// 新しいキャラクター情報
				const newCharacter = {
					id: event.characterId,
					scale: event.scale,
					imageId: event.characterImageId,
					position: event.position,
					effect: null,
				};

				// 存在する場合は更新、存在しない場合は追加
				if (existingIndex >= 0) {
					updatedCharacters[existingIndex] = newCharacter;
				} else {
					updatedCharacters.push(newCharacter);
				}

				updatedStage = {
					...updatedStage,
					characters: {
						items: updatedCharacters,
						transitionDuration: event.transitionDuration,
					},
				};

				onStageUpdate(updatedStage);
				await this.waitCancelable(event.transitionDuration, event.id);
				break;
			}

			case "moveCharacter": {
				updatedStage = {
					...updatedStage,
					characters: {
						...updatedStage.characters,
						items: updatedStage.characters.items.map((character) =>
							character.id === event.characterId
								? {
										...character,
										position: event.position,
										scale: event.scale,
									}
								: character,
						),
					},
				};

				onStageUpdate(updatedStage);
				break;
			}

			case "hideCharacter": {
				updatedStage = {
					...updatedStage,
					characters: {
						items: updatedStage.characters.items.filter(
							(c) => c.id !== event.characterId,
						),
						transitionDuration: event.transitionDuration,
					},
				};

				onStageUpdate(updatedStage);
				await this.waitCancelable(event.transitionDuration, event.id);
				break;
			}

			case "hideAllCharacters": {
				updatedStage = {
					...updatedStage,
					characters: {
						items: [],
						transitionDuration: event.transitionDuration,
					},
				};

				onStageUpdate(updatedStage);
				await this.waitCancelable(event.transitionDuration, event.id);
				break;
			}

			case "soundEffect": {
				updatedStage = {
					...updatedStage,
					soundEffect: {
						id: event.soundEffectId,
						volume: event.volume,
						loop: event.loop,
						isPlaying: true,
						transitionDuration: event.transitionDuration,
					},
				};

				onStageUpdate(updatedStage);
				break;
			}

			case "bgmStart": {
				updatedStage = {
					...updatedStage,
					bgm: {
						id: event.bgmId,
						volume: event.volume,
						loop: event.loop,
						isPlaying: true,
						transitionDuration: event.transitionDuration,
					},
				};

				onStageUpdate(updatedStage);
				break;
			}

			case "bgmStop": {
				if (updatedStage.bgm) {
					updatedStage = {
						...updatedStage,
						bgm: {
							...updatedStage.bgm,
							isPlaying: false,
						},
					};
				}

				onStageUpdate(updatedStage);
				break;
			}

			case "effect": {
				updatedStage = {
					...updatedStage,
					effect: {
						type: event.effectType,
						transitionDuration: event.transitionDuration,
					},
				};

				onStageUpdate(updatedStage);
				await this.waitCancelable(event.transitionDuration, event.id);

				if (event.effectType === "shake") {
					updatedStage = {
						...updatedStage,
						effect: null,
					};
					onStageUpdate(updatedStage);
				}
				break;
			}

			case "characterEffect": {
				updatedStage = {
					...updatedStage,
					characters: {
						...updatedStage.characters,
						items: updatedStage.characters.items.map((character) =>
							character.id === event.characterId
								? {
										...character,
										effect: {
											type: event.effectType,
											transitionDuration: event.transitionDuration,
										},
									}
								: character,
						),
						transitionDuration: event.transitionDuration,
					},
				};

				onStageUpdate(updatedStage);
				await this.waitCancelable(event.transitionDuration, event.id);

				updatedStage = {
					...updatedStage,
					characters: {
						...updatedStage.characters,
						items: updatedStage.characters.items.map((character) =>
							character.id === event.characterId
								? {
										...character,
										effect: null,
									}
								: character,
						),
					},
				};

				onStageUpdate(updatedStage);

				break;
			}

			case "appearCG": {
				updatedStage = {
					...updatedStage,
					cg: {
						transitionDuration: event.transitionDuration,
						item: {
							id: event.cgImageId,
							scale: event.scale,
							position: event.position,
						},
					},
				};

				onStageUpdate(updatedStage);
				await this.waitCancelable(event.transitionDuration, event.id);
				break;
			}

			case "hideCG": {
				updatedStage = {
					...updatedStage,
					cg: {
						transitionDuration: event.transitionDuration,
						item: null,
					},
				};

				onStageUpdate(updatedStage);
				await this.waitCancelable(event.transitionDuration, event.id);
				break;
			}

			default:
				console.warn(`未知のイベントタイプ: ${(event as GameEvent).eventType}`);
		}

		return updatedStage;
	}

	reset() {
		this.clearCancelRequests();
		for (const frameId of this.animationFrameIds.values()) {
			cancelAnimationFrame(frameId);
		}
	}

	dispose() {
		if (this.disposed) return;

		// すべてのアニメーションフレームをキャンセル
		for (const frameId of this.animationFrameIds.values()) {
			cancelAnimationFrame(frameId);
		}

		window.removeEventListener("click", this.handleTap);
		this.animationFrameIds.clear();
		this.clearCancelRequests();
		this.disposed = true;
	}
}
