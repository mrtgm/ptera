import { beforeEach, describe, expect, test } from "vitest";
import dummyAssets from "~/__mocks__/dummy-assets.json";
import dummyGame from "~/__mocks__/dummy-game.json";
import type { Game, GameResources } from "~/schema";
import { buildCurrentStageFromScenes, findAllPaths } from "./utils";

describe("Player Library", () => {
	// 始点から終点までの全てのパスを取得する
	test("findAllPaths", () => {
		const game = dummyGame as Game;
		const sceneId = "opening";
		const targetSceneId = "story-continues";

		const result = findAllPaths({
			game,
			sceneId,
			targetSceneId,
		});

		expect(result.length).toEqual(5);
		expect(result[0].id).toEqual("opening");
		expect(result[4].id).toEqual("story-continues");

		const result2 = findAllPaths({
			game,
			sceneId,
			targetSceneId: "hesitant-response",
		});
		expect(result2.length).toEqual(4);
		expect(result2[0].id).toEqual("opening");
		expect(result2[3].id).toEqual("hesitant-response");
	});

	// シーンからステージを構築する
	test("buildCurrentStageFromScenes", () => {
		const game = dummyGame as Game;
		const result = findAllPaths({
			game,
			sceneId: "opening",
			targetSceneId: "hesitant-response",
		});
		const stage = buildCurrentStageFromScenes({
			scenes: result,
			currentStage: {
				background: null,
				characters: {
					transitionDuration: 0,
					items: [],
				},
				cg: {
					item: null,
					transitionDuration: 0,
				},
				choices: [],
				dialog: {
					isVisible: false,
					text: "",
					characterName: "",
					transitionDuration: 0,
				},
				bgm: null,
				soundEffect: null,
				effect: null,
			},
			resources: dummyAssets as GameResources,
		});

		expect(stage.dialog).toEqual({
			isVisible: true,
			text: "「あなたも...この桜を見に来たんですか？」",
			characterName: "???",
			transitionDuration: 0,
		});
	});
});
