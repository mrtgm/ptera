import { Howler } from "howler";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Choice, Game, GameEvent, MessageHistory, Stage } from "~/schema";
import { Player } from "./engine";

vi.mock("howler", () => {
	return {
		Howler: {
			mute: vi.fn(),
			stop: vi.fn(),
		},
	};
});

// モック用のグローバルオブジェクト
global.requestAnimationFrame = vi.fn((callback) => {
	callback(0);
	return 0;
});

const mockGame: Game = {
	id: "test",
	title: "テストゲーム",
	version: "1.0.0",
	author: "テスト",
	description: "テストゲームです",
	scenes: [
		{
			id: "scene1",
			title: "scene1",
			events: [
				{
					id: "event1",
					type: "text",
					text: "テスト",
					category: "message",
				},
			],
			sceneType: "choice",
			choices: [],
		},
		{
			id: "scene2",
			title: "scene2",
			events: [
				{
					id: "event1",
					type: "text",
					text: "テスト",
					category: "message",
				},
			],
			sceneType: "goto",
			nextSceneId: "scene1",
		},
	],
};

// テスト
describe("Player", () => {
	let player: Player;

	beforeEach(() => {
		// DOM要素のモック
		document.body.innerHTML = `
      <div id="initial-screen-title"></div>
      <div id="game-screen"></div>
    `;

		player = new Player();
		player.resetGame();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("ゲームをロードできること", () => {
		player.loadGame(mockGame);

		expect(player.currentGame).toBe(mockGame);
		expect(player.currentScene).toBe(mockGame.scenes[0]);
		expect(document.getElementById("initial-screen-title")?.textContent).toBe(
			"テストゲーム",
		);
	});

	it("シーンを設定できること", () => {
		player.loadGame(mockGame);
		player.updateScene("scene2");

		expect(player.currentScene).toBe(mockGame.scenes[1]);
		expect(player.currentEvent).toBe(mockGame.scenes[1].events[0]);
	});

	it("キャンセルリクエストを管理できること", () => {
		const eventId = "event1";

		player.addCancelRequest(eventId);
		expect(player.checkIfEventIsCanceled(eventId)).toBe(true);

		player.removeCancelRequest(eventId);
		expect(player.checkIfEventIsCanceled(eventId)).toBe(false);
	});

	it("ステージを更新できること", () => {
		const stageUpdateSpy = vi.spyOn(player.emitter, "emit");
		const stageUpdate: Partial<Stage> = {
			background: {
				id: "bg1",
				transitionDuration: 300,
			},
		};

		player.updateStage(stageUpdate);

		expect(player.stage.background).toEqual(stageUpdate.background);
		expect(stageUpdateSpy).toHaveBeenCalledWith(
			"stageUpdated",
			expect.objectContaining({
				background: stageUpdate.background,
			}),
		);
	});

	it("現在のイベントを更新できること", () => {
		const eventUpdateSpy = vi.spyOn(player.emitter, "emit");
		const mockEvent: GameEvent = {
			id: "event1",
			type: "text",
			text: "テスト",
			category: "message",
		};

		player.updateCurrentEvent(mockEvent);

		expect(eventUpdateSpy).toHaveBeenCalledWith(
			"currentEventUpdated",
			mockEvent,
		);
	});

	it("自動モードをトグルできること", () => {
		expect(player.isAutoMode).toBe(false);

		player.toggleAutoMode();
		expect(player.isAutoMode).toBe(true);

		player.toggleAutoMode();
		expect(player.isAutoMode).toBe(false);
	});

	it("ミュートをトグルできること", () => {
		expect(player.isMute).toBe(false);

		player.toggleMute();
		expect(player.isMute).toBe(true);
		expect(Howler.mute).toHaveBeenCalledWith(true);

		player.toggleMute();
		expect(player.isMute).toBe(false);
		expect(Howler.mute).toHaveBeenCalledWith(false);
	});

	it("履歴に追加できること", () => {
		const historyUpdateSpy = vi.spyOn(player.emitter, "emit");
		const message: MessageHistory = {
			text: "テストメッセージ",
			characterName: "キャラクター",
		};

		player.addToHistory(message);

		expect(player.messageHistory).toContain(message);
		expect(historyUpdateSpy).toHaveBeenCalledWith(
			"historyUpdated",
			player.messageHistory,
		);
	});

	it("履歴をクリアできること", () => {
		player.addToHistory({ text: "テストメッセージ" });
		const historyUpdateSpy = vi.spyOn(player.emitter, "emit");

		player.clearHistory();

		expect(player.messageHistory).toEqual([]);
		expect(historyUpdateSpy).toHaveBeenCalledWith("historyUpdated", []);
	});

	it("ゲームをリセットできること", () => {
		player.loadGame(mockGame);
		player.updateScene("scene2");
		player.addToHistory({ text: "テスト" });
		player.toggleAutoMode();
		player.addCancelRequest("event1");

		player.resetGame();

		expect(player.currentScene).toBe(mockGame.scenes[0]);
		expect(player.state).toBe("beforeStart");
		expect(player.messageHistory).toEqual([]);
		expect(player.isAutoMode).toBe(false);
		expect(player.cancelTransitionRequests.size).toBe(0);
		expect(Howler.stop).toHaveBeenCalled();
	});

	it("選択肢を選択できること", () => {
		const runEventsSpy = vi.spyOn(player, "runEvents");
		const stageUpdateSpy = vi.spyOn(player, "updateStage");

		player.loadGame(mockGame);

		const choice: Choice = {
			id: "choice1",
			text: "選択肢",
			nextSceneId: "scene2",
		};

		player.selectChoice(choice);

		expect(player.messageHistory[0]).toEqual({
			text: "選択肢",
			isChoice: true,
		});
		expect(player.currentScene).toBe(mockGame.scenes[1]);
		expect(player.state).toBe("playing");
		expect(runEventsSpy).toHaveBeenCalled();
		expect(stageUpdateSpy).toHaveBeenCalledWith({ choices: [] });
	});

	it("ゲームを開始できること", async () => {
		const runEventsSpy = vi.spyOn(player, "runEvents");

		player.loadGame(mockGame);
		await player.startGame();

		expect(player.state).toBe("playing");
		expect(runEventsSpy).toHaveBeenCalledWith(mockGame.scenes[0].events);
	});
});
