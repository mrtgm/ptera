import { eq } from "drizzle-orm";
import { db } from "../";
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

		// ゲームの作成
		const games = await db
			.insert(schema.game)
			.values([
				{
					userId: userId,
					name: "桜舞う学園物語",
					description:
						"春の訪れとともに始まる、新しい学園生活の物語。桜の木の下での出会いが主人公の運命を変える。",
					coverImageUrl: "/presets/backgrounds/shool-life/school-route.jpeg",
					status: "published",
				},
				{
					userId: userId,
					name: "異世界の扉",
					description:
						"ある日突然、異世界への扉を見つけた主人公。そこで待ち受けていたのは、冒険と出会いの物語。",
					coverImageUrl: "/presets/backgrounds/fantasy/palace.jpeg",
					status: "published",
				},
			])
			.returning();

		console.log(`✅ ${games.length}個のサンプルゲームを作成しました`);

		// ゲームとカテゴリーの関連付け
		await db.insert(schema.gameCategoryRelation).values([
			{
				gameId: games[0].id,
				gameCategoryId:
					categories.find((c) => c.name === "学園")?.id || categories[0].id,
			},
			{
				gameId: games[0].id,
				gameCategoryId:
					categories.find((c) => c.name === "恋愛")?.id || categories[0].id,
			},
			{
				gameId: games[0].id,
				gameCategoryId:
					categories.find((c) => c.name === "日常")?.id || categories[0].id,
			},
			{
				gameId: games[1].id,
				gameCategoryId:
					categories.find((c) => c.name === "ファンタジー")?.id ||
					categories[0].id,
			},
			{
				gameId: games[1].id,
				gameCategoryId:
					categories.find((c) => c.name === "冒険")?.id || categories[0].id,
			},
		]);

		// ゲームに使用するアセットの関連付け
		// 学園ゲーム用のアセット
		const schoolBgAssets = backgroundAssets.filter(
			(asset) =>
				asset.url.includes("school") ||
				asset.url.includes("park") ||
				asset.url.includes("room"),
		);
		const schoolBgm = bgmAssets.filter(
			(asset) =>
				asset.name.includes("昼下がり") || asset.name.includes("平和な一日"),
		);
		const schoolSoundEffects = soundEffectAssets.filter(
			(asset) =>
				asset.name.includes("チャイム") ||
				asset.name.includes("ドア") ||
				asset.name.includes("足音"),
		);

		// ファンタジーゲーム用のアセット
		const fantasyBgAssets = backgroundAssets.filter((asset) =>
			asset.url.includes("fantasy"),
		);
		const fantasyBgm = bgmAssets.filter(
			(asset) =>
				asset.name.includes("ミステリアス") || asset.name.includes("午前2時"),
		);
		const fantasySoundEffects = soundEffectAssets.filter(
			(asset) =>
				asset.name.includes("シャキーン") || asset.name.includes("テンカン"),
		);

		// アセットをゲームに関連付け
		const assetGameValues = [];

		// 学園ゲームのアセット
		for (const asset of schoolBgAssets) {
			assetGameValues.push({ assetId: asset.id, gameId: games[0].id });
		}
		for (const asset of schoolBgm) {
			assetGameValues.push({ assetId: asset.id, gameId: games[0].id });
		}
		for (const asset of schoolSoundEffects) {
			assetGameValues.push({ assetId: asset.id, gameId: games[0].id });
		}
		// CGを追加
		for (const asset of cgAssets) {
			assetGameValues.push({ assetId: asset.id, gameId: games[0].id });
		}

		// ファンタジーゲームのアセット
		for (const asset of fantasyBgAssets) {
			assetGameValues.push({ assetId: asset.id, gameId: games[1].id });
		}
		for (const asset of fantasyBgm) {
			assetGameValues.push({ assetId: asset.id, gameId: games[1].id });
		}
		for (const asset of fantasySoundEffects) {
			assetGameValues.push({ assetId: asset.id, gameId: games[1].id });
		}

		// アセットとゲームの関連付けをデータベースに挿入
		await db.insert(schema.assetGame).values(assetGameValues);
		console.log(
			`✅ ${assetGameValues.length}個のアセットをゲームに関連付けました`,
		);

		// キャラクターとゲームの関連付け
		const characterGameValues = [
			{ characterId: characters[0].id, gameId: games[0].id }, // 長髪の女性を学園ゲームに
			{ characterId: characters[1].id, gameId: games[1].id }, // ミステリアスな少女をファンタジーゲームに
		];
		await db.insert(schema.characterGame).values(characterGameValues);
		console.log(
			`✅ ${characterGameValues.length}個のキャラクターをゲームに関連付けました`,
		);

		// シーンの作成
		// 学園ゲームのシーン
		const schoolScenes = await db
			.insert(schema.scene)
			.values([
				{ gameId: games[0].id, name: "学校への登校" },
				{ gameId: games[0].id, name: "教室での出会い" },
				{ gameId: games[0].id, name: "放課後の会話" },
				{ gameId: games[0].id, name: "桜の木の下で" },
				{ gameId: games[0].id, name: "エンディング" },
			])
			.returning();

		// ファンタジーゲームのシーン
		const fantasyScenes = await db
			.insert(schema.scene)
			.values([
				{ gameId: games[1].id, name: "異世界への到着" },
				{ gameId: games[1].id, name: "謎の少女との出会い" },
				{ gameId: games[1].id, name: "宮殿への招待" },
				{ gameId: games[1].id, name: "選択の時" },
				{ gameId: games[1].id, name: "エンディング" },
			])
			.returning();

		console.log(
			`✅ ${schoolScenes.length + fantasyScenes.length}個のシーンを作成しました`,
		);

		// 初期シーンの設定
		await db.insert(schema.gameInitialScene).values([
			{ gameId: games[0].id, sceneId: schoolScenes[0].id },
			{ gameId: games[1].id, sceneId: fantasyScenes[0].id },
		]);

		// シーンの種類を設定（通常シーン - goto）
		const gotoScenes = await db
			.insert(schema.gotoScene)
			.values([
				{ sceneId: schoolScenes[0].id, nextSceneId: schoolScenes[1].id },
				{ sceneId: schoolScenes[1].id, nextSceneId: schoolScenes[2].id },
				{ sceneId: schoolScenes[2].id, nextSceneId: schoolScenes[3].id },

				{ sceneId: fantasyScenes[0].id, nextSceneId: fantasyScenes[1].id },
				{ sceneId: fantasyScenes[1].id, nextSceneId: fantasyScenes[2].id },
				{ sceneId: fantasyScenes[2].id, nextSceneId: fantasyScenes[3].id },
			])
			.returning();

		// 選択肢シーンの作成
		const choiceScenes = await db
			.insert(schema.choiceScene)
			.values([
				{ sceneId: schoolScenes[3].id },
				{ sceneId: fantasyScenes[3].id },
			])
			.returning();

		// 選択肢の作成
		await db.insert(schema.choice).values([
			// 学園ゲームの選択肢
			{
				choiceSceneId: choiceScenes[0].id,
				text: "告白する",
				nextSceneId: schoolScenes[4].id,
			},
			{
				choiceSceneId: choiceScenes[0].id,
				text: "友達のままでいる",
				nextSceneId: schoolScenes[4].id,
			},

			// ファンタジーゲームの選択肢
			{
				choiceSceneId: choiceScenes[1].id,
				text: "異世界に残る",
				nextSceneId: fantasyScenes[4].id,
			},
			{
				choiceSceneId: choiceScenes[1].id,
				text: "元の世界に戻る",
				nextSceneId: fantasyScenes[4].id,
			},
		]);

		// エンドシーンの作成
		await db
			.insert(schema.endScene)
			.values([
				{ sceneId: schoolScenes[4].id },
				{ sceneId: fantasyScenes[4].id },
			]);

		// 背景画像の取得
		const schoolRoute = backgroundAssets.find((asset) =>
			asset.url.includes("school-route"),
		);
		const schoolBg = backgroundAssets.find((asset) =>
			asset.url.includes("school.png"),
		);
		const classroom = schoolBg || schoolRoute; // 教室の背景がなければ代わりに校舎を使用
		const park = backgroundAssets.find((asset) =>
			asset.url.includes("park-day"),
		);

		const fantasyField = backgroundAssets.find((asset) =>
			asset.url.includes("open-field"),
		);
		const palace = backgroundAssets.find((asset) =>
			asset.url.includes("palace"),
		);
		const library = backgroundAssets.find((asset) =>
			asset.url.includes("library-fantasy"),
		);

		// BGMの取得
		const peacefulBgm = bgmAssets.find((asset) =>
			asset.name.includes("平和な一日"),
		);
		const catLifeBgm = bgmAssets.find((asset) =>
			asset.name.includes("猫の生活"),
		);
		const fantasyBgmAsset = bgmAssets.find((asset) =>
			asset.name.includes("ミステリアス"),
		);

		// 効果音の取得
		const doorSound = soundEffectAssets.find((asset) =>
			asset.name.includes("ドア"),
		);
		const footstepsSound = soundEffectAssets.find((asset) =>
			asset.name.includes("足音"),
		);
		const chaimSound = soundEffectAssets.find((asset) =>
			asset.name.includes("チャイム"),
		);
		const tenkanSound = soundEffectAssets.find((asset) =>
			asset.name.includes("テンカン"),
		);

		// キャラクター画像の取得
		const schoolCharacter = characters[0]; // 長髪の女性
		const schoolCharacterHappy = characterImageAssets.find(
			(asset) =>
				asset.name.includes("longhair-woman") && asset.name.includes("happy"),
		);
		const schoolCharacterSmile = characterImageAssets.find(
			(asset) =>
				asset.name.includes("longhair-woman") && asset.name.includes("smile"),
		);

		const fantasyCharacter = characters[1]; // ミステリアスな少女
		const fantasyCharacterHappy = characterImageAssets.find(
			(asset) =>
				asset.name.includes("mysterious-girl") && asset.name.includes("happy"),
		);
		const fantasyCharacterSmile = characterImageAssets.find(
			(asset) =>
				asset.name.includes("mysterious-girl") && asset.name.includes("smile"),
		);

		// CG画像の取得
		const sakuraCg = cgAssets.find((asset) => asset.name.includes("桜"));

		// イベントの作成
		// 学園ゲームのイベント
		const schoolEvents = [];

		// シーン1：学校への登校
		schoolEvents.push(
			...(await db
				.insert(schema.event)
				.values([
					{
						sceneId: schoolScenes[0].id,
						eventType: "changeBackground",
						category: "background",
						orderIndex: "a0",
					},
					{
						sceneId: schoolScenes[0].id,
						eventType: "bgmStart",
						category: "media",
						orderIndex: "a1",
					},
					{
						sceneId: schoolScenes[0].id,
						eventType: "textRender",
						category: "message",
						orderIndex: "a3",
					},
					{
						sceneId: schoolScenes[0].id,
						eventType: "soundEffect",
						category: "media",
						orderIndex: "a4",
					},
				])
				.returning()),
		);

		// シーン2：教室での出会い
		schoolEvents.push(
			...(await db
				.insert(schema.event)
				.values([
					{
						sceneId: schoolScenes[1].id,
						eventType: "changeBackground",
						category: "background",
						orderIndex: "a0",
					},
					{
						sceneId: schoolScenes[1].id,
						eventType: "soundEffect",
						category: "media",
						orderIndex: "a1",
					},
					{
						sceneId: schoolScenes[1].id,
						eventType: "appearCharacter",
						category: "character",
						orderIndex: "a3",
					},
					{
						sceneId: schoolScenes[1].id,
						eventType: "textRender",
						category: "message",
						orderIndex: "a4",
					},
				])
				.returning()),
		);

		// シーン3：放課後の会話
		schoolEvents.push(
			...(await db
				.insert(schema.event)
				.values([
					{
						sceneId: schoolScenes[2].id,
						eventType: "changeBackground",
						category: "background",
						orderIndex: "a0",
					},
					{
						sceneId: schoolScenes[2].id,
						eventType: "bgmStart",
						category: "media",
						orderIndex: "a1",
					},
					{
						sceneId: schoolScenes[2].id,
						eventType: "appearCharacter",
						category: "character",
						orderIndex: "a3",
					},
					{
						sceneId: schoolScenes[2].id,
						eventType: "textRender",
						category: "message",
						orderIndex: "a4",
					},
				])
				.returning()),
		);

		// シーン4：桜の木の下で
		schoolEvents.push(
			...(await db
				.insert(schema.event)
				.values([
					{
						sceneId: schoolScenes[3].id,
						eventType: "changeBackground",
						category: "background",
						orderIndex: "a0",
					},
					{
						sceneId: schoolScenes[3].id,
						eventType: "appearCharacter",
						category: "character",
						orderIndex: "a1",
					},
					{
						sceneId: schoolScenes[3].id,
						eventType: "textRender",
						category: "message",
						orderIndex: "a3",
					},
					{
						sceneId: schoolScenes[3].id,
						eventType: "appearCg",
						category: "cg",
						orderIndex: "a4",
					},
					{
						sceneId: schoolScenes[3].id,
						eventType: "textRender",
						category: "message",
						orderIndex: "a5",
					},
				])
				.returning()),
		);

		// シーン5：エンディング
		schoolEvents.push(
			...(await db
				.insert(schema.event)
				.values([
					{
						sceneId: schoolScenes[4].id,
						eventType: "changeBackground",
						category: "background",
						orderIndex: "a0",
					},
					{
						sceneId: schoolScenes[4].id,
						eventType: "textRender",
						category: "message",
						orderIndex: "a1",
					},
					{
						sceneId: schoolScenes[4].id,
						eventType: "bgmStop",
						category: "media",
						orderIndex: "a3",
					},
				])
				.returning()),
		);

		// ファンタジーゲームのイベント
		const fantasyEvents = [];

		// シーン1：異世界への到着
		fantasyEvents.push(
			...(await db
				.insert(schema.event)
				.values([
					{
						sceneId: fantasyScenes[0].id,
						eventType: "changeBackground",
						category: "background",
						orderIndex: "a0",
					},
					{
						sceneId: fantasyScenes[0].id,
						eventType: "bgmStart",
						category: "media",
						orderIndex: "a1",
					},
					{
						sceneId: fantasyScenes[0].id,
						eventType: "textRender",
						category: "message",
						orderIndex: "a3",
					},
					{
						sceneId: fantasyScenes[0].id,
						eventType: "soundEffect",
						category: "media",
						orderIndex: "a4",
					},
				])
				.returning()),
		);

		// シーン2：謎の少女との出会い
		fantasyEvents.push(
			...(await db
				.insert(schema.event)
				.values([
					{
						sceneId: fantasyScenes[1].id,
						eventType: "changeBackground",
						category: "background",
						orderIndex: "a0",
					},
					{
						sceneId: fantasyScenes[1].id,
						eventType: "appearCharacter",
						category: "character",
						orderIndex: "a1",
					},
					{
						sceneId: fantasyScenes[1].id,
						eventType: "textRender",
						category: "message",
						orderIndex: "a3",
					},
				])
				.returning()),
		);

		// シーン3：宮殿への招待
		fantasyEvents.push(
			...(await db
				.insert(schema.event)
				.values([
					{
						sceneId: fantasyScenes[2].id,
						eventType: "changeBackground",
						category: "background",
						orderIndex: "a0",
					},
					{
						sceneId: fantasyScenes[2].id,
						eventType: "appearCharacter",
						category: "character",
						orderIndex: "a1",
					},
					{
						sceneId: fantasyScenes[2].id,
						eventType: "textRender",
						category: "message",
						orderIndex: "a3",
					},
				])
				.returning()),
		);

		// シーン4：選択の時
		fantasyEvents.push(
			...(await db
				.insert(schema.event)
				.values([
					{
						sceneId: fantasyScenes[3].id,
						eventType: "changeBackground",
						category: "background",
						orderIndex: "a0",
					},
					{
						sceneId: fantasyScenes[3].id,
						eventType: "appearCharacter",
						category: "character",
						orderIndex: "a1",
					},
					{
						sceneId: fantasyScenes[3].id,
						eventType: "textRender",
						category: "message",
						orderIndex: "a3",
					},
				])
				.returning()),
		);

		// シーン5：エンディング
		fantasyEvents.push(
			...(await db
				.insert(schema.event)
				.values([
					{
						sceneId: fantasyScenes[4].id,
						eventType: "changeBackground",
						category: "background",
						orderIndex: "a0",
					},
					{
						sceneId: fantasyScenes[4].id,
						eventType: "textRender",
						category: "message",
						orderIndex: "a1",
					},
					{
						sceneId: fantasyScenes[4].id,
						eventType: "bgmStop",
						category: "media",
						orderIndex: "a3",
					},
				])
				.returning()),
		);

		console.log(
			`✅ ${schoolEvents.length + fantasyEvents.length}個のイベントを作成しました`,
		);

		// 各イベントの詳細を設定
		// 背景変更イベント
		const backgroundEvents = [...schoolEvents, ...fantasyEvents].filter(
			(event) => event.eventType === "changeBackground",
		);

		await db.insert(schema.changeBackgroundEvent).values([
			// 学園ゲーム
			{
				eventId: backgroundEvents[0].id,
				backgroundId: schoolRoute ? schoolRoute.id : backgroundAssets[0].id,
				transitionDuration: 500,
			},
			{
				eventId: backgroundEvents[1].id,
				backgroundId: classroom ? classroom.id : backgroundAssets[0].id,
				transitionDuration: 500,
			},
			{
				eventId: backgroundEvents[2].id,
				backgroundId: park ? park.id : backgroundAssets[0].id,
				transitionDuration: 500,
			},
			{
				eventId: backgroundEvents[3].id,
				backgroundId: park ? park.id : backgroundAssets[0].id,
				transitionDuration: 500,
			},
			{
				eventId: backgroundEvents[4].id,
				backgroundId: schoolRoute ? schoolRoute.id : backgroundAssets[0].id,
				transitionDuration: 500,
			},

			// ファンタジーゲーム
			{
				eventId: backgroundEvents[5].id,
				backgroundId: fantasyField ? fantasyField.id : backgroundAssets[0].id,
				transitionDuration: 500,
			},
			{
				eventId: backgroundEvents[6].id,
				backgroundId: fantasyField ? fantasyField.id : backgroundAssets[0].id,
				transitionDuration: 500,
			},
			{
				eventId: backgroundEvents[7].id,
				backgroundId: palace ? palace.id : backgroundAssets[0].id,
				transitionDuration: 500,
			},
			{
				eventId: backgroundEvents[8].id,
				backgroundId: library ? library.id : backgroundAssets[0].id,
				transitionDuration: 500,
			},
			{
				eventId: backgroundEvents[9].id,
				backgroundId: fantasyField ? fantasyField.id : backgroundAssets[0].id,
				transitionDuration: 500,
			},
		]);

		// キャラクター登場イベント
		const characterEvents = [...schoolEvents, ...fantasyEvents].filter(
			(event) => event.eventType === "appearCharacter",
		);

		await db.insert(schema.appearCharacterEvent).values([
			// 学園ゲーム
			{
				eventId: characterEvents[0].id,
				characterId: schoolCharacter.id,
				characterImageId: schoolCharacterSmile
					? schoolCharacterSmile.id
					: characterImageAssets[0].id,
				position: [0, 0],
				scale: "1",
				transitionDuration: 500,
			},
			{
				eventId: characterEvents[1].id,
				characterId: schoolCharacter.id,
				characterImageId: schoolCharacterHappy
					? schoolCharacterHappy.id
					: characterImageAssets[0].id,
				position: [0, 0],
				scale: "1",
				transitionDuration: 500,
			},
			{
				eventId: characterEvents[2].id,
				characterId: schoolCharacter.id,
				characterImageId: schoolCharacterSmile
					? schoolCharacterSmile.id
					: characterImageAssets[0].id,
				position: [0, 0],
				scale: "1",
				transitionDuration: 500,
			},

			// ファンタジーゲーム
			{
				eventId: characterEvents[3].id,
				characterId: fantasyCharacter.id,
				characterImageId: fantasyCharacterSmile
					? fantasyCharacterSmile.id
					: characterImageAssets[0].id,
				position: [0, 0],
				scale: "1",
				transitionDuration: 500,
			},
			{
				eventId: characterEvents[4].id,
				characterId: fantasyCharacter.id,
				characterImageId: fantasyCharacterHappy
					? fantasyCharacterHappy.id
					: characterImageAssets[0].id,
				position: [0, 0],
				scale: "1",
				transitionDuration: 500,
			},
			{
				eventId: characterEvents[5].id,
				characterId: fantasyCharacter.id,
				characterImageId: fantasyCharacterSmile
					? fantasyCharacterSmile.id
					: characterImageAssets[0].id,
				position: [0, 0],
				scale: "1",
				transitionDuration: 500,
			},
		]);

		// テキスト表示イベント
		const textEvents = [...schoolEvents, ...fantasyEvents].filter(
			(event) => event.eventType === "textRender",
		);

		await db.insert(schema.textRenderEvent).values([
			// 学園ゲーム
			{
				eventId: textEvents[0].id,
				text: "新学期が始まりました。桜舞う通学路を歩いていると、なんだか新しい出会いが待っているような気がします。",
				characterName: "主人公",
			},
			{
				eventId: textEvents[1].id,
				text: "教室に入ると、窓際に立つ女の子が目に入りました。彼女は微笑みながら、私に挨拶をしてきました。",
				characterName: "主人公",
			},
			{
				eventId: textEvents[2].id,
				text: "「今日の放課後、少し時間ありますか？桜の木の下でお話ししたいことがあるんです。」",
				characterName: "長髪の女性",
			},
			{
				eventId: textEvents[3].id,
				text: "約束の場所に行くと、彼女は既に待っていました。桜の花びらが舞い散る中、彼女は少し緊張した様子です。",
				characterName: "主人公",
			},
			{
				eventId: textEvents[4].id,
				text: "「実は、ずっと前から言いたかったことがあります...」",
				characterName: "長髪の女性",
			},
			{
				eventId: textEvents[5].id,
				text: "こうして私たちの物語は始まりました。これからどんな日々が待っているのでしょうか。",
				characterName: "主人公",
			},

			// ファンタジーゲーム
			{
				eventId: textEvents[6].id,
				text: "気がつくと、見知らぬ場所に立っていました。周りには広大な緑の草原が広がっています。ここはどこなのでしょうか？",
				characterName: "主人公",
			},
			{
				eventId: textEvents[7].id,
				text: "「ようこそ、異世界へ。あなたが予言の勇者ですね。」突然、謎の少女が私の前に現れました。",
				characterName: "ミステリアスな少女",
			},
			{
				eventId: textEvents[8].id,
				text: "「宮殿でお待ちしています。そこで全てをお話しします。」少女は神秘的な微笑みを浮かべています。",
				characterName: "ミステリアスな少女",
			},
			{
				eventId: textEvents[9].id,
				text: "「あなたには選択肢があります。この世界に残り、使命を果たすか、元の世界に戻るか...」少女は真剣な眼差しで問いかけます。",
				characterName: "ミステリアスな少女",
			},
			{
				eventId: textEvents[10].id,
				text: "どちらの世界を選んでも、新たな冒険が待っていることでしょう。これがあなたの物語の結末です。",
				characterName: "主人公",
			},
		]);

		// BGM開始イベント
		const bgmStartEvents = [...schoolEvents, ...fantasyEvents].filter(
			(event) => event.eventType === "bgmStart",
		);

		await db.insert(schema.bgmStartEvent).values([
			// 学園ゲーム
			{
				eventId: bgmStartEvents[0].id,
				bgmId: peacefulBgm ? peacefulBgm.id : bgmAssets[0].id,
				loop: true,
				volume: "0.2",
			},
			{
				eventId: bgmStartEvents[1].id,
				bgmId: catLifeBgm ? catLifeBgm.id : bgmAssets[0].id,
				loop: true,
				volume: "0.2",
			},

			// ファンタジーゲーム
			{
				eventId: bgmStartEvents[2].id,
				bgmId: fantasyBgmAsset ? fantasyBgmAsset.id : bgmAssets[0].id,
				loop: true,
				volume: "0.2",
			},
		]);

		// BGM停止イベント
		const bgmStopEvents = [...schoolEvents, ...fantasyEvents].filter(
			(event) => event.eventType === "bgmStop",
		);

		await db.insert(schema.bgmStopEvent).values([
			{
				eventId: bgmStopEvents[0].id,
				transitionDuration: 2000,
			},
			{
				eventId: bgmStopEvents[1].id,
				transitionDuration: 2000,
			},
		]);

		// 効果音イベント
		const soundEffectEvents = [...schoolEvents, ...fantasyEvents].filter(
			(event) => event.eventType === "soundEffect",
		);

		await db.insert(schema.soundEffectEvent).values([
			// 学園ゲーム
			{
				eventId: soundEffectEvents[0].id,
				soundEffectId: footstepsSound
					? footstepsSound.id
					: soundEffectAssets[0].id,
				loop: false,
				volume: "0.7",
			},
			{
				eventId: soundEffectEvents[1].id,
				soundEffectId: chaimSound ? chaimSound.id : soundEffectAssets[0].id,
				loop: false,
				volume: "0.8",
			},

			// ファンタジーゲーム
			{
				eventId: soundEffectEvents[2].id,
				soundEffectId: tenkanSound ? tenkanSound.id : soundEffectAssets[0].id,
				loop: false,
				volume: "0.9",
			},
		]);

		// CG表示イベント
		const cgEvents = [...schoolEvents, ...fantasyEvents].filter(
			(event) => event.eventType === "appearCg",
		);

		if (cgEvents.length > 0 && sakuraCg) {
			await db.insert(schema.appearCgEvent).values([
				{
					eventId: cgEvents[0].id,
					cgImageId: sakuraCg.id,
					transitionDuration: 1000,
				},
			]);
		}

		// いいねやコメント、プレイカウントなどのサンプルデータを追加
		await db.insert(schema.gamePlay).values([
			{ gameId: games[0].id, userId: userId },
			{ gameId: games[1].id, userId: userId },
		]);

		// コメント
		await db.insert(schema.comment).values([
			{
				gameId: games[0].id,
				userId: userId,
				content: "素晴らしいストーリーです！続編も期待しています。",
			},
			{
				gameId: games[1].id,
				userId: userId,
				content: "ファンタジー世界の描写が美しくて引き込まれました。",
			},
		]);

		// いいね
		await db.insert(schema.like).values([
			{ gameId: games[0].id, userId: userId },
			{ gameId: games[1].id, userId: userId },
		]);

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
