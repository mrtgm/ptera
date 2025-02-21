import { beforeEach, describe, expect, test } from "vitest";
import { useStore } from "./index";

// テスト用のモックデータ
const mockGame: Game = {
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
};

// 各テスト前にストアをリセット
beforeEach(() => {
	useStore.setState({
		userId: undefined,
		saveData: {},
		currentGame: null,
		currentScene: null,
		currentEventIndex: 0,
		messageHistory: [],
	});
});

describe("Integration Tests", () => {
	test("ゲームのプレイからセーブまでの流れ", () => {
		useStore.getState().setUserId("test-user");
		expect(useStore.getState().userId).toBe("test-user");

		useStore.getState().loadGame(mockGame);

		// ゲームはロードされているか？
		expect(useStore.getState().currentGame?.name).toBe("Test Game");
		expect(useStore.getState().currentScene?.id).toBe("scene1");

		useStore.getState().nextEvent();

		// イベントが進んだか？
		expect(useStore.getState().currentEventIndex).toBe(1);

		// メッセージ履歴が保存されているか？
		expect(useStore.getState().messageHistory).toHaveLength(1);
		expect(useStore.getState().messageHistory[0].text).toBe("Hello World");

		useStore
			.getState()
			.savePath(
				useStore.getState().currentGame?.id || "",
				useStore.getState().currentScene?.id || "",
				useStore.getState().currentEventIndex,
			);

		// セーブデータが保存されているか？
		expect(useStore.getState().saveData["test-game"]).toBeDefined();

		// 現在のシーンIDとイベントインデックスが保存されているか？
		expect(useStore.getState().saveData["test-game"].currentSceneId).toBe(
			"scene1",
		);
		expect(useStore.getState().saveData["test-game"].currentEventIndex).toBe(1);
		expect(useStore.getState().saveData["test-game"].playHistory).toHaveLength(
			1,
		);
		expect(useStore.getState().saveData["test-game"].playHistory[0]).toBe(
			"scene1",
		);
	});
});
