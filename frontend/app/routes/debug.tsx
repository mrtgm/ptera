import { GamePlayer } from "~/features/player";

import dummyAsset from "~/__mocks__/dummy-assets.json";
import dummyGame from "~/__mocks__/dummy-game.json";
import { EventManager } from "~/features/player/utils/event";
import type { Game } from "~/schema";

const eventManager = new EventManager();
export default function Debug() {
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
