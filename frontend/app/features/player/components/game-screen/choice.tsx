import type { GameEvent, Stage } from "~/schema";
import type { EventManager } from "../../utils/event";
import { AnimatePresence } from "./animate-presence";

export const Choice = ({
	manager,
	choices,
	currentEvent,
	onChoiceSelected,
}: {
	manager: EventManager;
	choices: Stage["choices"];
	currentEvent: GameEvent | null;
	onChoiceSelected: (choiceId: string) => void;
}) => {
	if (!currentEvent) return null;

	const handleTapChoice = (index: number) => {
		onChoiceSelected(choices[index].id);
	};

	return (
		<AnimatePresence
			manager={manager}
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
