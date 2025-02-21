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
	sceneType: "goto";
	events: GameEvent[];
	nextSceneId: string;
};

type ChoiceScene = {
	id: string;
	sceneType: "choice";
	events: GameEvent[];
	choices: Choice[];
};

type EndScene = {
	id: string;
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
	| CharacterEffectEvent;

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
	duration: number;
}

interface HideMessageWindowEvent extends EventBase {
	type: "hideMessageWindow";
	category: "message";
	duration: number;
}

interface AppearCharacterEvent extends EventBase {
	type: "appearCharacter";
	category: "character";
	characterId: string;
	characterImageId: string;
	position: [number, number];
	scale: number;
	transitionType: "fade" | "slide";
	duration: number;
}

interface HideCharacterEvent extends EventBase {
	type: "hideCharacter";
	category: "character";
	characterId: string;
	transitionType: "fade" | "slide";
	duration: number;
}

interface HideAllCharactersEvent extends EventBase {
	type: "hideAllCharacters";
	category: "character";
	transitionType: "fade" | "slide";
	duration: number;
}

interface BGMStartEvent extends EventBase {
	type: "bgmStart";
	category: "media";
	bgmId: string;
	volume: number;
	duration: number;
}

interface BGMStopEvent extends EventBase {
	type: "bgmStop";
	category: "media";
	bgmId: string;
	duration: number;
}

interface SoundEffectEvent extends EventBase {
	type: "soundEffect";
	category: "media";
	volume: number;
	duration: number;
	soundEffectId: string;
}

interface ChangeBackgroundEvent extends EventBase {
	type: "changeBackground";
	category: "background";
	backgroundId: string;
	duration: number;
}

interface EffectEvent extends EventBase {
	type: "effect";
	category: "effect";
	effectType: "fadeIn" | "fadeOut" | "shake";
	duration: number;
}

interface CharacterEffectEvent extends EventBase {
	type: "characterEffect";
	category: "effect";
	characterId: string;
	effectType: "shake" | "flash" | "bounce" | "sway" | "wobble";
	duration: number;
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
interface SoundEffect extends MediaAsset {}
interface BGM extends MediaAsset {}

interface BackgroundImage extends MediaAsset {}

interface GameResources {
	characters: Record<string, Character>;
	backgroundImages: Record<string, BackgroundImage>;
	soundEffects: Record<string, SoundEffect>;
	bgms: Record<string, BGM>;
}

type Stage = {
	background: BackgroundImage | null;
	characters: {
		id: string;
		scale: number;
		imageId: string;
		position: [number, number];
	}[];
	dialog: {
		isVisible: boolean;
		text: string;
		characterName: string;
	};
	bgm: Howl | null;
	effect: GameEvent | null;
};
