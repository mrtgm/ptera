import { z } from "zod";

export const userParamsSchema = z.object({ userId: z.number() });
