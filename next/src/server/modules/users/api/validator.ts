import { z } from "zod";

export const userParamsSchema = z.object({
  userId: z.union([z.number(), z.string().transform(Number)]),
});
