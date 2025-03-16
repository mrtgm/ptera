"use client";

import { api } from "@/client/api";
import { Editor } from "~/client/features/editor";

export default function SceneList({
	params,
}: {
	params: Promise<{
		gameId: number;
	}>;
}) {
	return (
		<div className="w-full h-dvh flex justify-center">
			<Editor />
		</div>
	);
}
