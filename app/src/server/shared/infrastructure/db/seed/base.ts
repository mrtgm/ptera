import { db } from "../index";
import * as schema from "../schema";

async function seedDatabase() {
	try {
		// 既存データの削除
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
		await db.delete(schema.event);
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
		await db.delete(schema.assetGame);
		await db.delete(schema.characterGame);
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
				{ jwtSub: "auth0|user3", isDeleted: false },
				{ jwtSub: "auth0|admin", isDeleted: false },
			])
			.returning();

		// ユーザープロフィールの挿入
		await db.insert(schema.userProfile).values([
			{
				name: "User 1",
				bio: "Regular user with a passion for visual novels",
				userId: users[0].id,
				avatarUrl: "https://example.com/avatar1.png",
			},
			{
				name: "User 2",
				bio: "Game creator and storyteller",
				userId: users[1].id,
				avatarUrl: "https://example.com/avatar2.png",
			},
			{
				name: "User 3",
				bio: "New to visual novels but excited to create",
				userId: users[2].id,
				avatarUrl: "https://example.com/avatar3.png",
			},
			{
				name: "Admin",
				bio: "Administrator and content curator",
				userId: users[3].id,
				avatarUrl: "https://example.com/avatar4.png",
			},
		]);
	} catch (error) {
		console.error("❌ シード処理中にエラーが発生しました:", error);
		throw error;
	}
}

export { seedDatabase };
