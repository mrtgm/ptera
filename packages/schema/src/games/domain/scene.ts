import { z } from "zod";
import { randomIntId } from "../../utils/id";
import { gameEventSchema } from "./event";

/* ------------------------------------------------------
     Scenes Entities
------------------------------------------------------ */

export const choiceSchema = z.object({
  id: z.number(),
  text: z.string(),
  nextSceneId: z.number(),
});
export type Choice = z.infer<typeof choiceSchema>;

const gotoSceneSchema = z.object({
  id: z.number(),
  name: z.string(),
  sceneType: z.literal("goto"),
  events: z.array(gameEventSchema).min(1), //各シーンは必ず1個以上イベントを持つ
  nextSceneId: z.number(),
});

export type GotoScene = z.infer<typeof gotoSceneSchema>;

const choiceSceneSchema = z.object({
  id: z.number(),
  name: z.string(),
  sceneType: z.literal("choice"),
  events: z.array(gameEventSchema).min(1),
  choices: z.array(choiceSchema),
});

export type ChoiceScene = z.infer<typeof choiceSceneSchema>;

const endSceneSchema = z.object({
  id: z.number(),
  name: z.string(),
  sceneType: z.literal("end"),
  events: z.array(gameEventSchema).min(1),
});

export type EndScene = z.infer<typeof endSceneSchema>;

export const sceneSchema = z.discriminatedUnion("sceneType", [
  gotoSceneSchema,
  choiceSceneSchema,
  endSceneSchema,
]);

export type Scene = z.infer<typeof sceneSchema>;

export const createChoice = (nextSceneId: number, text: string): Choice => ({
  id: randomIntId(),
  text,
  nextSceneId,
});

export const createEndScene = ({ name }: { name: string }): Scene => ({
  id: randomIntId(),
  name,
  sceneType: "end",
  events: [],
});

export const createGotoScene = ({
  name,
  nextSceneId,
}: {
  name: string;
  nextSceneId: number;
}): Scene => ({
  id: randomIntId(),
  name,
  sceneType: "goto",
  events: [],
  nextSceneId,
});

export const createChoiceScene = ({
  name,
  choices,
}: {
  name: string;
  choices: Choice[];
}): Scene => ({
  id: randomIntId(),
  name,
  sceneType: "choice",
  events: [],
  choices,
});
