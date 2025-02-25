import type { GameState } from "~/schema";

export const states: GameState[] = [
	"beforeStart",
	"playing",
	"end",
	"idle",
] as const;
