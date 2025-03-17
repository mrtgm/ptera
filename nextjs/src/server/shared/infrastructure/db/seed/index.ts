import { seedPresetAssets } from "./asset";
import { seedDatabase } from "./base";
import { seedSampleGames } from "./game";

async function runAllSeeds() {
  try {
    console.log("🌱 すべてのシード処理を開始します...");

    // 基本データのシードを実行
    console.log("\n=== 基本データのシード ===");
    await seedDatabase();

    // プリセットアセットのシードを実行
    console.log("\n=== プリセットアセットのシード ===");
    await seedPresetAssets();

    // サンプルゲームのシードを実行
    console.log("\n=== サンプルゲームのシード ===");
    await seedSampleGames();

    console.log("\n🎉🎉🎉 すべてのシード処理が完了しました！");
  } catch (error) {
    console.error("❌ シード処理中にエラーが発生しました:", error);
    throw error;
  }
}

if (require.main === module) {
  runAllSeeds()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("致命的なエラーが発生しました:", err);
      process.exit(1);
    });
}

export { runAllSeeds };
