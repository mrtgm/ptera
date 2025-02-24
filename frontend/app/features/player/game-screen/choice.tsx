import { player } from "~/stores/player";
import { AnimatePresence } from "./animate-presence";

export const Choice = ({
	choices,
	currentEvent,
}: {
	choices: Stage["choices"];
	currentEvent: GameEvent | null;
}) => {
	if (!currentEvent) return null;

	const handleTapChoice = (index: number) => {
		player.selectChoice(choices[index]);
	};

	return (
		<AnimatePresence
			eventId={currentEvent.id}
			config={{
				enter: {
					configs: {
						duration: 100,
						easing: "easeInOutQuad",
					},
				},
				exit: {
					configs: {
						duration: 100,
						easing: "easeInOutQuad",
					},
				},
			}}
		>
			{choices.length > 0 && (
				<div className="w-full h-full absolute top-0 left-0 z-10 bg-black bg-opacity-50">
					<ul className="flex flex-col justify-center items-center h-full">
						{choices.map((choice, index) => (
							<li
								key={choice.id}
								className="text-white text-lg p-2 m-2 bg-gray-800 cursor-pointer"
								onClick={() => handleTapChoice(index)}
								onKeyDown={() => {}}
							>
								{choice.text}
							</li>
						))}
					</ul>
				</div>
			)}
		</AnimatePresence>
	);
};
