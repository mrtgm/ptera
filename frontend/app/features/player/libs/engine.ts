import { Howler } from "howler";
import mitt from "mitt";
import type {
	Choice,
	Game,
	GameEvent,
	GameState,
	MessageHistory,
	Scene,
	Stage,
} from "~/schema";
import { updateOrAppend, waitMs } from "~/utils";

type Events = {
	stageUpdated: Stage;
	historyUpdated: MessageHistory[];
	currentEventUpdated: GameEvent | null;
	currentSceneUpdated: Scene | null;
	gameLoaded: Game;
} & {
	[key in GameState]: undefined;
};

export const INITIAL_STAGE: Stage = {
	background: null,
	cg: {
		item: null,
		transitionDuration: 0,
	},
	characters: {
		items: [],
		transitionDuration: 0,
	},
	choices: [],
	dialog: {
		isVisible: false,
		text: "",
		characterName: "",
		transitionDuration: 0,
	},
	soundEffect: null,
	bgm: null,
	effect: null,
};

export class Player {
	private static instance: Player;
	currentGame: Game | null = null;
	currentScene: Scene | null = null;
	currentEvent: GameEvent | null = null;

	state: GameState = "loading";
	stage: Stage = INITIAL_STAGE;

	isMute = false;
	isAutoMode = false;

	animationFrameId: number | undefined;
	cancelTransitionRequests: Set<string> = new Set(); // Set:eventId

	messageHistory: MessageHistory[] = [];

	emitter = mitt<Events>();

	disposed = false;

	dispose() {
		this.cancelTransitionRequests.clear();

		Howler.stop();
		Howler.mute(false);

		this.updateStage(INITIAL_STAGE);
		this.updateCurrentEvent(null);
		this.updateCurrentScene(null);
		this.currentGame = null;

		this.clearHistory();

		this.emitter.all.clear();

		this.setState("end");

		window.removeEventListener("click", this.handleTap);

		this.isAutoMode = false;

		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = undefined;
		}

		this.disposed = true;
	}

	setState(state: GameState) {
		this.state = state;
		this.emitter.emit<GameState>(state);
	}

	loadGame(game: Game) {
		this.currentGame = game;
		this.emitter.emit("gameLoaded", game);

		this.updateScene(game.scenes[0].id);
		this.setState("beforeStart");
	}

	addCancelRequest(eventId: string) {
		if (this.cancelTransitionRequests.size > 5) {
			this.cancelTransitionRequests.clear();
		}
		this.cancelTransitionRequests.add(eventId);
	}

	checkIfEventIsCanceled(eventId: string) {
		return this.cancelTransitionRequests.has(eventId);
	}

	removeCancelRequest(eventId: string) {
		this.cancelTransitionRequests.delete(eventId);
	}

	updateScene(sceneId: string) {
		const scene =
			this.currentGame?.scenes.find((s) => s.id === sceneId) ?? null;

		if (scene) {
			this.updateCurrentScene(scene);
			this.updateCurrentEvent(scene.events[0]);
		}
	}

	updateStage(updates: Partial<Stage>) {
		this.stage = { ...this.stage, ...updates } as Stage;
		this.emitter.emit("stageUpdated", {
			...this.stage,
			...updates,
		});
	}

	updateCurrentEvent(event: GameEvent | null) {
		console.log("updateCurrentEvent", event);
		this.currentEvent = event;
		this.emitter.emit("currentEventUpdated", event);
	}

	updateCurrentScene(scene: Scene | null) {
		this.currentScene = scene;
		this.emitter.emit("currentSceneUpdated", scene);
	}

	toggleAutoMode() {
		this.isAutoMode = !this.isAutoMode;
	}

	toggleMute() {
		this.isMute = !this.isMute;
		Howler.mute(this.isMute);
	}

	addToHistory(message: MessageHistory) {
		this.messageHistory.push(message);
		this.emitter.emit("historyUpdated", this.messageHistory);
	}

	clearHistory() {
		this.messageHistory = [];
		this.emitter.emit("historyUpdated", []);
	}

	async startGame() {
		if (!this.currentGame) return;
		this.setState("playing");
		await waitForGameScreenIsMounted();
		this.runEvents(this.currentScene?.events ?? []);
	}

	async previewGame(
		stage: Stage,
		currentScene: Scene,
		currentEvent: GameEvent,
	) {
		this.setState("playing");
		await waitForGameScreenIsMounted();

		this.updateStage(stage);
		this.updateCurrentScene(currentScene);
		this.updateCurrentEvent(currentEvent);

		const foundIndex = currentScene?.events.findIndex(
			(e) => e.id === this.currentEvent?.id,
		);
		const startIndex = foundIndex ?? 0;
		const events = currentScene?.events.slice(startIndex) ?? [];

		console.log("previewing", events);

		await this.runEvents(events);
	}

	resetGame() {
		this.currentScene = this.currentGame?.scenes[0] ?? null;
		this.setState("beforeStart");
		this.updateCurrentEvent(null);
		this.updateStage(INITIAL_STAGE);
		this.clearHistory();
		this.isAutoMode = false;
		this.cancelTransitionRequests = new Set();

		Howler.stop();
	}

	async runEvents(events: GameEvent[]) {
		for (const event of events) {
			this.updateCurrentEvent(event);
			await this.runEvent(event);
		}

		if (this.currentScene) await this.runBranching(this.currentScene);
	}

	async runEvent(event: GameEvent) {
		console.log("running", event, this.disposed);

		if (this.disposed) return;

		switch (event.type) {
			case "text": {
				for (const line of event.lines) {
					await this.animateLine(line, event.id, (text) => {
						this.updateStage({
							dialog: {
								...this.stage.dialog,
								text,
								characterName: event.characterName,
							},
						});
					});

					this.addToHistory({
						text: line,
						characterName: event.characterName,
					});

					if (!this.isAutoMode) {
						this.setState("idle");
						await this.waitForTap();
						this.setState("playing");
					} else {
						await waitMs(3000);
					}
				}
				break;
			}
			case "appearMessageWindow": {
				this.updateStage({
					dialog: {
						...this.stage.dialog,
						isVisible: true,
					},
				});
				await this.waitCancelable(event.transitionDuration, event.id);
				break;
			}
			case "hideMessageWindow": {
				this.updateStage({
					dialog: {
						...this.stage.dialog,
						isVisible: false,
					},
				});
				await this.waitCancelable(event.transitionDuration, event.id);
				break;
			}
			case "changeBackground": {
				this.updateStage({
					background: {
						id: event.backgroundId,
						transitionDuration: event.transitionDuration,
					},
				});
				await this.waitCancelable(event.transitionDuration, event.id);
				break;
			}
			case "appearCharacter": {
				this.updateStage({
					characters: {
						transitionDuration: event.transitionDuration,
						items: updateOrAppend(
							this.stage.characters.items,
							{
								id: event.characterId,
								scale: event.scale,
								imageId: event.characterImageId,
								position: event.position,
								effect: null,
							},
							"id",
						),
					},
				});

				await this.waitCancelable(event.transitionDuration, event.id);
				break;
			}
			case "moveCharacter": {
				this.updateStage({
					characters: {
						...this.stage.characters,
						items: this.stage.characters.items.map((c) => {
							if (c.id === event.characterId) {
								return {
									...c,
									position: event.position,
									scale: event.scale,
								};
							}
							return c;
						}),
					},
				});
				break;
			}
			case "hideCharacter": {
				this.updateStage({
					characters: {
						transitionDuration: event.transitionDuration,
						items: this.stage.characters.items.filter(
							(c) => c.id !== event.characterId,
						),
					},
				});
				await this.waitCancelable(event.transitionDuration, event.id);
				break;
			}
			case "hideAllCharacters": {
				this.updateStage({
					characters: {
						items: [],
						transitionDuration: event.transitionDuration,
					},
				});
				await this.waitCancelable(event.transitionDuration, event.id);
				break;
			}
			case "soundEffect": {
				this.updateStage({
					soundEffect: {
						id: event.soundEffectId,
						volume: event.volume,
						isPlaying: true,
						transitionDuration: event.transitionDuration,
					},
				});
				break;
			}
			case "bgmStart": {
				this.updateStage({
					bgm: {
						id: event.bgmId,
						volume: event.volume,
						isPlaying: true,
						transitionDuration: event.transitionDuration,
					},
				});
				break;
			}
			case "bgmStop": {
				if (this.stage.bgm) {
					this.updateStage({
						bgm: { ...this.stage.bgm, isPlaying: false },
					});
				}
				break;
			}
			case "effect": {
				this.updateStage({
					effect: {
						type: event.effectType,
						transitionDuration: event.transitionDuration,
					},
				});
				await this.waitCancelable(event.transitionDuration, event.id);
				break;
			}
			case "characterEffect": {
				this.updateStage({
					characters: {
						items: this.stage.characters.items.map((c) => {
							if (c.id === event.characterId) {
								return {
									...c,
									effect: {
										type: event.effectType,
										transitionDuration: event.transitionDuration,
									},
								};
							}
							return c;
						}),
						transitionDuration: event.transitionDuration,
					},
				});
				await this.waitCancelable(event.transitionDuration, event.id);
				break;
			}
			case "appearCG": {
				this.updateStage({
					cg: {
						transitionDuration: event.transitionDuration,
						item: {
							id: event.cgImageId,
							scale: event.scale,
							position: event.position,
						},
					},
				});
				await this.waitCancelable(event.transitionDuration, event.id);
				break;
			}
			case "hideCG": {
				this.updateStage({
					cg: {
						transitionDuration: event.transitionDuration,
						item: null,
					},
				});
				await this.waitCancelable(event.transitionDuration, event.id);
				break;
			}
		}
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

	private async waitForTap() {
		return new Promise<void>((resolve) => {
			this.tapResolve = resolve;
			window.addEventListener("click", this.handleTap);
		});
	}

	async waitCancelable(ms: number, eventId: string) {
		console.log(eventId);

		if (this.disposed) return;

		const startTime = performance.now();
		const wait = () =>
			new Promise<void>((resolve) => {
				const check = () => {
					if (
						performance.now() - startTime > ms ||
						this.checkIfEventIsCanceled(eventId)
					) {
						resolve();
						return;
					}
					this.animationFrameId = requestAnimationFrame(check);
				};
				this.animationFrameId = requestAnimationFrame(check);
			});
		await wait();
	}

	async animateLine(
		line: string,
		eventId: string,
		update: (text: string) => void,
	) {
		const DELAY = 50;
		let text = "";

		for (const char of line) {
			const hasCancelRequest = this.cancelTransitionRequests.has(eventId);
			if (this.disposed) return;
			if (hasCancelRequest) {
				this.removeCancelRequest(eventId);
				text = line;
				update(line);
				break;
			}
			text += char;
			update(text);
			await waitMs(DELAY);
		}
	}

	async runBranching(scene: Scene) {
		if (this.disposed) return;

		if (scene.sceneType === "choice") {
			this.setState("idle");
			this.updateStage({
				choices: scene.choices,
			});
		}
		if (scene.sceneType === "goto") {
			this.updateScene(scene.nextSceneId);
			this.runEvents(this.currentScene?.events ?? []);
		}
		if (scene.sceneType === "end") {
			this.resetGame();
			this.setState("end");
		}
	}

	selectChoice(choice: Choice) {
		this.addToHistory({ text: choice.text, isChoice: true });
		this.updateScene(choice.nextSceneId);
		this.runEvents(this.currentScene?.events ?? []);

		this.setState("playing");
		this.updateStage({
			choices: [],
		});
	}
}

const waitForGameScreenIsMounted = (timeout = 5000): Promise<HTMLElement> => {
	return new Promise((resolve, reject) => {
		const startTime = performance.now();
		const check = () => {
			const gameScreen = document.getElementById("game-screen");
			if (gameScreen) {
				resolve(gameScreen);
				return;
			}
			if (performance.now() - startTime > timeout) {
				reject(new Error("Timeout waiting for game screen"));
				return;
			}
			requestAnimationFrame(check);
		};
		requestAnimationFrame(check);
	});
};
