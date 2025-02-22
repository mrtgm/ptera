import { Howl, Howler } from "howler";
import mitt from "mitt";
import { debounce, updateOrAppend, waitMs } from "~/utils";
import { resourceManager } from "~/utils/preloader";
import {
	bounce,
	crossFade,
	fadeIn,
	fadeOut,
	flash,
	shake,
	sway,
	wobble,
} from "~/utils/transition";

export type GameState = "loading" | "beforeStart" | "playing" | "idle" | "end";

type Events = {
	stageUpdated: Stage;
	currentEventUpdated: GameEvent;
} & {
	[key in GameState]: undefined;
};

type MessageHistory = {
	text: string;
	characterName?: string;
	isChoice?: boolean;
};

export class Player {
	private static instance: Player;
	currentGame: Game | null = null;
	currentScene: Scene | null = null;
	currentEvent: GameEvent | null = null;

	state: GameState = "loading";
	stage: Stage = {
		background: null,
		characters: [],
		choices: [],
		dialog: {
			isVisible: false,
			text: "",
			characterName: "",
			duration: 0,
		},
		bgm: null,
		effect: null,
	};

	isMute = false;
	// TODO: AutoMode
	isAutoMode = false;
	cancelRequests: Set<string> = new Set();

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
		this.cancelRequests.add(eventId);
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
	updateCurrentEvent(event: GameEvent) {
		this.emitter.emit("currentEventUpdated", event);
	}

	toggleAutoMode() {
		this.isAutoMode = !this.isAutoMode;
	}

	toggleMute() {
		Howler.mute(this.isMute);
		this.isMute = !this.isMute;

		const muteIndicator = document.getElementById("mute-indicator");
		if (!muteIndicator) return;

		muteIndicator.textContent = this.isMute ? "Mute" : "Unmute";
	}

	showHistory() {
		const historyModal = document.getElementById("history-modal");
		if (!historyModal) return;
		const historyList = document.getElementById("history-text");
		if (!historyList) return;

		historyList.innerHTML = "";

		for (const message of this.messageHistory) {
			const messageElement = document.createElement("li");
			messageElement.className = "text-white p-2 m-2 grid grid-cols-6 gap-2";

			const nameColumn = document.createElement("div");
			nameColumn.className = "col-span-1 text-right font-medium";
			nameColumn.textContent = message.characterName
				? `${message.characterName}:`
				: "";

			const textColumn = document.createElement("div");
			textColumn.className = `col-span-5  ${
				message.isChoice ? "text-orange-400" : ""
			}`;
			textColumn.textContent = message.text;

			messageElement.appendChild(nameColumn);
			messageElement.appendChild(textColumn);
			historyList.appendChild(messageElement);
		}

		historyModal.classList.remove("hidden");
		setTimeout(() => {
			historyList.scrollTo({
				top: historyList.scrollHeight,
			});
		}, 0);
	}

	closeHistory() {
		const historyModal = document.getElementById("history-modal");
		if (!historyModal) return;

		historyModal.classList.add("hidden");
	}

	addToHistory(message: MessageHistory) {
		this.messageHistory.push(message);
	}

	async startGame() {
		if (!this.currentGame) return;
		this.setState("playing");
		await waitForGameScreenIsMounted();
		this.runEvents(this.currentScene?.events ?? []);
	}

	resetGame() {
		this.currentScene = this.currentGame?.scenes[0] ?? null;
		this.currentEvent = null;

		this.stage = {
			background: null,
			characters: [],
			dialog: {
				isVisible: false,
				duration: 0,
				text: "",
				characterName: "",
			},
			bgm: null,
			choices: [],
			effect: null,
		};

		this.isAutoMode = false;
		this.cancelRequests = new Set();
		this.messageHistory = [];
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
					await waitMs(1000);
				}
			}
			break;
		}
		case "appearMessageWindow": {
			player.updateStage({
				dialog: {
					...player.stage.dialog,
					duration: event.duration,
					isVisible: true,
				},
			});
			await waitCancelable(event.duration, event.id);
			break;
		}
		case "hideMessageWindow": {
			player.updateStage({
				dialog: {
					...player.stage.dialog,
					duration: event.duration,
					isVisible: false,
				},
			});
			await waitCancelable(event.duration, event.id);
			break;
		}
		case "changeBackground": {
			player.updateStage({
				background: {
					id: event.backgroundId,

					scale: event.scale,
					position: event.position,
					duration: event.duration,
				},
			});
			await waitCancelable(event.duration, event.id);
			break;
		}
		case "appearCharacter": {
			player.updateStage({
				characters: updateOrAppend(
					player.stage.characters,
					{
						id: event.characterId,
						scale: event.scale,
						imageId: event.characterImageId,
						position: event.position,
						duration: event.duration,
					},
					"id",
				),
			});
			await waitCancelable(event.duration, event.id);
			break;
		}
		case "hideCharacter": {
			player.updateStage({
				characters: player.stage.characters.filter(
					(c) => c.id !== event.characterId,
				),
			});
			await waitCancelable(event.duration, event.id);
			break;
		}
		case "hideAllCharacters": {
			player.updateStage({
				characters: [],
			});
			await waitCancelable(event.duration, event.id);
			break;
		}
		case "soundEffect": {
			const soundEffectResource = resourceManager.getResource(
				"soundEffects",
				event.soundEffectId,
			);
			if (!soundEffectResource) return;

			soundEffectResource.cache.volume(event.volume);
			soundEffectResource.cache.play();
			break;
		}
		case "bgmStart": {
			const bgmResource = resourceManager.getResource("bgms", event.bgmId);

			if (!bgmResource) return;

			if (player.stage.bgm) {
				Howler.stop();
			}

			bgmResource.cache.loop(true);
			bgmResource.cache.play();

			const id = bgmResource.cache.play();
			bgmResource.cache.fade(0, event.volume, event.duration, id);

			player.updateStage({
				bgm: bgmResource,
			});
			break;
		}
		case "bgmStop": {
			const bgm = player.stage.bgm;
			if (!bgm) return;

			const bgmResource = resourceManager.getResource("bgms", bgm.id);
			if (!bgmResource) return;

			bgmResource.cache.fade(bgmResource.cache.volume(), 0, event.duration);
			bgmResource.cache.once("fade", () => {
				Howler.stop();
				player.updateStage({
					bgm: null,
				});
			});
			break;
		}
		case "effect": {
			player.updateStage({
				effect: {
					type: event.effectType,
					duration: event.duration,
				},
			});

			if (event.effectType === "shake") {
				const gameScreen = document.getElementById("game-screen");
				if (!gameScreen) return;
				await shake(event.id, event.duration, gameScreen);
			} else {
				await waitCancelable(event.duration, event.id);
			}
			break;
		}
		case "characterEffect": {
			const characterContainer = document.getElementById("character-container");
			if (!characterContainer) return;

			const characterDiv = characterContainer.querySelector(
				`#${event.characterId}`,
			);
			if (!characterDiv) return;

			const charcterImg = characterDiv.querySelector("img");
			if (!charcterImg) return;

			switch (event.effectType) {
				case "shake": {
					await shake(event.id, event.duration, charcterImg);
					break;
				}
				case "bounce": {
					await bounce(event.id, event.duration, charcterImg);
					break;
				}
				case "sway": {
					await sway(event.id, event.duration, charcterImg);
					break;
				}
				case "wobble": {
					await wobble(event.id, event.duration, charcterImg);
					break;
				}
				case "flash": {
					await flash(event.id, event.duration, charcterImg);
					break;
				}
			}
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

export const checkIfEventIsCanceled = (eventId: string) => {
	return player.cancelRequests.has(eventId);
};

const waitCancelable = async (ms: number, eventId: string) => {
	const startTime = performance.now();
	const wait = () =>
		new Promise<void>((resolve) => {
			const check = () => {
				if (
					performance.now() - startTime > ms ||
					checkIfEventIsCanceled(eventId)
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
