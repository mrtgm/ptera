import { db } from "../index.js";
import * as schema from "../schema.js";

async function seedPresetAssets() {
  try {
    console.log("🌱 プリセットアセットのシードを開始します...");

    const users = await db.select().from(schema.user).limit(1);
    if (users.length === 0) {
      throw new Error(
        "ユーザーが見つかりません。先に基本シードを実行してください。",
      );
    }
    const userId = users[0].id;

    // アセットデータの挿入
    const assets = await db
      .insert(schema.asset)
      .values([
        // 背景画像: ファンタジー
        {
          isPublic: true,
          assetType: "backgroundImage",
          name: "バザール",
          url: "/presets/backgrounds/fantasy/bazzar.jpeg",
          metadata: {
            tags: ["fantasy", "市場", "中東"],
            description: "ファンタジーワールドの賑やかな市場の背景",
          },
        },
        {
          isPublic: true,
          assetType: "backgroundImage",
          name: "洞窟",
          url: "/presets/backgrounds/fantasy/cave.jpeg",
          metadata: {
            tags: ["fantasy", "洞窟", "暗い"],
            description: "神秘的な洞窟の背景",
          },
        },
        {
          isPublic: true,
          assetType: "backgroundImage",
          name: "ファンタジー図書館",
          url: "/presets/backgrounds/fantasy/library-fantasy.jpeg",
          metadata: {
            tags: ["fantasy", "図書館", "室内"],
            description: "魔法の本が並ぶファンタジー世界の図書館",
          },
        },
        {
          isPublic: true,
          assetType: "backgroundImage",
          name: "広野",
          url: "/presets/backgrounds/fantasy/open-field.jpeg",
          metadata: {
            tags: ["fantasy", "野原", "自然"],
            description: "開けた草原の風景",
          },
        },
        {
          isPublic: true,
          assetType: "backgroundImage",
          name: "宮殿",
          url: "/presets/backgrounds/fantasy/palace.jpeg",
          metadata: {
            tags: ["fantasy", "宮殿", "豪華"],
            description: "豪華な王宮の内部",
          },
        },

        // 背景画像: 個人
        {
          isPublic: true,
          assetType: "backgroundImage",
          name: "散らかった部屋",
          url: "/presets/backgrounds/me/dirty-room.jpeg",
          metadata: {
            tags: ["部屋", "日常", "散らかった"],
            description: "散らかった私室の背景",
          },
        },

        // 背景画像: 学校生活
        {
          isPublic: true,
          assetType: "backgroundImage",
          name: "公園（昼）",
          url: "/presets/backgrounds/shool-life/park-day.jpeg",
          metadata: {
            tags: ["学校", "公園", "昼"],
            description: "日中の公園の風景",
          },
        },
        {
          isPublic: true,
          assetType: "backgroundImage",
          name: "部屋",
          url: "/presets/backgrounds/shool-life/room.jpeg",
          metadata: {
            tags: ["学校", "部屋", "室内"],
            description: "整頓された部屋の背景",
          },
        },
        {
          isPublic: true,
          assetType: "backgroundImage",
          name: "通学路",
          url: "/presets/backgrounds/shool-life/school-route.jpeg",
          metadata: {
            tags: ["学校", "通学路", "屋外"],
            description: "桜並木の通学路",
          },
        },
        {
          isPublic: true,
          assetType: "backgroundImage",
          name: "学校",
          url: "/presets/backgrounds/shool-life/school.png",
          metadata: {
            tags: ["学校", "校舎", "屋外"],
            description: "学校の校舎の外観",
          },
        },

        // BGM
        {
          isPublic: true,
          assetType: "bgm",
          name: "午前2時23分",
          url: "/presets/bgms/2-23am.mp3",
          metadata: {
            length: "3:05",
            composer: "作曲家",
            mood: "静寂",
          },
        },
        {
          isPublic: true,
          assetType: "bgm",
          name: "猫の生活",
          url: "/presets/bgms/cat-life.mp3",
          metadata: {
            length: "2:45",
            composer: "作曲家",
            mood: "のんびり",
          },
        },
        {
          isPublic: true,
          assetType: "bgm",
          name: "ファミポップ3",
          url: "/presets/bgms/famipop3.mp3",
          metadata: {
            length: "2:30",
            composer: "作曲家",
            mood: "明るい",
          },
        },
        {
          isPublic: true,
          assetType: "bgm",
          name: "昼下がり",
          url: "/presets/bgms/hirusagari.mp3",
          metadata: {
            length: "3:15",
            composer: "作曲家",
            mood: "穏やか",
          },
        },
        {
          isPublic: true,
          assetType: "bgm",
          name: "ジャジー",
          url: "/presets/bgms/jazzy.mp3",
          metadata: {
            length: "2:55",
            composer: "作曲家",
            mood: "ジャズ",
          },
        },
        {
          isPublic: true,
          assetType: "bgm",
          name: "野良猫",
          url: "/presets/bgms/noraneko.mp3",
          metadata: {
            length: "3:20",
            composer: "作曲家",
            mood: "ミステリアス",
          },
        },
        {
          isPublic: true,
          assetType: "bgm",
          name: "平和な一日",
          url: "/presets/bgms/peaceful-day.mp3",
          metadata: {
            length: "3:00",
            composer: "作曲家",
            mood: "平和",
          },
        },

        // CG
        {
          isPublic: true,
          assetType: "cgImage",
          name: "桜の下で",
          url: "/presets/cgs/sakura.jpeg",
          metadata: {
            event: "桜イベント",
            characters: ["主人公", "ヒロイン"],
            description: "桜の木の下での出会いシーン",
          },
        },

        // 効果音
        {
          isPublic: true,
          assetType: "soundEffect",
          name: "不安",
          url: "/presets/sounds/anxiety.mp3",
          metadata: {
            category: "感情",
            description: "不安な場面で使用する効果音",
          },
        },
        {
          isPublic: true,
          assetType: "soundEffect",
          name: "ビシッ",
          url: "/presets/sounds/bishi.mp3",
          metadata: {
            category: "アクション",
            description: "鋭い動きを表現する効果音",
          },
        },
        {
          isPublic: true,
          assetType: "soundEffect",
          name: "拍手",
          url: "/presets/sounds/clap.mp3",
          metadata: {
            category: "人物",
            description: "拍手の効果音",
          },
        },
        {
          isPublic: true,
          assetType: "soundEffect",
          name: "デデン",
          url: "/presets/sounds/deden.mp3",
          metadata: {
            category: "イベント",
            description: "驚きや発見の瞬間の効果音",
          },
        },
        {
          isPublic: true,
          assetType: "soundEffect",
          name: "ドア",
          url: "/presets/sounds/door.mp3",
          metadata: {
            category: "環境",
            description: "ドアの開閉音",
          },
        },
        {
          isPublic: true,
          assetType: "soundEffect",
          name: "足音",
          url: "/presets/sounds/footsteps.m4a",
          metadata: {
            category: "環境",
            description: "足音の効果音",
          },
        },
        {
          isPublic: true,
          assetType: "soundEffect",
          name: "グキッ",
          url: "/presets/sounds/guki.mp3",
          metadata: {
            category: "アクション",
            description: "何かが折れる音",
          },
        },
        {
          isPublic: true,
          assetType: "soundEffect",
          name: "ポカン",
          url: "/presets/sounds/pokan.mp3",
          metadata: {
            category: "コミカル",
            description: "コミカルな場面での効果音",
          },
        },
        {
          isPublic: true,
          assetType: "soundEffect",
          name: "ポーン",
          url: "/presets/sounds/poon.mp3",
          metadata: {
            category: "システム",
            description: "通知や決定の効果音",
          },
        },
        {
          isPublic: true,
          assetType: "soundEffect",
          name: "学校のチャイム",
          url: "/presets/sounds/school-chaim.mp3",
          metadata: {
            category: "環境",
            description: "学校のチャイム音",
          },
        },
        {
          isPublic: true,
          assetType: "soundEffect",
          name: "正解",
          url: "/presets/sounds/seikai.mp3",
          metadata: {
            category: "システム",
            description: "正解時の効果音",
          },
        },
        {
          isPublic: true,
          assetType: "soundEffect",
          name: "シャキーン",
          url: "/presets/sounds/shakiin.mp3",
          metadata: {
            category: "アクション",
            description: "キラリと光る瞬間の効果音",
          },
        },
        {
          isPublic: true,
          assetType: "soundEffect",
          name: "テンカン",
          url: "/presets/sounds/tenkan.mp3",
          metadata: {
            category: "システム",
            description: "場面転換の効果音",
          },
        },

        // キャラクター画像：longhair-woman
        {
          isPublic: true,
          assetType: "characterImage",
          name: "longhair-woman-happy",
          url: "/presets/characters/longhair-woman/happy.png",
          metadata: {
            tags: ["longhair-woman", "happy"],
            description: "長髪の女性キャラクターの笑顔の表情",
          },
        },
        {
          isPublic: true,
          assetType: "characterImage",
          name: "longhair-woman-sad",
          url: "/presets/characters/longhair-woman/sad.png",
          metadata: {
            tags: ["longhair-woman", "sad"],
            description: "長髪の女性キャラクターの悲しい表情",
          },
        },
        {
          isPublic: true,
          assetType: "characterImage",
          name: "longhair-woman-smile",
          url: "/presets/characters/longhair-woman/smile.png",
          metadata: {
            tags: ["longhair-woman", "smile"],
            description: "長髪の女性キャラクターの微笑み表情",
          },
        },

        // キャラクター画像：mysterious-girl
        {
          isPublic: true,
          assetType: "characterImage",
          name: "mysterious-girl-happy",
          url: "/presets/characters/mysterious-girl/happy.png",
          metadata: {
            tags: ["mysterious-girl", "happy"],
            description: "ミステリアスな少女キャラクターの笑顔の表情",
          },
        },
        {
          isPublic: true,
          assetType: "characterImage",
          name: "mysterious-girl-sad",
          url: "/presets/characters/mysterious-girl/sad.png",
          metadata: {
            tags: ["mysterious-girl", "sad"],
            description: "ミステリアスな少女キャラクターの悲しい表情",
          },
        },
        {
          isPublic: true,
          assetType: "characterImage",
          name: "mysterious-girl-smile",
          url: "/presets/characters/mysterious-girl/smile.png",
          metadata: {
            tags: ["mysterious-girl", "smile"],
            description: "ミステリアスな少女キャラクターの微笑み表情",
          },
        },
      ])
      .returning();

    console.log(`✅ ${assets.length}個のアセットを登録しました`);

    const characters = await db
      .insert(schema.character)
      .values([
        {
          isPublic: true,
          name: "長髪の女性",
        },
        {
          isPublic: true,
          name: "ミステリアスな少女",
        },
      ])
      .returning();

    console.log(`✅ ${characters.length}人のキャラクターを登録しました`);

    const longhairWomanAssets = assets.filter(
      (asset) =>
        asset.assetType === "characterImage" &&
        asset.name.startsWith("longhair-woman"),
    );

    const mysteriousGirlAssets = assets.filter(
      (asset) =>
        asset.assetType === "characterImage" &&
        asset.name.startsWith("mysterious-girl"),
    );

    const characterAssets = [];

    for (const asset of longhairWomanAssets) {
      characterAssets.push({
        characterId: characters[0].id,
        assetId: asset.id,
      });
    }

    for (const asset of mysteriousGirlAssets) {
      characterAssets.push({
        characterId: characters[1].id,
        assetId: asset.id,
      });
    }

    await db.insert(schema.characterAsset).values(characterAssets);

    console.log(
      `✅ ${characterAssets.length}個のキャラクターアセット関連付けを作成しました`,
    );
    console.log("🎉 プリセットアセットのシード完了！");
  } catch (error) {
    console.error("❌ エラーが発生しました:", error);
    throw error;
  }
}

if (require.main === module) {
  seedPresetAssets()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("致命的なエラーが発生しました:", err);
      process.exit(1);
    });
}

export { seedPresetAssets };
