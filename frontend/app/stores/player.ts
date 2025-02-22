import { Howl, Howler } from "howler";
import mitt from "mitt";
import { debounce, waitMs } from "~/utils";
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

export type State = "loading" | "beforeStart" | "playing" | "idle" | "end";

export class Player {
	private static instance: Player;
	currentGame: Game | null = null;
	currentScene: Scene | null = null;
	currentEvent: GameEvent | null = null;

	state: State = "loading";
	stage: Stage = {
		background: null,
		characters: [],
		dialog: {
			isVisible: false,
			text: "",
			characterName: "",
		},
		bgm: null,
		effect: null,
	};

	isMute = false;
	isAutoMode = false;
	cancelRequests: Set<string> = new Set();

	messageHistory: { text: string; characterName?: string }[] = [];

	emitter = mitt();

	private constructor() {}

	static getInstance(): Player {
		if (!Player.instance) {
			Player.instance = new Player();
		}
		return Player.instance;
	}

	setState(state: State) {
		this.state = state;
		this.emitter.emit(state);
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
	}

	toggleAutoMode() {
		this.isAutoMode = !this.isAutoMode;
	}

	toogleMute() {
		this.isMute = !this.isMute;
	}

	addToHistory(message: { text: string; characterName?: string }) {
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
				text: "",
				characterName: "",
			},
			bgm: null,
			effect: null,
		};

		this.isAutoMode = false;
		this.cancelRequests = new Set();
		this.messageHistory = [];
	}

	async runEvents(events: GameEvent[]) {
		for (const event of events) {
			this.currentEvent = event;
			await runEvent(event);
		}

		if (this.currentScene) runBranching(this.currentScene);
	}
}

// シングルトン
export const player = Player.getInstance();

const runBranching = async (scene: Scene) => {
	if (scene.sceneType === "choice") {
		player.setState("idle");
		renderChoice(scene.choices, () => {
			player.setState("playing");
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

const renderChoice = (choices: Choice[], onNextScene: () => void) => {
	const choiceContainer = document.getElementById("choice-container");
	if (!choiceContainer) return;

	choiceContainer.style.opacity = "1";

	const choiceList = document.getElementById("choice-list");
	if (!choiceList) return;

	for (const choice of choices) {
		const choiceButton = document.createElement("li");
		choiceButton.className =
			"text-white text-lg p-2 m-2 bg-gray-800 cursor-pointer";
		choiceButton.textContent = choice.text;

		choiceButton.onclick = debounce(() => {
			choiceContainer.style.opacity = "0";
			player.setScene(choice.nextSceneId);
			player.runEvents(player.currentScene?.events ?? []);
			choiceList.innerHTML = "";

			onNextScene();
		}, 100);
		choiceList.appendChild(choiceButton);
	}
};

const runEvent = async (event: GameEvent) => {
	console.log("runEvent", event);

	switch (event.type) {
		case "text": {
			const dialogText = document.getElementById("dialog-text");
			const dialogCharacterName = document.getElementById(
				"dialog-character-name",
			);

			for (const line of event.lines) {
				await animateLine(line, event.id, (text) => {
					player.updateStage({
						dialog: {
							...player.stage.dialog,
							text,
						},
					});

					if (!dialogText) return;
					dialogText.textContent = text;
					if (!dialogCharacterName) return;
					dialogCharacterName.textContent = event.characterName ?? "";
				});

				player.addToHistory({ text: line, characterName: event.characterName });

				if (!player.isAutoMode) {
					const renderArrow = () => {
						const dialogText = document.getElementById("dialog-text");
						if (!dialogText) return;

						const arrow = document.createElement("span");
						arrow.textContent = "▼";
						arrow.className =
							"text-white text-sm animate-bounce inline-block ml-2";
						dialogText.appendChild(arrow);
					};

					renderArrow();

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
			const dialog = document.getElementById("dialog");
			if (!dialog) return;

			player.updateStage({
				dialog: {
					...player.stage.dialog,
					isVisible: true,
				},
			});
			await fadeIn(event.id, event.duration, dialog);
			break;
		}
		case "hideMessageWindow": {
			const dialog = document.getElementById("dialog");
			if (!dialog) return;

			player.updateStage({
				dialog: {
					...player.stage.dialog,
					isVisible: false,
				},
			});
			await fadeOut(event.id, event.duration, dialog);
			break;
		}
		case "changeBackground": {
			const backgroundContainer = document.getElementById("background");

			if (!backgroundContainer) return;

			const backgroundResource = resourceManager.getResource(
				"backgroundImages",
				event.backgroundId,
			);

			if (!backgroundResource) return;

			player.updateStage({
				background: event,
			});

			const exestingBackground = backgroundContainer.querySelector("img");

			const newBackground = new Image();
			newBackground.src = backgroundResource.url;
			newBackground.className = "h-full w-full relative m-auto object-cover";
			newBackground.style.transform = `scale(${event.scale})`;

			const calcPosition = (position: [number, number]) => {
				const [x, y] = position;
				return `left: ${x * 100}%; top: ${y * 100}%;`;
			};

			newBackground.style.cssText += calcPosition(
				event.position ? event.position : [0.5, 0.5],
			);

			newBackground.style.opacity = "0";

			backgroundContainer?.appendChild(newBackground);

			await crossFade(
				event.id,
				event.duration,
				exestingBackground ?? new Image(),
				newBackground,
			);

			if (exestingBackground) exestingBackground.remove();
			newBackground.id = "background";

			break;
		}
		case "appearCharacter": {
			const characterContainer = document.getElementById("character-container");
			if (!characterContainer) return;

			const characterResource = resourceManager.getResource(
				"characters",
				event.characterId,
			);

			if (!characterResource) return;

			const characterDiv = document.createElement("div");
			characterDiv.id = event.characterId;
			characterDiv.className =
				"object-contain absolute -translate-x-1/2 -translate-y-1/2";
			characterDiv.style.top = "50%";
			characterDiv.style.left = "50%";
			characterDiv.style.minWidth = "max-content";
			characterDiv.style.width = "100%";
			characterDiv.style.height = `${event.scale * 100}%`;

			const existingCharacter = characterContainer.querySelector(
				`#${event.characterId}`,
			);

			const characterImage = new Image();
			characterImage.src = characterResource.images[event.characterImageId].url;
			characterImage.className = "h-full w-auto relative m-auto";
			characterImage.style.top = `${event.position[1] * 100}%`;
			characterImage.style.left = `${event.position[0] * 100}%`;
			characterImage.style.opacity = "0";

			characterDiv.appendChild(characterImage);
			characterContainer.appendChild(characterDiv);

			if (!existingCharacter) {
				await fadeIn(event.id, event.duration, characterImage);
			} else {
				await crossFade(
					event.id,
					event.duration,
					existingCharacter.querySelector("img") ?? new Image(),
					characterImage,
				);
				existingCharacter.remove();
			}

			player.updateStage({
				characters: [
					...player.stage.characters,
					{
						id: event.characterId,
						scale: event.scale,
						imageId: event.characterImageId,
						position: event.position,
					},
				],
			});
			break;
		}
		case "hideCharacter": {
			const characterContainer = document.getElementById("character-container");
			if (!characterContainer) return;

			const characterDiv = characterContainer.querySelector(
				`#${event.characterId}`,
			);
			if (!characterDiv) return;

			const characterImage = characterDiv.querySelector("img");
			if (!characterImage) return;

			await fadeOut(event.id, event.duration, characterImage);

			characterDiv.remove();

			player.updateStage({
				characters: player.stage.characters.filter(
					(c) => c.id !== event.characterId,
				),
			});
			break;
		}
		case "hideAllCharacters": {
			const characterContainer = document.getElementById("character-container");
			if (!characterContainer) return;

			const characters = characterContainer.querySelectorAll("div");
			if (!characters) return;

			for (const character of characters) {
				const characterImage = character.querySelector("img");
				if (!characterImage) continue;

				await fadeOut(event.id, event.duration, characterImage);

				character.remove();
			}

			player.updateStage({
				characters: [],
			});
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
				bgm: bgmResource.cache,
			});
			break;
		}
		case "bgmStop": {
			const bgm = player.stage.bgm;
			if (!bgm) return;

			bgm.fade(bgm.volume(), 0, event.duration);
			bgm.once("fade", () => {
				Howler.stop();
				player.updateStage({
					bgm: null,
				});
			});

			break;
		}
		case "effect": {
			const effectContainer = document.getElementById("effect-container");
			if (!effectContainer) return;

			const effectDiv = document.createElement("div");
			effectDiv.className = "absolute h-full w-full bg-black";

			effectContainer.appendChild(effectDiv);

			if (event.effectType === "fadeOut") {
				effectDiv.style.opacity = "0";
				await fadeIn(event.id, event.duration, effectDiv);
			}
			if (event.effectType === "fadeIn") {
				effectDiv.style.opacity = "1";
				await fadeOut(event.id, event.duration, effectDiv);
			}
			if (event.effectType === "shake") {
				const gameScreen = document.getElementById("game-screen");
				if (!gameScreen) return;
				effectDiv.style.opacity = "0";
				await shake(event.id, event.duration, gameScreen);
			}

			player.updateStage({
				effect: event,
			});

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
		const handleTap = () => {
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
