import { useState } from "react";
import type { Player } from "~/features/player/libs/engine";

export const Ui = ({
	player,
	openHistory,
}: {
	player: Player;
	openHistory: () => void;
}) => {
	const [isMute, setIsMute] = useState(false);
	const [isAutoMode, setIsAutoMode] = useState(false);

	const toggleMute = () => setIsMute((prev) => !prev);
	const toggleAutoMode = () => setIsAutoMode((prev) => !prev);

	const handleTapMuteIndicator = () => {
		toggleMute();
		player.toggleMute();
	};

	const handleTapAutoModeIndicator = () => {
		toggleAutoMode();
		player.toggleAutoMode();
	};

	const handleHisotyButton = () => {
		openHistory();
	};

	return (
		<div
			id="ui"
			className="absolute z-20 top-0 left-0 w-full h-16 flex justify-end items-center"
		>
			<div
				id="mute-indicator"
				className="text-white text-lg mr-4 cursor-pointer p-2 bg-slate-900 bg-opacity-70 rounded-sm"
				onClick={handleTapMuteIndicator}
				onKeyDown={handleTapMuteIndicator}
			>
				{isMute ? "Unmute" : "Mute"}
			</div>
			<div
				className="text-white text-lg mr-4 cursor-pointer p-2 bg-slate-900 bg-opacity-70 rounded-sm"
				onClick={handleTapAutoModeIndicator}
				onKeyDown={handleTapAutoModeIndicator}
			>
				{isAutoMode ? "Auto Off" : "Auto On"}
			</div>
			<div
				id="history-button"
				className="text-white text-lg mr-4 cursor-pointer p-2 bg-slate-900 bg-opacity-70 rounded-sm"
				onClick={handleHisotyButton}
				onKeyDown={handleHisotyButton}
			>
				History
			</div>
		</div>
	);
};
