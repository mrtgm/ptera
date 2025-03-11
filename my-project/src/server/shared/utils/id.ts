import { omit, pipe } from "remeda";

export const randomIntId = () => Math.floor(Math.random() * 1000000);
export const randomUUID = () => crypto.randomUUID();

export const maskId = <T extends { id: number; publicId: string }>(data: T) =>
	pipe(data, omit(["id"]), (v) => ({ ...v, id: data.publicId }));
