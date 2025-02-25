import { Howler } from "howler";
import mitt from "mitt";
import { updateOrAppend, waitMs } from "~/utils";

type Events = {
	stageUpdated: Stage;
	historyUpdated: MessageHistory[];
	currentEventUpdated: GameEvent | null;
} & {
	[key in GameState]: undefined;
};

const INITIAL_STATE: Stage = {
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
	stage: Stage = INITIAL_STATE;

	isMute = false;
	// TODO: AutoMode
	isAutoMode = false;
	cancelRequests: Set<string> = new Set(); // Set:eventId

	messageHistory: MessageHistory[] = [];

	emitter = mitt<Events>();

	private constructor() {}

	static getInstance(): Player {
		if (!Player.instance) {
			Player.instance = new Player();
		}
		return Player.instance;
	}

	setState(state: GameState) {
		this.state = state;
		this.emitter.emit<GameState>(state);
	}

	loadGame(game: Game) {
		this.currentGame = game;
		this.currentScene = game.scenes[0];

		const initialScreenTitle = document.getElementById("initial-screen-title");
		if (initialScreenTitle) initialScreenTitle.textContent = game.title;
	}

	setScene(sceneId: string) {
		const scene =
			this.currentGame?.scenes.find((s) => s.id === sceneId) ?? null;
		if (scene) {
			this.currentScene = scene;
			this.currentEvent = scene.events[0];
		}
	}

	addCancelRequest(eventId: string) {
		if (this.cancelRequests.size > 5) {
			this.cancelRequests.clear();
		}
		this.cancelRequests.add(eventId);
	}

	checkIfEventIsCanceled(eventId: string) {
		return this.cancelRequests.has(eventId);
	}

	removeCancelRequest(eventId: string) {
		this.cancelRequests.delete(eventId);
	}

	updateStage(updates: Partial<Stage>) {
		this.stage = { ...this.stage, ...updates } as Stage;
		this.emitter.emit("stageUpdated", {
			...this.stage,
			...updates,
		});
	}

	updateCurrentEvent(event: GameEvent | null) {
		this.emitter.emit("currentEventUpdated", event);
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

	resetGame() {
		this.currentScene = this.currentGame?.scenes[0] ?? null;
		this.setState("beforeStart");
		this.updateCurrentEvent(null);
		this.updateStage(INITIAL_STATE);
		this.clearHistory();
		this.isAutoMode = false;
		this.cancelRequests = new Set();

		Howler.stop();
	}

	async runEvents(events: GameEvent[]) {
		for (const event of events) {
			this.currentEvent = event;
			this.updateCurrentEvent(event);
			await runEvent(event);
		}

		if (this.currentScene) runBranching(this.currentScene);
	}

	selectChoice(choice: Choice) {
		this.addToHistory({ text: choice.text, isChoice: true });
		this.setScene(choice.nextSceneId);
		this.runEvents(this.currentScene?.events ?? []);

		this.setState("playing");
		this.updateStage({
			choices: [],
		});
	}
}

// シングルトン
export const player = Player.getInstance();

const runBranching = async (scene: Scene) => {
	if (scene.sceneType === "choice") {
		player.setState("idle");
		player.updateStage({
			choices: scene.choices,
		});
	}
	if (scene.sceneType === "goto") {
		player.setScene(scene.nextSceneId);
		player.runEvents(player.currentScene?.events ?? []);
	}
	if (scene.sceneType === "end") {
		player.resetGame();
		player.setState("end");
	}
};

const runEvent = async (event: GameEvent) => {
	console.log("runEvent", event);

	switch (event.type) {
		case "text": {
			for (const line of event.lines) {
				await animateLine(line, event.id, (text) => {
					player.updateStage({
						dialog: {
							...player.stage.dialog,
							text,
							characterName: event.characterName,
						},
					});
				});

				player.addToHistory({ text: line, characterName: event.characterName });

				if (!player.isAutoMode) {
					player.setState("idle");
					await waitForTap();
					player.setState("playing");
				} else {
					await waitMs(3000);
				}
			}
			break;
		}
		case "appearMessageWindow": {
			player.updateStage({
				dialog: {
					...player.stage.dialog,
					isVisible: true,
				},
			});
			await waitCancelable(event.transitionDuration, event.id);
			break;
		}
		case "hideMessageWindow": {
			player.updateStage({
				dialog: {
					...player.stage.dialog,
					isVisible: false,
				},
			});
			await waitCancelable(event.transitionDuration, event.id);
			break;
		}
		case "changeBackground": {
			player.updateStage({
				background: {
					id: event.backgroundId,
					scale: event.scale,
					position: event.position,
					transitionDuration: event.transitionDuration,
				},
			});
			await waitCancelable(event.transitionDuration, event.id);
			break;
		}
		case "appearCharacter": {
			player.updateStage({
				characters: {
					transitionDuration: event.transitionDuration,
					items: updateOrAppend(
						player.stage.characters.items,
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

			await waitCancelable(event.transitionDuration, event.id);
			break;
		}
		case "moveCharacter": {
			player.updateStage({
				characters: {
					...player.stage.characters,
					items: player.stage.characters.items.map((c) => {
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
			player.updateStage({
				characters: {
					transitionDuration: event.transitionDuration,
					items: player.stage.characters.items.filter(
						(c) => c.id !== event.characterId,
					),
				},
			});
			await waitCancelable(event.transitionDuration, event.id);
			break;
		}
		case "hideAllCharacters": {
			player.updateStage({
				characters: {
					items: [],
					transitionDuration: event.transitionDuration,
				},
			});
			await waitCancelable(event.transitionDuration, event.id);
			break;
		}
		case "soundEffect": {
			player.updateStage({
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
			player.updateStage({
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
			if (player.stage.bgm) {
				player.updateStage({
					bgm: { ...player.stage.bgm, isPlaying: false },
				});
			}
			break;
		}
		case "effect": {
			player.updateStage({
				effect: {
					type: event.effectType,
					transitionDuration: event.transitionDuration,
				},
			});
			await waitCancelable(event.transitionDuration, event.id);
			break;
		}
		case "characterEffect": {
			player.updateStage({
				characters: {
					items: player.stage.characters.items.map((c) => {
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
			await waitCancelable(event.transitionDuration, event.id);
			break;
		}
		case "appearCG": {
			player.updateStage({
				cg: {
					transitionDuration: event.transitionDuration,
					item: {
						id: event.imageId,
						scale: event.scale,
						position: event.position,
					},
				},
			});
			await waitCancelable(event.transitionDuration, event.id);
			break;
		}
		case "hideCG": {
			player.updateStage({
				cg: {
					transitionDuration: event.transitionDuration,
					item: null,
				},
			});
			await waitCancelable(event.transitionDuration, event.id);
			break;
		}
	}
};

const waitForTap = () =>
	new Promise<void>((resolve) => {
		const handleTap = (e: MouseEvent) => {
			if (e.target instanceof HTMLElement || e.target instanceof SVGElement) {
				if (e.target.closest("#ui") || e.target.closest("#history-modal"))
					return;
			}

			window.removeEventListener("click", handleTap);
			resolve();
		};
		window.addEventListener("click", handleTap);
	});

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

const waitCancelable = async (ms: number, eventId: string) => {
	const startTime = performance.now();
	const wait = () =>
		new Promise<void>((resolve) => {
			const check = () => {
				if (
					performance.now() - startTime > ms ||
					player.checkIfEventIsCanceled(eventId)
				) {
					resolve();
					return;
				}
				requestAnimationFrame(check);
			};
			check();
		});
	await wait();
};

const animateLine = async (
	line: string,
	eventId: string,
	update: (text: string) => void,
) => {
	const DELAY = 50;
	let text = "";

	for (const char of line) {
		const hasCancelRequest = player.cancelRequests.has(eventId);
		if (hasCancelRequest) {
			player.removeCancelRequest(eventId);
			text = line;
			update(line);
			break;
		}
		text += char;
		update(text);
		await waitMs(DELAY);
	}
};
