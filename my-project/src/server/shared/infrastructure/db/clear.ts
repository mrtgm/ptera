import { sql } from "drizzle-orm";
import { ENV } from "@/server/configs/env.js";
import { db } from "./index.js";


export const clear = async () => {
	await db.execute(sql`
   DROP SCHEMA public CASCADE;
   CREATE SCHEMA public;
   GRANT ALL ON SCHEMA public TO postgres;
   GRANT ALL ON SCHEMA public TO public;
  `);
	console.log("✅ データベースをリセットしました");
};

if (require.main === module) {
	clear()
		.then(() => process.exit(0))
		.catch((err) => {
			console.error("❌ エラーが発生しました:", err);
			process.exit(1);
		});
}
