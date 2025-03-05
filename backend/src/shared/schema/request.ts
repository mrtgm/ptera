import { z } from "zod";

const offsetRefine = (value: string | undefined) => Number(value) >= 0;
const limitRefine = (value: string | undefined) =>
	Number(value) > 0 && Number(value) <= 1000;

export const paginationRequestSchema = z.object({
	q: z.string().optional(), // キーワード
	category: z.string().optional(), // カテゴリ
	sort: z.enum(["createdAt"]).default("createdAt").optional(), // ソート対象
	order: z.enum(["asc", "desc"]).default("asc").optional(), // ソート順
	offset: z
		.string()
		.default("0")
		.optional()
		.refine(offsetRefine, "offset は0以上である必要があります"),
	limit: z
		.string()
		.default("20")
		.optional()
		.refine(limitRefine, "limit は1以上1000以下である必要があります"),
});
