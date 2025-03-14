import { z } from "zod";

const offsetRefine = (value: number | undefined) => Number(value) >= 0;
const limitRefine = (value: number | undefined) =>
	Number(value) > 0 && Number(value) <= 1000;

export const paginationRequestSchema = z.object({
	q: z.string().optional(), // 検索クエリ
	sort: z.enum(["createdAt"]).default("createdAt").optional(),
	order: z.enum(["asc", "desc"]).default("asc").optional(),
	offset: z
		.union([z.number().optional(), z.string().transform(Number).optional()])
		.default(0)
		.refine(offsetRefine, "offset は0以上である必要があります"),
	limit: z
		.union([z.number().optional(), z.string().transform(Number).optional()])
		.default(20)
		.refine(limitRefine, "limit は1以上1000以下である必要があります"),
});
