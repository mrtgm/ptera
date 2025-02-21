import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import dummyAssets from "~/datas/dummy-assets.json";
import dummyGame from "~/datas/dummy-game.json";
import { useStore } from "~/stores";

export const Player = () => {
	const playerStore = useStore.useSlice.player();

	useEffect(() => {
		console.log("playerStore.stage", playerStore.stage);
	}, [playerStore.stage]);

	useEffect(() => {
		playerStore.loadGame(dummyGame as Game);
		playerStore.setCurrentResources(dummyAssets as GameResources);

		if (playerStore.currentScene) {
			playerStore.runEvents(playerStore.currentScene.events);
		}
	}, [
		playerStore.loadGame,
		playerStore.runEvents,
		playerStore.setCurrentResources,
		playerStore.currentScene,
	]);

	return (
		<div className="w-dvw h-[calc(100dvh-64px)] max-w-[1000px] min-w-[320px] min-h-[500px] relative bg-white overflow-hidden">
			{/* bg-image */}
			<Background />

			{/* character */}
			<Character
				character={dummyAssets.characters["mysterious-girl"]}
				characterImageId="mysterious-girl-smile"
				scale={1}
				position={[0, 0]}
			/>

			{/* choice */}
			<Choice
				choices={[
					{
						id: "1",
						text: "はい",
						nextSceneId: "scene2",
					},
					{
						id: "2",
						text: "いいえ",
						nextSceneId: "scene3",
					},
				]}
			/>

			{/* dialog */}

			<Dialog
				characterName={playerStore.stage.dialog.characterName}
				text={playerStore.stage.dialog.text}
			/>
		</div>
	);
};

const Dialog = ({
	characterName,
	text,
}: { characterName: string; text: string }) => {
	return (
		<div
			id="dialog"
			className="opacity-0 bg-gray-900 bg-opacity-90 absolute bottom-1 w-[calc(100%-16px)] h-[200px] m-auto left-0 right-0 text-white p-4"
		>
			<div className="text-lg absolute -top-12 left-0 bg-opacity-90 bg-gray-900 p-2">
				{characterName}
			</div>
			{text}
		</div>
	);
};

const Choice = ({ choices }: { choices: Choice[] }) => {
	return (
		<div
			id="choice"
			className="opacity-0 absolute top-0 left-0 w-full h-full z-10 bg-black bg-opacity-50"
		>
			<ul className="flex flex-col justify-center items-center h-full">
				{choices.map((choice) => (
					<li key={choice.id} className="p-2 bg-white m-2 text-black">
						{choice.text}
					</li>
				))}
			</ul>
		</div>
	);
};

const Character = ({
	character,
	characterImageId,
	scale,
	position,
}: {
	character: Character;
	characterImageId: string;
	scale: number;
	position: [number, number];
}) => {
	const characterImage = character.images[characterImageId];

	return (
		<div
			id={character.id}
			className="object-contain absolute -translate-x-1/2 -translate-y-1/2"
			style={{
				top: "50%",
				left: "50%",
				minWidth: "max-content",
				width: "100%",
				height: `${scale * 100}%`,
			}}
		>
			<img
				alt="character-a"
				style={{
					top: `${position[1] * 100}%`,
					left: `${position[0] * 100}%`,
				}}
				className="h-full w-auto relative m-auto"
				src={characterImage?.url}
			/>
		</div>
	);
};

const Background = () => {
	return <div id="background" className="w-full h-full absolute" />;
};
