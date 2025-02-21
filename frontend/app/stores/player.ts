import { waitMs } from "~/utils";
import { crossFade, fadeIn, fadeOut } from "~/utils/dom";

export class Player {
	currentGame: Game | null;
	currentScene: Scene | null;
	currentResources: GameResources | null;
	currentEvent: GameEvent | null;

	stage: Stage;

	isStarted: boolean;
	isAutoMode: boolean;
	cancelRequests: Set<string>;

	messageHistory: { text: string; characterName?: string }[];

	constructor() {
		this.currentGame = null;
		this.currentScene = null;
		this.currentResources = null;
		this.currentEvent = null;

		this.isStarted = false;

		this.stage = {
			background: null,
			characters: [],
			dialog: {
				isVisible: false,
				text: "",
				characterName: "",
			},
			soundEffect: null,
			bgm: null,
			effect: null,
		};

		this.isAutoMode = false;
		this.cancelRequests = new Set();
		this.messageHistory = [];
	}

	loadGame(game: Game) {
		this.currentGame = game;
		this.currentScene = game.scenes[0];
	}

	setScene(sceneId: string) {
		const scene =
			this.currentGame?.scenes.find((s) => s.id === sceneId) ?? null;
		if (scene) {
			this.currentScene = scene;
			this.currentEvent = scene.events[0];
		}
	}

	setCurrentResources(resources: GameResources) {
		this.currentResources = resources;
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

	addToHistory(message: { text: string; characterName?: string }) {
		this.messageHistory.push(message);
	}

	async runEvents(events: GameEvent[]) {
		this.isStarted = true;

		for (const event of events) {
			this.currentEvent = event;
			await runEvent(event);
		}
	}
}

export const player = new Player();

const runEvent = async (event: GameEvent) => {
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
					if (!dialogCharacterName || !event.characterName) return;
					dialogCharacterName.textContent = event.characterName;
				});

				player.addToHistory({ text: line, characterName: event.characterName });

				if (!player.isAutoMode) {
					await waitForTap();
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

			const backgroundResource =
				player.currentResources?.backgroundImages[event.backgroundId];

			if (!backgroundResource) return;

			player.updateStage({
				background: backgroundResource,
			});

			const exestingBackground = backgroundContainer.querySelector("img");

			const newBackground = new Image();
			newBackground.src = backgroundResource.url;
			newBackground.className = "h-full w-full relative m-auto object-cover";
			newBackground.style.opacity = "0";

			backgroundContainer?.appendChild(newBackground);

			await crossFade(
				event.id,
				exestingBackground ?? new Image(),
				newBackground,
				event.duration,
			);

			if (exestingBackground) exestingBackground.remove();
			newBackground.id = "background";

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
			player.cancelRequests.delete(eventId);
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
