"use client";

import { GamePlayer } from "~/client/features/player";

import { useEffect } from "react";
import dummyAsset from "~/__mocks__/dummy-assets.json";
import dummyGame from "~/__mocks__/dummy-game.json";
import { EventManager } from "~/client/features/player/utils/event";
import type { Game } from "~/client/schema";

const eventManager = new EventManager();
export default function Debug() {
	useEffect(() => {
		fetch("/api/", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		}).then(async (r) => {
			const res = await r.json();
			console.log(res);
		});
	}, []);
	return (
		<div className="w-full h-dvh flex pt-[64px] justify-center">
			<GamePlayer
				game={dummyGame as Game}
				resources={dummyAsset}
				eventManager={eventManager}
			/>
		</div>
	);
}
