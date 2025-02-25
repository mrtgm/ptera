interface Game {
	id: string;
	title: string;
	author: string;
	description: string;
	scenes: Scene[];
	version: string;
}

type Scene = GotoScene | ChoiceScene | EndScene;

type GotoScene = {
	id: string;
	title: string;
	sceneType: "goto";
	events: GameEvent[];
	nextSceneId: string;
};

type ChoiceScene = {
	id: string;
	title: string;
	sceneType: "choice";
	events: GameEvent[];
	choices: Choice[];
};

type EndScene = {
	id: string;
	title: string;
	sceneType: "end";
	events: GameEvent[];
};

type GameEvent =
	| TextRenderEvent
	| AppearMessageWindowEvent
	| HideMessageWindowEvent
	| AppearCharacterEvent
	| HideCharacterEvent
	| HideAllCharactersEvent
	| BGMStartEvent
	| BGMStopEvent
	| SoundEffectEvent
	| ChangeBackgroundEvent
	| EffectEvent
	| CharacterEffectEvent
	| MoveCharacterEvent
	| AppearCGEvent
	| HideCGEvent;

interface EventBase {
	id: string;
	type: string;
	category: string;
}

interface TextRenderEvent extends EventBase {
	type: "text";
	category: "message";
	lines: string[];
	characterName?: string;
}

interface AppearMessageWindowEvent extends EventBase {
	type: "appearMessageWindow";
	category: "message";
	transitionDuration: number;
}

interface HideMessageWindowEvent extends EventBase {
	type: "hideMessageWindow";
	category: "message";
	transitionDuration: number;
}

interface AppearCharacterEvent extends EventBase {
	type: "appearCharacter";
	category: "character";
	characterId: string;
	characterImageId: string;
	position: [number, number];
	scale: number;
	transitionType: "fade" | "slide";
	transitionDuration: number;
}

interface HideCharacterEvent extends EventBase {
	type: "hideCharacter";
	category: "character";
	characterId: string;
	transitionType: "fade" | "slide";
	transitionDuration: number;
}

interface HideAllCharactersEvent extends EventBase {
	type: "hideAllCharacters";
	category: "character";
	transitionType: "fade" | "slide";
	transitionDuration: number;
}

interface BGMStartEvent extends EventBase {
	type: "bgmStart";
	category: "media";
	bgmId: string;
	volume: number;
	transitionDuration: number;
}

interface BGMStopEvent extends EventBase {
	type: "bgmStop";
	category: "media";
	transitionDuration: number;
}

interface SoundEffectEvent extends EventBase {
	type: "soundEffect";
	category: "media";
	volume: number;
	soundEffectId: string;
	transitionDuration: number;
}

interface ChangeBackgroundEvent extends EventBase {
	type: "changeBackground";
	category: "background";
	backgroundId: string;
	scale: number;
	position: [number, number];
	transitionDuration: number;
}

interface EffectEvent extends EventBase {
	type: "effect";
	category: "effect";
	effectType: "fadeIn" | "fadeOut" | "shake";
	transitionDuration: number;
}

interface CharacterEffectEvent extends EventBase {
	type: "characterEffect";
	category: "effect";
	characterId: string;
	effectType:
		| "shake"
		| "flash"
		| "bounce"
		| "sway"
		| "wobble"
		| "blackOn"
		| "blackOff";
	transitionDuration: number;
}

interface MoveCharacterEvent extends EventBase {
	type: "moveCharacter";
	category: "character";
	characterId: string;
	position: [number, number];
	scale: number;
}

interface AppearCGEvent extends EventBase {
	type: "appearCG";
	category: "cg";
	imageId: string;
	position: [number, number];
	scale: number;
	transitionDuration: number;
}

interface HideCGEvent extends EventBase {
	type: "hideCG";
	category: "cg";
	transitionDuration: number;
}

interface MoveBackgroundEvent extends EventBase {
	type: "moveBackground";
	category: "background";
	position: [number, number];
	scale: number;
	transitionDuration: number;
}

interface Choice {
	id: string;
	text: string;
	nextSceneId: string;
}

interface Character {
	id: string;
	name: string;
	images: Record<string, CharacterImage>;
}

interface MediaAsset {
	id: string;
	filename: string;
	url: string;
	metadata?: {
		duration?: number;
		size?: number;
	};
}

interface CharacterImage extends MediaAsset {}
interface BackgroundImage extends MediaAsset {}
interface CGImage extends MediaAsset {}
interface SoundEffect extends MediaAsset {}
interface BGM extends MediaAsset {}

interface GameResources {
	characters: Record<string, Character>;
	backgroundImages: Record<string, BackgroundImage>;
	soundEffects: Record<string, SoundEffect>;
	bgms: Record<string, BGM>;
	cgImages: Record<string, CGImage>;
}

type Stage = {
	cg: {
		item: {
			id: string;
			scale: number;
			position: [number, number];
		} | null;
		transitionDuration: number;
	};
	background: {
		id: string;
		scale: number;
		position: [number, number];
		transitionDuration: number;
	} | null;
	characters: {
		transitionDuration: number;
		items: {
			id: string;
			scale: number;
			imageId: string;
			position: [number, number];
			effect: {
				type: CharacterEffectEvent["effectType"];
				transitionDuration: number;
			} | null;
		}[];
	};
	dialog: {
		isVisible: boolean;
		text: string;
		characterName: string | undefined;
		transitionDuration: number;
	};
	choices: Choice[];
	soundEffect: {
		id: string;
		volume: number;
		isPlaying: boolean;
		transitionDuration: number;
	} | null;
	bgm: {
		id: string;
		volume: number;
		isPlaying: boolean;
		transitionDuration: number;
	} | null;
	effect: {
		type: EffectEvent["effectType"];
		transitionDuration: number;
	} | null;
};

type MessageHistory = {
	text: string;
	characterName?: string;
	isChoice?: boolean;
};

type GameState = "loading" | "beforeStart" | "playing" | "idle" | "end";

type ResourceCache = {
	characters: {
		[id: string]: Character & {
			images: { [id: string]: { cache: HTMLImageElement } };
		};
	};
	backgroundImages: {
		[id: string]: BackgroundImage & { cache: HTMLImageElement };
	};
	cgImages: {
		[id: string]: CGImage & { cache: HTMLImageElement };
	};
	soundEffects: { [id: string]: SoundEffect & { cache: Howl } };
	bgms: { [id: string]: BGM & { cache: Howl } };
};
