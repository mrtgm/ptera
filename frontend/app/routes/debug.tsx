import { forwardRef, useState } from "react";
// import { Player } from "~/features/player";
import { AnimatePresence } from "~/features/player/components/game-screen/animate-presence";
import GamePlayer from "~/features/player/utils/debug_event";

import dummyAsset from "~/__mocks__/dummy-assets.json";
import dummyGame from "~/__mocks__/dummy-game.json";
import type { Game } from "~/schema";

export default function Debug() {
	return (
		<div className="w-full h-dvh flex pt-[64px] justify-center">
			<GamePlayer game={dummyGame as Game} resources={dummyAsset} />
		</div>
	);
}
