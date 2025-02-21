import { useEffect } from "react";
import dummyAssets from "~/datas/dummy-assets.json";
import dummyGame from "~/datas/dummy-game.json";

export const Player = () => {
	useEffect(() => {
		console.log(dummyAssets);
		console.log(dummyGame);
	}, []);

	return (
		<div className="w-dvw h-[calc(100dvh-64px)] max-w-[1000px] min-w-[320px] min-h-[500px] relative bg-white overflow-hidden">
			{/* bg-image */}
			<div
				className="w-full h-full bg-cover bg-center bg-no-repeat"
				style={{
					backgroundImage: `url(${dummyAssets.backgroundImages["park-day"].url})`,
				}}
			/>
			{/* character */}
			<div
				className="object-contain absolute -translate-x-1/2 -translate-y-1/2"
				style={{
					top: "50%",
					left: "50%",
					minWidth: "max-content",
					width: "100%",
					height: "100%",
				}}
			>
				<img
					alt="character-a"
					style={{
						top: "-10%",
						left: "0%",
					}}
					className="h-full w-auto relative m-auto"
					src={dummyAssets.characters["mysterious-girl"].images[0].url}
				/>
			</div>

			{/* choice */}
			<div className="absolute top-0 left-0 w-full h-full z-10 bg-black bg-opacity-50">
				<ul className="flex flex-col justify-center items-center h-full">
					<li className="p-2 bg-white m-2 text-black">選択肢1</li>
					<li className="p-2 bg-white m-2 text-black">選択肢2</li>
					<li className="p-2 bg-white m-2 text-black">選択肢3</li>
				</ul>
			</div>

			{/* dialog */}
			<div className="bg-gray-900 bg-opacity-90 absolute bottom-1 w-[calc(100%-16px)] h-[200px] m-auto left-0 right-0 text-white p-4">
				<div className="text-lg absolute -top-12 left-0 bg-opacity-90 bg-gray-900 p-2">
					Character Name
				</div>
				dialog
			</div>
		</div>
	);
};
