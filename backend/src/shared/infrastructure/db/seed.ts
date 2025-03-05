import { db } from ".";
import * as schema from "./schema"; // あなたのスキーマ定義ファイルをインポート

async function seedDatabase() {
	try {
		await db.delete(schema.effectEvent);
		await db.delete(schema.hideMessageWindowEvent);
		await db.delete(schema.appearMessageWindowEvent);
		await db.delete(schema.textRenderEvent);
		await db.delete(schema.hideCgEvent);
		await db.delete(schema.appearCgEvent);
		await db.delete(schema.soundEffectEvent);
		await db.delete(schema.bgmStopEvent);
		await db.delete(schema.bgmStartEvent);
		await db.delete(schema.characterEffectEvent);
		await db.delete(schema.moveCharacterEvent);
		await db.delete(schema.hideAllCharactersEvent);
		await db.delete(schema.hideCharacterEvent);
		await db.delete(schema.appearCharacterEvent);
		await db.delete(schema.changeBackgroundEvent);
		await db.delete(schema.eventCategoryRelation);
		await db.delete(schema.event);
		await db.delete(schema.eventCategory);
		await db.delete(schema.gameCategoryRelation);
		await db.delete(schema.like);
		await db.delete(schema.comment);
		await db.delete(schema.choice);
		await db.delete(schema.endScene);
		await db.delete(schema.gotoScene);
		await db.delete(schema.choiceScene);
		await db.delete(schema.gameInitialScene);
		await db.delete(schema.scene);
		await db.delete(schema.gamePlay);
		await db.delete(schema.game);
		await db.delete(schema.gameCategory);
		await db.delete(schema.characterAsset);
		await db.delete(schema.character);
		await db.delete(schema.asset);
		await db.delete(schema.userProfile);
		await db.delete(schema.user);
		console.log("✅ 既存データのクリアが完了しました");

		// ユーザーデータの挿入
		const users = await db
			.insert(schema.user)
			.values([
				{ jwtSub: "auth0|user1", isDeleted: false },
				{ jwtSub: "auth0|user2", isDeleted: false },
				{ jwtSub: "auth0|admin", isDeleted: false },
			])
			.returning();

		// ユーザープロフィールの挿入
		await db.insert(schema.userProfile).values([
			{
				name: "User 1",
				bio: "Regular user",
				userId: users[0].id,
				avatarUrl: "https://example.com/avatar1.png",
			},
			{
				name: "User 2",
				bio: "Another user",
				userId: users[1].id,
				avatarUrl: "https://example.com/avatar2.png",
			},
			{
				name: "Admin",
				bio: "Administrator",
				userId: users[2].id,
				avatarUrl: "https://example.com/avatar3.png",
			},
		]);

		// アセットデータの挿入
		const assets = await db
			.insert(schema.asset)
			.values([
				{
					ownerId: users[0].id,
					isPublic: true,
					type: "characterImage",
					name: "キャラクター1",
					url: "https://example.com/images/char1.png",
					metadata: {
						tags: ["主人公", "男性"],
						description: "主人公のイメージ",
					},
				},
				{
					ownerId: users[0].id,
					isPublic: true,
					type: "backgroundImage",
					name: "背景1",
					url: "https://example.com/images/bg1.jpg",
					metadata: { tags: ["室内", "昼"], description: "教室の背景" },
				},
				{
					ownerId: users[1].id,
					isPublic: false,
					type: "bgm",
					name: "メインテーマ",
					url: "https://example.com/audio/main_theme.mp3",
					metadata: { length: "2:45", composer: "音楽太郎" },
				},
				{
					ownerId: users[2].id,
					isPublic: true,
					type: "soundEffect",
					name: "ドア開閉音",
					url: "https://example.com/audio/door.wav",
					metadata: { category: "環境音" },
				},
				{
					ownerId: users[2].id,
					isPublic: true,
					type: "cg",
					name: "イベントシーン1",
					url: "https://example.com/images/event1.jpg",
					metadata: {
						event: "出会いシーン",
						characters: ["主人公", "ヒロイン"],
					},
				},
			])
			.returning();

		// キャラクターデータの挿入
		const characters = await db
			.insert(schema.character)
			.values([
				{ ownerId: users[0].id, isPublic: true, name: "主人公" },
				{ ownerId: users[0].id, isPublic: true, name: "ヒロイン" },
				{ ownerId: users[1].id, isPublic: false, name: "ライバル" },
			])
			.returning();

		// キャラクターとアセットの関連付け
		await db.insert(schema.characterAsset).values([
			{ characterId: characters[0].id, assetId: assets[0].id },
			{ characterId: characters[1].id, assetId: assets[0].id },
		]);

		// ゲームカテゴリの挿入
		const categories = await db
			.insert(schema.gameCategory)
			.values([
				{ name: "アドベンチャー" },
				{ name: "ロマンス" },
				{ name: "ミステリー" },
				{ name: "ファンタジー" },
			])
			.returning();

		// ゲームの挿入
		const games = await db
			.insert(schema.game)
			.values([
				{
					userId: users[0].id,
					name: "初めてのノベルゲーム",
					description: "サンプルゲーム1の説明です。",
					coverImageUrl: "https://example.com/images/cover1.jpg",
					status: "published",
				},
				{
					userId: users[1].id,
					name: "謎解きアドベンチャー",
					description: "サンプルゲーム2の説明です。",
					coverImageUrl: "https://example.com/images/cover2.jpg",
					status: "draft",
				},
				{
					userId: users[1].id,
					name: "謎解きアドベンチャー",
					description: "サンプルゲーム3の説明です。",
					coverImageUrl: "https://example.com/images/cover2.jpg",
					status: "published",
				},
			])
			.returning();

		// ゲームとカテゴリの関連付け
		await db.insert(schema.gameCategoryRelation).values([
			{ gameId: games[0].id, gameCategoryId: categories[0].id },
			{ gameId: games[0].id, gameCategoryId: categories[1].id },
			{ gameId: games[1].id, gameCategoryId: categories[0].id },
			{ gameId: games[1].id, gameCategoryId: categories[2].id },
		]);

		// シーンの挿入
		const scenes = await db
			.insert(schema.scene)
			.values([
				{ gameId: games[0].id, title: "導入シーン" },
				{ gameId: games[0].id, title: "選択肢シーン" },
				{ gameId: games[0].id, title: "エンディング" },
				{ gameId: games[2].id, title: "導入シーン" },
			])
			.returning();

		// プレイカウントの挿入
		await db.insert(schema.gamePlay).values([
			{ gameId: games[0].id, userId: users[0].id },
			{ gameId: games[0].id, userId: users[1].id },
			{ gameId: games[0].id, userId: users[2].id },
			{ gameId: games[2].id, userId: users[0].id },
		]);

		// 初期シーンの設定
		await db.insert(schema.gameInitialScene).values([
			{ gameId: games[0].id, sceneId: scenes[0].id },
			{ gameId: games[2].id, sceneId: scenes[3].id },
		]);

		// 選択肢シーンの作成
		const choiceScene = await db
			.insert(schema.choiceScene)
			.values({
				sceneId: scenes[1].id,
			})
			.returning();

		// 選択肢の作成
		await db.insert(schema.choice).values([
			{
				choiceSceneId: choiceScene[0].id,
				text: "冒険に出る",
				nextSceneId: scenes[2].id,
			},
			{
				choiceSceneId: choiceScene[0].id,
				text: "家にとどまる",
				nextSceneId: scenes[2].id,
			},
		]);

		// エンドシーンの作成
		await db.insert(schema.endScene).values({
			sceneId: scenes[2].id,
		});

		// イベントカテゴリの挿入
		const eventCategories = await db
			.insert(schema.eventCategory)
			.values([
				{ name: "ダイアログ" },
				{ name: "アクション" },
				{ name: "環境" },
			])
			.returning();

		// イベントの挿入（導入シーン用）
		const events = await db
			.insert(schema.event)
			.values([
				{
					sceneId: scenes[0].id,
					type: "background",
					orderIndex: "0010",
				},
				{
					sceneId: scenes[0].id,
					type: "character",
					orderIndex: "0020",
				},
				{
					sceneId: scenes[0].id,
					type: "text",
					orderIndex: "0030",
				},
			])
			.returning();

		// 背景変更イベント
		await db.insert(schema.changeBackgroundEvent).values({
			eventId: events[0].id,
			backgroundId: assets[1].id,
			transitionDuration: 500,
		});

		// キャラクター登場イベント
		await db.insert(schema.appearCharacterEvent).values({
			eventId: events[1].id,
			characterId: characters[0].id,
			characterImageId: assets[0].id,
			position: [0, 0],
			scale: "1",
			transitionDuration: 500,
		});

		// テキスト表示イベント
		await db.insert(schema.textRenderEvent).values({
			eventId: events[2].id,
			text: "これは物語の始まりです。",
			characterName: "主人公",
		});

		console.log("✅ シードデータの投入が完了しました");
	} catch (error) {
		console.error("❌ エラーが発生しました:", error);
		throw error;
	} finally {
		console.log("🎉 シード投入が完了しました！");
	}
}

if (require.main === module) {
	seedDatabase()
		.then(() => process.exit(0))
		.catch((err) => {
			console.error("致命的なエラーが発生しました:", err);
			process.exit(1);
		});
}

export { seedDatabase };
