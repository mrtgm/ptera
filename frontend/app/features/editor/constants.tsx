import {
	EyeOff,
	FileImage,
	HeadphoneOff,
	Headphones,
	Image,
	MessageCircleMore,
	MessageCircleOff,
	Move,
	Pen,
	UserMinus,
	UserX,
	Users,
	Volume2,
	Zap,
} from "lucide-react";
import type { ReactElement } from "react";
import type { GameEvent } from "~/schema";

export type ComponentType =
	| "text"
	| "character-name-input"
	| "character-select"
	| "character-image-select"
	| "position-select"
	| "transition-duration"
	| "bgm-select"
	| "volume-slider"
	| "sound-effect-select"
	| "background-select"
	| "effect-select"
	| "character-effect-select"
	| "cg-select";

export type SidebarItemParameter = {
	label: string;
	component: ComponentType;
};

export type SidebarItem = {
	id: string;
	type: GameEvent["type"];
	icon: ReactElement;
	label: string;
	parameters: SidebarItemParameter[];
};

export const SideBarSettings: Record<
	GameEvent["category"],
	{
		hex: string;
		label: string;
		items: SidebarItem[];
	}
> = {
	message: {
		hex: "#6366F1", // Indigo
		label: "メッセージ",
		items: [
			{
				id: "text",
				type: "text", // matches EventType
				icon: <Pen />,
				label: "テキスト",
				parameters: [
					{
						label: "テキスト",
						component: "text",
					},
					{
						label: "キャラクタ名",
						component: "character-name-input",
					},
				],
			},
			{
				id: "appearMessageWindow",
				type: "appearMessageWindow",
				icon: <MessageCircleMore />,
				label: "メッセージウィンドウを表示",
				parameters: [
					{
						label: "トランジション時間（秒）",
						component: "transition-duration",
					},
				],
			},
			{
				id: "hideMessageWindow",
				type: "hideMessageWindow",
				icon: <MessageCircleOff />,
				label: "メッセージウィンドウを非表示",
				parameters: [
					{
						label: "トランジション時間（秒）",
						component: "transition-duration",
					},
				],
			},
		],
	},
	character: {
		hex: "#F59E0B", // Amber
		label: "キャラクター",
		items: [
			{
				id: "appearCharacter",
				type: "appearCharacter",
				icon: <Users />,
				label: "キャラクターを表示",
				parameters: [
					{
						label: "キャラクターと画像を選択",
						component: "character-image-select",
					},
					{
						label: "トランジション時間（秒）",
						component: "transition-duration",
					},
				],
			},
			{
				id: "hideCharacter",
				type: "hideCharacter",
				icon: <UserMinus />,
				label: "キャラクターを非表示",
				parameters: [
					{
						label: "キャラクター",
						component: "character-select",
					},
					{
						label: "トランジション時間（秒）",
						component: "transition-duration",
					},
				],
			},
			{
				id: "hideAllCharacters",
				type: "hideAllCharacters",
				icon: <UserX />,
				label: "すべてのキャラクターを非表示",
				parameters: [
					{
						label: "トランジション時間（秒）",
						component: "transition-duration",
					},
				],
			},
			{
				id: "moveCharacter",
				type: "moveCharacter",
				icon: <Move />,
				label: "キャラクターを移動",
				parameters: [
					{
						label: "キャラクター",
						component: "character-select",
					},
					{
						label: "位置",
						component: "position-select",
					},
					{
						label: "移動時間（秒）",
						component: "transition-duration",
					},
				],
			},
			{
				id: "characterEffect",
				type: "characterEffect",
				icon: <Zap />,
				label: "キャラクターエフェクト",
				parameters: [
					{
						label: "キャラクター",
						component: "character-select",
					},
					{
						label: "エフェクト",
						component: "character-effect-select",
					},
					{
						label: "エフェクト時間（秒）",
						component: "transition-duration",
					},
				],
			},
		],
	},
	media: {
		hex: "#EC4899", // Pink
		label: "メディア",
		items: [
			{
				id: "bgmStart",
				type: "bgmStart",
				icon: <Headphones />,
				label: "BGM開始",
				parameters: [
					{
						label: "BGM",
						component: "bgm-select",
					},
					{
						label: "音量",
						component: "volume-slider",
					},
					{
						label: "トランジション時間（秒）",
						component: "transition-duration",
					},
				],
			},
			{
				id: "bgmStop",
				type: "bgmStop",
				icon: <HeadphoneOff />,
				label: "BGM停止",
				parameters: [
					{
						label: "トランジション時間（秒）",
						component: "transition-duration",
					},
				],
			},
			{
				id: "soundEffect",
				type: "soundEffect",
				icon: <Volume2 />,
				label: "効果音",
				parameters: [
					{
						label: "効果音",
						component: "sound-effect-select",
					},
					{
						label: "音量",
						component: "volume-slider",
					},
					{
						label: "トランジション時間（秒）",
						component: "transition-duration",
					},
				],
			},
		],
	},
	background: {
		hex: "#10B981", // Emerald
		label: "背景",
		items: [
			{
				id: "changeBackground",
				type: "changeBackground",
				icon: <Image />,
				label: "背景を変更",
				parameters: [
					{
						label: "背景",
						component: "background-select",
					},
					{
						label: "トランジション時間（秒）",
						component: "transition-duration",
					},
				],
			},
		],
	},
	effect: {
		hex: "#8B5CF6", // Violet
		label: "エフェクト",
		items: [
			{
				id: "effect",
				type: "effect",
				icon: <Zap />,
				label: "画面エフェクト",
				parameters: [
					{
						label: "エフェクト",
						component: "effect-select",
					},
					{
						label: "エフェクト時間（秒）",
						component: "transition-duration",
					},
				],
			},
		],
	},
	cg: {
		hex: "#F43F5E", // Rose
		label: "CG",
		items: [
			{
				id: "appearCG",
				type: "appearCG",
				icon: <FileImage />,
				label: "CGを表示",
				parameters: [
					{
						label: "CG",
						component: "cg-select",
					},
					{
						label: "トランジション時間（秒）",
						component: "transition-duration",
					},
				],
			},
			{
				id: "hideCG",
				type: "hideCG",
				icon: <EyeOff />,
				label: "CGを非表示",
				parameters: [
					{
						label: "トランジション時間（秒）",
						component: "transition-duration",
					},
				],
			},
		],
	},
} as const;

export const createEventFromSidebarItem = (
	item: (typeof SideBarSettings)[keyof typeof SideBarSettings]["items"][number],
) => {
	const event: Partial<GameEvent> = {
		id: crypto.randomUUID(),
		type: item.type,
		category: getEventCategory(item.type),
	} as GameEvent;

	return event;
};

export const getEventTitle = (type: string): string => {
	const title = Object.entries(SideBarSettings)
		.flatMap(([_, value]) => {
			return value.items.map((item) => {
				if (item.type === type) {
					return item.label;
				}
			});
		})
		.filter(Boolean);

	if (title.length === 0) {
		return "不明";
	}

	return title[0] as string;
};

export const getEventCategory = (type: string): GameEvent["category"] => {
	switch (type) {
		case "text":
		case "appearMessageWindow":
		case "hideMessageWindow":
			return "message";
		case "appearCharacter":
		case "hideCharacter":
		case "hideAllCharacters":
		case "moveCharacter":
			return "character";
		case "bgmStart":
		case "bgmStop":
		case "soundEffect":
			return "media";
		case "changeBackground":
		case "moveBackground":
			return "background";
		case "effect":
		case "characterEffect":
			return "effect";
		case "appearCG":
		case "hideCG":
			return "cg";
		default:
			return "message";
	}
};
