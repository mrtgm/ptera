import type { GameEvent, Stage } from "~/schema";
import { sortByFractionalIndex } from "~/utils/sort";

export const getFirstEvent = (events: GameEvent[]): GameEvent | null => {
	return (
		events.sort((a, b) => sortByFractionalIndex(a.order, b.order))[0] || null
	);
};

/**
 * キャンセル可能なイベント処理マネージャー
 */
export class EventManager {
	private cancelTransitionRequests: Set<string> = new Set();
	private animationFrameIds: Map<string, number> = new Map();
	private disposed = false;

	addCancelRequest(eventId: string) {
		if (this.disposed) return;

		if (this.cancelTransitionRequests.size > 10) {
			// キャンセルリクエストが多すぎる場合はクリア
			this.cancelTransitionRequests.clear();
		}
		this.cancelTransitionRequests.add(eventId);
	}

	checkIfEventIsCanceled(eventId: string): boolean {
		if (this.disposed) return false;
		return this.cancelTransitionRequests.has(eventId);
	}

	removeCancelRequest(eventId: string) {
		if (this.disposed) return;
		this.cancelTransitionRequests.delete(eventId);
	}

	async waitCancelable(ms: number, eventId: string): Promise<void> {
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
					// 時間経過またはキャンセルリクエストがあれば解決
					if (this.checkIfEventIsCanceled(eventId)) {
						this.removeCancelRequest(eventId);
					}

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
		eventId: string,
		onUpdate: (text: string) => void,
		speed = 50,
	): Promise<void> {
		if (this.disposed) return;

		let currentText = "";

		for (const char of text) {
			// キャンセルされていれば完全なテキストを表示して終了
			if (this.checkIfEventIsCanceled(eventId)) {
				this.removeCancelRequest(eventId);
				onUpdate(text);
				return;
			}

			// 1文字追加
			currentText += char;
			onUpdate(currentText);

			// 指定時間待機
			await new Promise((resolve) => setTimeout(resolve, speed));
		}
	}

	/**
	 * 複数のイベントを順番に処理
	 * @param events 処理するイベント配列
	 * @param initialStage 初期ステージ状態
	 * @param onStageUpdate ステージ更新時のコールバック
	 * @param onEventComplete イベント完了時のコールバック（オプション）
	 */
	async processEventsSequentially(
		events: GameEvent[],
		initialStage: Stage,
		onStageUpdate: (stage: Stage) => void,
		onEventComplete?: (event: GameEvent) => void,
	): Promise<Stage> {
		if (this.disposed) return initialStage;

		let currentStage = { ...initialStage };

		for (const event of events) {
			// 各イベントを処理
			currentStage = await this.processGameEvent(
				event,
				currentStage,
				onStageUpdate,
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
	): Promise<Stage> {
		if (this.disposed) return currentStage;

		let updatedStage = { ...currentStage };

		switch (event.type) {
			case "text": {
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

				// テキストをアニメーション表示
				await this.animateText(event.text, event.id, (partialText) => {
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
				console.warn(`未知のイベントタイプ: ${(event as GameEvent).type}`);
		}

		return updatedStage;
	}

	dispose() {
		if (this.disposed) return;

		// すべてのアニメーションフレームをキャンセル
		for (const frameId of this.animationFrameIds.values()) {
			cancelAnimationFrame(frameId);
		}

		this.animationFrameIds.clear();
		this.cancelTransitionRequests.clear();
		this.disposed = true;
	}
}
