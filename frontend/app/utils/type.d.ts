interface Game {
	id: string;
	name: string;
	description: string;
	scenes: Scene[];
}

type Scene = StartScene | GotoScene | ChoiceScene | EndScene;

type GotoScene = {
	id: string;
	sceneType: "goto";
	events: Event[];
	nextSceneId: string;
};

type ChoiceScene = {
	id: string;
	sceneType: "choice";
	events: Event[];
	choices: Choice[];
};

type EndScene = {
	id: string;
	sceneType: "end";
	events: Event[];
};

type Event =
	| TextEvent
	| AppearMessageWindowEvent
	| HideMessageWindowEvent
	| AppearCharacterEvent
	| HideCharacterEvent
	| HideAllCharactersEvent
	| BGMStartEvent
	| BGMStopEvent
	| SoundEffectEvent
	| ChangeBackgroundEvent
	| EffectEvent;

interface EventBase {
	id: string;
	type: string;
	category: string;
}

interface TextEvent extends EventBase {
	type: "text";
	category: "message";
	text: string;
}

interface AppearMessageWindowEvent extends EventBase {
	type: "appearMessageWindow";
	category: "message";
}

interface HideMessageWindowEvent extends EventBase {
	type: "hideMessageWindow";
	category: "message";
}

interface AppearCharacterEvent extends EventBase {
	type: "appearCharacter";
	category: "character";
	characterId: string;
	characterImageId: string;
	position: [number, number];
	scale: number;
	transition?: {
		type: "fade" | "slide" | "none";
		duration: number;
	};
}

interface HideCharacterEvent extends EventBase {
	type: "hideCharacter";
	category: "character";
	characterId: string;
}

interface HideAllCharactersEvent extends EventBase {
	type: "hideAllCharacters";
	category: "character";
}

interface BGMStartEvent extends EventBase {
	type: "bgmStart";
	category: "media";
	bgmId: string;
	volume: number;
	fadeDuration: number;
}

interface BGMStopEvent extends EventBase {
	type: "bgmStop";
	category: "media";
	bgmId: string;
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
}

interface EffectEvent extends EventBase {
	type: "effect";
	category: "effect";
	effectType: "fadeIn" | "fadeOut" | "shake";
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
	images: CharacterImage[];
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
