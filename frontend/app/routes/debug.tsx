import { forwardRef, useState } from "react";
import { Player } from "~/features/player";
import { AnimatePresence } from "~/features/player/game-screen/animate-presence";

export default function Debug() {
	return (
		<div className="w-full h-dvh flex pt-[64px] justify-center">
			<Player />
		</div>
	);
}
