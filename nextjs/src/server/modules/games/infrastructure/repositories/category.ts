import { gameCategory } from "@/server/shared/infrastructure/db/schema";
import type { Category } from "@ptera/schema";
import { BaseRepository } from "./base";

export class CategoryRepository extends BaseRepository {
  async getCategories(): Promise<Category[]> {
    const categoriesQuery = this.db
      .select({
        id: gameCategory.id,
        name: gameCategory.name,
        createdAt: gameCategory.createdAt,
        updatedAt: gameCategory.updatedAt,
      })
      .from(gameCategory)
      .execute();

    return categoriesQuery;
  }
}
