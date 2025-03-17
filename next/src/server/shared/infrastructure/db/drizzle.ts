import { z } from "zod";
import * as schema from "./schema";

export type EntityType = keyof typeof schema;

export const entityTypeSchema = z.enum(
  Object.keys(schema) as [EntityType, ...EntityType[]],
);
