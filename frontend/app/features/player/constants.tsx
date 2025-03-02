import type { GameState, Stage } from "~/schema";

export const states: GameState[] = [
	"beforeStart",
	"playing",
	"end",
	"idle",
] as const;

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
