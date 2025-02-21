import { beforeEach, describe, expect, test } from "vitest";
import dummyAssets from "~/datas/dummy-assets.json";
import dummyGame from "~/datas/dummy-game.json";
import { buildCurrentStageFromScenes, findAllPaths } from ".";

describe("Player Library", () => {
	// 始点から終点までの全てのパスを取得する
	test("findAllPaths", () => {
		const game = dummyGame as Game;
		const sceneId = "opening";
		const targetSceneId = "story-continues";

		const result = findAllPaths(game, sceneId, targetSceneId);

		expect(result.length).toEqual(5);
		expect(result[0].id).toEqual("opening");
		expect(result[4].id).toEqual("story-continues");

		const result2 = findAllPaths(game, "opening", "hesitant-response");
		expect(result2.length).toEqual(4);
		expect(result2[0].id).toEqual("opening");
		expect(result2[3].id).toEqual("hesitant-response");
	});

	// シーンからステージを構築する
	test("buildCurrentStageFromScenes", () => {
		const game = dummyGame as Game;
		const result = findAllPaths(game, "opening", "hesitant-response");
		const stage = buildCurrentStageFromScenes(
			result,
			{
				background: null,
				characters: [],
				dialog: {
					isVisible: false,
					lines: [],
					characterName: "",
				},
				soundEffect: null,
				bgm: null,
				effect: null,
			},
			dummyAssets as GameResources,
		);

		expect(stage.dialog).toEqual({
			isVisible: true,
			lines: ["「あなたも...この桜を見に来たんですか？」"],
			characterName: "???",
		});
	});
});
