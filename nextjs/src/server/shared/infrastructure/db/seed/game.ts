import { eq } from "drizzle-orm";
import { db } from "..";
import * as schema from "../schema";

async function seedSampleGames() {
  try {
    console.log("🌱 サンプルゲームのシードを開始します...");

    const users = await db.select().from(schema.user).limit(1);
    if (users.length === 0) {
      throw new Error(
        "ユーザーが見つかりません。先に基本シードを実行してください。",
      );
    }
    const userId = users[0].id;

    const assets = await db
      .select()
      .from(schema.asset)
      .where(eq(schema.asset.isPublic, true));
    if (assets.length === 0) {
      throw new Error(
        "プリセットアセットが見つかりません。先にプリセットアセットのシードを実行してください。",
      );
    }

    const characters = await db
      .select()
      .from(schema.character)
      .where(eq(schema.character.isPublic, true));
    if (characters.length === 0) {
      throw new Error(
        "キャラクターが見つかりません。先にプリセットアセットのシードを実行してください。",
      );
    }

    const backgroundAssets = assets.filter(
      (asset) => asset.assetType === "backgroundImage",
    );
    const bgmAssets = assets.filter((asset) => asset.assetType === "bgm");
    const cgAssets = assets.filter((asset) => asset.assetType === "cgImage");
    const soundEffectAssets = assets.filter(
      (asset) => asset.assetType === "soundEffect",
    );
    const characterImageAssets = assets.filter(
      (asset) => asset.assetType === "characterImage",
    );

    let categories = await db.select().from(schema.gameCategory);
    if (categories.length === 0) {
      categories = await db
        .insert(schema.gameCategory)
        .values([
          { name: "学園" },
          { name: "ファンタジー" },
          { name: "日常" },
          { name: "ミステリー" },
          { name: "恋愛" },
        ])
        .returning();
    }

    console.log("🎉 サンプルゲームのシード完了！");
  } catch (error) {
    console.error("❌ エラーが発生しました:", error);
    throw error;
  }
}

if (require.main === module) {
  seedSampleGames()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("致命的なエラーが発生しました:", err);
      process.exit(1);
    });
}

export { seedSampleGames };
