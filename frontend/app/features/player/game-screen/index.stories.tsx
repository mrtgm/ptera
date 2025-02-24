import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { GameScreen } from "./index";

import mockAssets from "~/__mocks__/dummy-assets.json";
import { ResourceManager } from "~/utils/preloader";

const mockStage: Stage = {
	background: {
		id: "park-day",
		scale: 1,
		position: [0, 0],
		transitionDuration: 300,
	},
	characters: {
		transitionDuration: 300,
		items: [
			{
				id: "mysterious-girl",
				scale: 1,
				imageId: "mysterious-girl-smile",
				position: [0, 0],
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
	bgm: {
		id: "peaceful-day",
		volume: 0.2,
		isPlaying: true,
		transitionDuration: 300,
	},
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
	lines: ["これはテストダイアログです。"],
	characterName: "キャラクター1",
};

const GameScreenWrapper = (args: {
	stage?: Stage;
	history?: MessageHistory[];
	state?: GameState;
	currentEvent?: TextRenderEvent;
	resourceCache?: ResourceCache;
	handleTapScreen?: (e: React.MouseEvent) => void;
}) => {
	const [isShown, setIsShown] = useState(true);
	const [cache, setCache] = useState<ResourceCache>({
		characters: {},
		backgroundImages: {},
		soundEffects: {},
		bgms: {},
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

	return (
		<div className="flex flex-col items-center">
			<div className="mb-4">
				<button
					className="px-4 py-2 bg-blue-500 text-white rounded"
					onClick={() => setIsShown(!isShown)}
					type="button"
				>
					{isShown ? "ゲーム画面を隠す" : "ゲーム画面を表示する"}
				</button>
			</div>

			{isShown && (
				<GameScreen
					handleTapScreen={handleTapScreen}
					stage={args.stage || mockStage}
					history={args.history || mockHistory}
					state={args.state || "playing"}
					resourceCache={args.resourceCache || cache}
					currentEvent={args.currentEvent || mockTextEvent}
				/>
			)}
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

// キャラクターエフェクト
export const WithCharacterEffect: Story = {
	args: {
		stage: {
			...mockStage,
			characters: {
				transitionDuration: 300,
				items: [
					{
						id: "mysterious-girl",
						scale: 1,
						imageId: "mysterious-girl-smile",
						position: [0, 0],
						effect: {
							type: "shake",
							transitionDuration: 1000,
						},
					},
				],
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
				transitionDuration: 300,
				items: [],
			},
		},
	},
};

// BGMなし
export const NoBGM: Story = {
	args: {
		stage: {
			...mockStage,
			bgm: null,
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
