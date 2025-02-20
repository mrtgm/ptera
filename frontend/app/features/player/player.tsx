import { useEffect } from "react";
import dummyAssets from "~/datas/dummy-assets.json";
import dummyGame from "~/datas/dummy-game.json";

export const Player = () => {
	useEffect(() => {
		console.log(dummyAssets);
		console.log(dummyGame);
	}, []);

	return <div>Player</div>;
};
