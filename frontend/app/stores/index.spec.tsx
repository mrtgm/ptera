import { beforeEach, describe, expect, test, vi } from "vitest";
import { Player } from "./player";

// テスト用のモックデータ
const mockGame = {
	id: "test-game",
	name: "Test Game",
	description: "Test Description",
	version: "0.1",
	scenes: [
		{
			id: "scene1",
			sceneType: "goto",
			events: [
				{
					id: "event1",
					type: "text",
					category: "message",
					lines: ["Hello World"],
				},
			],
			nextSceneId: "scene2",
		},
		{
			id: "scene2",
			sceneType: "choice",
			events: [],
			choices: [
				{ id: "choice1", text: "Option 1", nextSceneId: "scene3" },
				{ id: "choice2", text: "Option 2", nextSceneId: "scene4" },
			],
		},
	],
} as Game;

const mockResources = {
	backgroundImages: {
		bg1: {
			id: "bg1",
			filename: "bg1.jpg",
			url: "https://example.com/bg1.jpg",
		},
	},
	characters: {},
	bgms: {},
	soundEffects: {},
} as GameResources;

describe("Player", () => {
	let player: Player;

	beforeEach(() => {
		player = new Player();

		// DOMのセットアップ
		document.body.innerHTML = `
      <div id="dialog">
        <div id="dialog-text"></div>
        <div id="dialog-character-name"></div>
      </div>
      <div id="background"></div>
    `;
	});

	test("初期状態のテスト", () => {
		expect(player.currentGame).toBeNull();
		expect(player.currentScene).toBeNull();
		expect(player.currentEvent).toBeNull();
		expect(player.currentResources).toBeNull();
		expect(player.isStarted).toBe(false);
		expect(player.isAutoMode).toBe(false);
		expect(player.messageHistory).toHaveLength(0);
	});

	test("ゲームのロード", () => {
		player.loadGame(mockGame);

		expect(player.currentGame).toBe(mockGame);
		expect(player.currentScene).toBe(mockGame.scenes[0]);
		expect(player.isStarted).toBe(false);
	});

	test("シーンの設定", () => {
		player.loadGame(mockGame);
		player.setScene("scene2");

		expect(player.currentScene).toBe(mockGame.scenes[1]);
	});

	test("リソースの設定", () => {
		player.setCurrentResources(mockResources);
		expect(player.currentResources).toBe(mockResources);
	});

	test("自動モードの切り替え", () => {
		expect(player.isAutoMode).toBe(false);
		player.toggleAutoMode();
		expect(player.isAutoMode).toBe(true);
		player.toggleAutoMode();
		expect(player.isAutoMode).toBe(false);
	});

	test("キャンセルリクエストの管理", () => {
		const eventId = "test-event";

		player.addCancelRequest(eventId);
		expect(player.cancelRequests.has(eventId)).toBe(true);

		player.removeCancelRequest(eventId);
		expect(player.cancelRequests.has(eventId)).toBe(false);
	});

	test("メッセージ履歴の追加", () => {
		const message = { text: "Test message", characterName: "Character" };
		player.addToHistory(message);

		expect(player.messageHistory).toHaveLength(1);
		expect(player.messageHistory[0]).toEqual(message);
	});

	test("ステージの更新", () => {
		const updates = {
			dialog: {
				isVisible: true,
				text: "New text",
				characterName: "Character",
			},
		};

		player.updateStage(updates);

		expect(player.stage.dialog.isVisible).toBe(true);
		expect(player.stage.dialog.text).toBe("New text");
		expect(player.stage.dialog.characterName).toBe("Character");
	});

	describe("イベントの実行", () => {
		beforeEach(() => {
			// DOMの要素をモック
			document.body.innerHTML = `
        <div id="dialog">
          <div id="dialog-text"></div>
          <div id="dialog-character-name"></div>
        </div>
        <div id="background"></div>
      `;
		});

		// 現在 WaitForTap を待っちゃうのでタイムアウトする
		test("テキストイベントの実行", async () => {
			player.loadGame(mockGame);
			await player.runEvents(mockGame.scenes[0].events);

			expect(player.isStarted).toBe(true);
			expect(player.messageHistory).toHaveLength(1);
			expect(player.messageHistory[0].text).toBe("Hello World");
		});

		test("メッセージウィンドウの表示/非表示", async () => {
			const showEvent = {
				type: "appearMessageWindow",
				category: "message",
				duration: 100,
				id: "show",
			} as AppearMessageWindowEvent;

			const hideEvent = {
				type: "hideMessageWindow",
				category: "message",
				duration: 100,
				id: "hide",
			} as HideMessageWindowEvent;

			await player.runEvents([showEvent, hideEvent]);

			expect(player.stage.dialog.isVisible).toBe(false);
		});

		test("背景の変更", async () => {
			const changeBackgroundEvent = {
				type: "changeBackground",
				backgroundId: "bg1",
				duration: 100,
				id: "change-bg",
			} as ChangeBackgroundEvent;

			player.setCurrentResources(mockResources);
			await player.runEvents([changeBackgroundEvent]);

			expect(player.stage.background).toBe(mockResources.backgroundImages.bg1);
		});
	});
});
