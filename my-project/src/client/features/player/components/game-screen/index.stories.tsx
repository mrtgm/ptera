import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { GameScreen } from "./index";

import type {
	CharacterEffectEvent,
	GameResources,
	GameState,
	MessageHistory,
	ResourceCache,
	Stage,
	TextRenderEvent,
} from "@/client/schema";
import { ResourceManager } from "@/client/utils/preloader";
import mockAssets from "~/__mocks__/dummy-assets.json";
import { EventManager } from "../../utils/event";

const mockStage: Stage = {
	cg: {
		item: null,
		transitionDuration: 0,
	},
	background: {
		id: "park-day",
		transitionDuration: 300,
	},
	characters: {
		transitionDuration: 300,
		items: [
			{
				id: "mysterious-girl",
				scale: 1,
				imageId: "mysterious-girl-smile",
				position: [-0.2, 0],
				effect: null,
			},
			{
				id: "longhair-woman",
				scale: 1,
				imageId: "longhair-woman-smile",
				position: [0.2, 0],
				effect: null,
			},
		],
	},
	dialog: {
		isVisible: true,
		text: "これはテストダイアログです。",
		characterName: "キャラクター1",
		transitionDuration: 300,
	},
	choices: [],
	soundEffect: null,
	bgm: null,
	effect: null,
};

const mockHistory: MessageHistory[] = [
	{ text: "最初のダイアログです。", characterName: "キャラクター1" },
	{ text: "二番目のダイアログです。", characterName: "キャラクター2" },
	{ text: "返答します。", isChoice: true },
];

const mockTextEvent: TextRenderEvent = {
	id: "event-1",
	type: "text",
	category: "message",
	text: "これはテストダイアログです。",
	characterName: "キャラクター1",
	order: "a0",
};

const GameScreenWrapper = (args: {
	stage?: Stage;
	history?: MessageHistory[];
	state?: GameState;
	currentEvent?: TextRenderEvent;
	resourceCache?: ResourceCache;
	handleTapScreen?: (e: React.MouseEvent) => void;
}) => {
	const [stage, setStage] = useState<Stage>(args.stage || mockStage);
	const [cache, setCache] = useState<ResourceCache>({
		characters: {},
		backgroundImages: {},
		soundEffects: {},
		bgms: {},
		cgImages: {},
	});

	useEffect(() => {
		ResourceManager.getInstance()
			.loadResources(mockAssets as GameResources)
			.then(() => {
				setCache(ResourceManager.getInstance().cache);
			});
	}, []);

	const handleTapScreen = (e: React.MouseEvent) => {
		args?.handleTapScreen?.(e);
	};

	const CharacterEffectSelect = (
		id: string,
		type: CharacterEffectEvent["effectType"],
	) => {
		const newStage = {
			...mockStage,
			characters: {
				transitionDuration: 300,
				items: mockStage.characters.items.map((c) =>
					c.id === id ? { ...c, effect: { type, transitionDuration: 300 } } : c,
				),
			},
		};

		setStage(newStage);
	};

	return (
		<div className="flex flex-col items-center">
			<div className="flex flex-end w-full p-2">
				<div className="flex gap-2">
					Character Effect:
					<select
						className="border border-gray-300 rounded-md bg-white"
						onChange={(e) =>
							CharacterEffectSelect(
								"mysterious-girl",
								e.target.value as CharacterEffectEvent["effectType"],
							)
						}
					>
						{(
							[
								"shake",
								"bounce",
								"sway",
								"wobble",
								"flash",
								"blackOn",
								"blackOff",
							] as const
						).map((type) => (
							<option key={type} value={type}>
								{type}
							</option>
						))}
					</select>
				</div>
			</div>

			<GameScreen
				onTapScreen={handleTapScreen}
				onChoiceSelected={() => {}}
				onChangeAutoMode={() => {}}
				onChangeMute={() => {}}
				stage={stage || args.stage}
				history={args.history || mockHistory}
				state={args.state || "playing"}
				resourceCache={args.resourceCache || cache}
				currentEvent={args.currentEvent || mockTextEvent}
				manager={new EventManager()}
			/>
		</div>
	);
};

const meta: Meta<typeof GameScreenWrapper> = {
	title: "Game/GameScreen",
	component: GameScreenWrapper,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	argTypes: {
		state: {
			control: "select",
			options: ["loading", "beforeStart", "playing", "idle", "end"],
			description: "ゲームの現在の状態",
		},
		handleTapScreen: { action: "tapped" },
	},
};

export default meta;
type Story = StoryObj<typeof GameScreenWrapper>;

// 基本の表示
export const Default: Story = {
	args: {},
};

// 選択肢表示
export const WithChoices: Story = {
	args: {
		stage: {
			...mockStage,
			choices: [
				{ id: "choice-1", text: "選択肢1", nextSceneId: "scene-1" },
				{ id: "choice-2", text: "選択肢2", nextSceneId: "scene-2" },
				{ id: "choice-3", text: "選択肢3", nextSceneId: "scene-3" },
			],
		},
	},
};

// シェイクエフェクト
export const WithShakeEffect: Story = {
	args: {
		stage: {
			...mockStage,
			effect: {
				type: "shake",
				transitionDuration: 1000,
			},
		},
	},
};

// フェードアウトエフェクト
export const WithFadeOutEffect: Story = {
	args: {
		stage: {
			...mockStage,
			effect: {
				type: "fadeOut",
				transitionDuration: 1000,
			},
		},
	},
};

// アイドル状態
export const IdleState: Story = {
	args: {
		state: "idle",
	},
};

// メッセージウィンドウ非表示
export const HiddenDialog: Story = {
	args: {
		stage: {
			...mockStage,
			dialog: {
				...mockStage.dialog,
				isVisible: false,
			},
		},
	},
};

// 背景なし
export const NoBackground: Story = {
	args: {
		stage: {
			...mockStage,
			background: null,
		},
	},
};

// キャラクターなし
export const NoCharacters: Story = {
	args: {
		stage: {
			...mockStage,
			characters: {
				transitionDuration: 0,
				items: [],
			},
		},
	},
};

export const WithBGM: Story = {
	args: {
		stage: {
			...mockStage,
			bgm: {
				id: "peaceful-day",
				volume: 0.2,
				isPlaying: true,
				loop: true,
				transitionDuration: 300,
			},
		},
	},
};

// 効果音あり
export const WithSoundEffect: Story = {
	args: {
		stage: {
			...mockStage,
			soundEffect: {
				id: "footsteps",
				volume: 0.7,
				isPlaying: true,
				loop: false,
				transitionDuration: 0,
			},
		},
	},
};

// 終了状態
export const EndState: Story = {
	args: {
		state: "end",
	},
};
