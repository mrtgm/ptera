import { ENV } from "@ptera/config";
import type { CreateGameRequest, Game, GotoScene } from "@ptera/schema";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { api } from "../src/client/api";

const testUser = {
  id: 1,
  name: "Test User",
  email: "test@example.com",
  password: "password123",
};

const testGame: CreateGameRequest = {
  name: "Test Game",
  description: "A test game created by automated tests",
};

describe("API Client Integration Tests", () => {
  let authToken: string;
  let gameId: number;

  // 全テスト開始前に一度だけログイン
  beforeAll(async () => {
  const loginRes = await fetch(
      `http://localhost/api/${ENV.NEXT_PUBLIC_API_VERSION}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
        }),
        credentials: "include",
      },
    );


    const cookies = loginRes.headers.get("set-cookie");
    if (cookies) {
      const match = cookies.match(/ptera-auth=([^;]+)/);
      if (match) {
        authToken = match[1];
        // トークンをAPIクライアントに設定
        api.withToken(authToken);
      }
    }

    if (!authToken) {
      throw new Error(
        "認証に失敗しました。テストユーザーが存在するか確認してください。",
      );
    }
  });

  describe("認証関連API", () => {
    it("ログインユーザー情報を取得できる", async () => {
      const user = await api.auth.me();
      expect(user).toBeDefined();
      expect(user?.id).toBeDefined();
      expect(user?.name).toBeDefined();
    });

    it("ユーザーのゲーム一覧を取得できる", async () => {
      const games = await api.auth.getMyGames();
      expect(games).toBeDefined();
      expect(Array.isArray(games)).toBe(true);
    });
  });

  describe("ゲーム関連API", () => {
    // 各テスト開始前にゲームを作成
    beforeEach(async () => {
      if (!gameId) {
        const game = await api.games.create(testGame);
        gameId = game?.id as number;
        expect(gameId).toBeDefined();
      }
    });

    // すべてのテスト終了後にゲームを削除
    afterAll(async () => {
      if (gameId) {
        const success = await api.games.delete(gameId);
        expect(success).toBe(true);
      }
    });

    it("ゲーム一覧を取得できる", async () => {
      const result = await api.games.list({
        limit: 10,
        offset: 0,
        sort: "createdAt",
        order: "desc",
      });

      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(Array.isArray(result.items)).toBe(true);
      expect(result.total).toBeGreaterThan(0);
    });

    it("ゲームを取得できる", async () => {
      const game = await api.games.get(gameId);
      expect(game).toBeDefined();
      expect(game?.id).toBe(gameId);
      expect(game?.name).toBe(testGame.name);
    });

    it("ゲームを更新できる", async () => {
      const updatedTitle = "Updated Test Game";
      const updatedGame = await api.games.update(gameId, {
        name: updatedTitle,
        description: testGame.description,
      });

      expect(updatedGame).toBeDefined();
      expect(updatedGame?.name).toBe(updatedTitle);

      // 元に戻す
      await api.games.update(gameId, testGame);
    });

    it("ゲームのステータスを更新できる", async () => {
      const updatedStatus = await api.games.updateStatus(gameId, {
        status: "published",
      });

      expect(updatedStatus).toBeDefined();
      expect(updatedStatus?.status).toBe("published");

      // 元に戻す
      await api.games.updateStatus(gameId, {
        status: "draft",
      });
    });

    it("いいねを追加・取り消しできる", async () => {
      // いいね追加
      const likeResult = await api.games.like(gameId);
      expect(likeResult).toBeDefined();
      expect(likeResult?.count).toBeGreaterThan(0);

      // いいね取り消し
      const unlikeResult = await api.games.unlike(gameId);
      expect(unlikeResult).toBeDefined();
      expect(unlikeResult?.count).toBeLessThan(likeResult?.count as number);
    });
  });

  describe("シーン関連API", () => {
    let sceneId: number;
    let scene2Id: number;

    it("シーンを作成できる", async () => {
      const scene = await api.games.scenes.create(gameId, {
        name: "Test Scene",
        fromScene: {
          id: 0,
          sceneType: "end",
        },
      });

      const scene2 = await api.games.scenes.create(gameId, {
        name: "Test Scene",
        fromScene: {
          id: scene?.id as number,
          sceneType: "end",
        },
      });

      expect(scene).toBeDefined();
      expect(scene?.id).toBeDefined();
      expect(scene?.name).toBe("Test Scene");

      expect(scene2).toBeDefined();
      expect(scene2?.id).toBeDefined();
      expect(scene2?.name).toBe("Test Scene");

      sceneId = scene?.id as number;
      scene2Id = scene2?.id as number;
    });

    it("シーンを取得できる", async () => {
      const scene = await api.games.scenes.get(gameId, sceneId);
      expect(scene).toBeDefined();
      expect(scene?.id).toBe(sceneId);
      expect(scene?.name).toBe("Test Scene");
    });

    it("シーンを更新できる", async () => {
      const scene = (await api.games.scenes.update(gameId, sceneId, {
        sceneType: "goto",
        nextSceneId: scene2Id,
      })) as GotoScene;

      expect(scene).toBeDefined();
      expect(scene?.id).toBe(sceneId);
      expect(scene?.sceneType).toBe("goto");
      expect(scene?.nextSceneId).toBe(scene2Id);
    });

    it("シーン設定を更新できる", async () => {
      const updatedName = "Updated Test Scene";
      const scene = await api.games.scenes.updateSetting(gameId, sceneId, {
        name: "Updated Test Scene",
      });

      expect(scene).toBeDefined();
      expect(scene?.name).toBe(updatedName);
    });

    describe("イベント関連API", () => {
      let eventId: number;

      it("イベントを作成できる", async () => {
        const event = await api.games.scenes.events.create(gameId, sceneId, {
          type: "textRender",
          orderIndex: "a0",
        });

        expect(event).toBeDefined();
        expect(event?.id).toBeDefined();
        expect(event?.eventType).toBe("textRender");

        eventId = event?.id as number;
      });

      it("イベントを更新できる", async () => {
        const updatedText = "Updated test message";
        const event = await api.games.scenes.events.update(
          gameId,
          sceneId,
          eventId,
          {
            id: eventId,
            orderIndex: "a0",
            eventType: "appearMessageWindow",
            transitionDuration: 0.5,
            category: "message",
          },
        );

        expect(event).toBeDefined();
        expect(event?.id).toBe(eventId);
        expect(event?.eventType).toBe("appearMessageWindow");
        expect(event?.transitionDuration).toBe(0.5);
      });

      it("イベントの順序を変更できる", async () => {
        // まず2つ目のイベントを作成
        const secondEvent = await api.games.scenes.events.create(
          gameId,
          sceneId,
          {
            type: "textRender",
            orderIndex: "a1",
          },
        );

        // 順序を入れ替え
        const success = await api.games.scenes.events.move(gameId, sceneId, {
          eventId: eventId,
          newOrderIndex: "a1",
        });

        expect(success).toBe(true);

        // クリーンアップ
        await api.games.scenes.events.delete(
          gameId,
          sceneId,
          secondEvent?.id as number,
        );
      });

      it("イベントを削除できる", async () => {
        const success = await api.games.scenes.events.delete(
          gameId,
          sceneId,
          eventId,
        );
        expect(success).toBe(true);
      });
    });

    // シーンのクリーンアップ
    afterAll(async () => {
      if (sceneId) {
        const success = await api.games.scenes.delete(gameId, sceneId);
        expect(success).toBe(true);
      }
    });
  });

  describe("アセット関連API", () => {
    let assetId: number;
    let testFile: File;

    beforeAll(() => {
      // テスト用ファイルの作成
      const blob = new Blob(["test"], { type: "image/png" });
      testFile = new File([blob], "test.png", { type: "image/png" });
    });

    it("アセットをアップロードできる", async () => {
      const asset = await api.assets.upload({
        file: testFile,
        assetType: "backgroundImage",
        name: "Test Background",
        metadata: {
          width: 800,
          height: 600,
        },
      });

      expect(asset).toBeDefined();
      expect(asset?.id).toBeDefined();
      expect(asset?.name).toBe("Test Background");

      assetId = asset?.id as number;
    });

    it("アセットを更新できる", async () => {
      const updatedName = "Updated Test Background";
      const asset = await api.assets.update(assetId, {
        name: updatedName,
      });

      expect(asset).toBeDefined();
      expect(asset?.name).toBe(updatedName);
    });

    it("アセットを削除できる", async () => {
      const success = await api.assets.delete(assetId);
      expect(success).toBe(true);
    });
  });

  describe("キャラクター関連API", () => {
    let characterId: number;
    let characterAssetId: number;

    beforeAll(async () => {
      // テスト用画像アセットをアップロード
      const blob = new Blob(["test"], { type: "image/png" });
      const testFile = new File([blob], "character.png", { type: "image/png" });

      const asset = await api.assets.upload({
        file: testFile,
        assetType: "characterImage",
        name: "Test Character Image",
        metadata: {
          width: 400,
          height: 800,
        },
      });

      characterAssetId = asset?.id as number;
    });

    it("キャラクターを作成できる", async () => {
      const character = await api.characters.create({
        name: "Test Character",
      });

      expect(character).toBeDefined();
      expect(character?.id).toBeDefined();
      expect(character?.name).toBe("Test Character");

      characterId = character?.id as number;
    });

    it("キャラクターにアセットをリンクできる", async () => {
      const success = await api.characters.linkAsset(characterId, {
        assetId: characterAssetId,
      });

      expect(success).toBe(true);
    });

    it("キャラクターからアセットのリンクを解除できる", async () => {
      const success = await api.characters.unlinkAsset(
        characterId,
        characterAssetId,
      );
      expect(success).toBe(true);
    });

    it("キャラクターを更新できる", async () => {
      const updatedName = "Updated Test Character";
      const character = await api.characters.update(characterId, {
        name: updatedName,
      });

      expect(character).toBeDefined();
      expect(character?.name).toBe(updatedName);
    });

    it("キャラクターを削除できる", async () => {
      const success = await api.characters.delete(characterId);
      expect(success).toBe(true);
    });

    afterAll(async () => {
      // アセットのクリーンアップ
      await api.assets.delete(characterAssetId);
    });
  });

  // ログアウトのテスト（最後に実行）
  it("ログアウトできる", async () => {
    const success = await api.auth.logout();
    expect(success).toBe(true);
  });
});
