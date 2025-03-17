import { useState } from "react";
import type { EventManager } from "../../utils/event";

export const Ui = ({
	manager,
	openHistory,
	onChangeAutoMode,
	onChangeMute,
	isPreviewMode,
}: {
	manager: EventManager;
	openHistory: () => void;
	onChangeMute: (isMute: boolean) => void;
	onChangeAutoMode: (isAutoMode: boolean) => void;
	isPreviewMode?: boolean;
}) => {
	const [isMute, setIsMute] = useState(false);
	const [isAutoMode, setIsAutoMode] = useState(false);

	const handleTapMuteIndicator = () => {
		if (isMute) {
			onChangeMute(false);
			setIsMute(false);
		} else {
			onChangeMute(true);
			setIsMute(true);
		}
	};

	const handleTapAutoModeIndicator = () => {
		if (isAutoMode) {
			onChangeAutoMode(false);
			setIsAutoMode(false);
		} else {
			onChangeAutoMode(true);
			setIsAutoMode(true);
		}
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
				className="text-white text-lg mr-4 cursor-pointer p-2 bg-slate-900/70 rounded-sm"
				onClick={handleTapMuteIndicator}
				onKeyDown={handleTapMuteIndicator}
			>
				{isMute ? "Unmute" : "Mute"}
			</div>
			{!isPreviewMode && (
				<div
					className="text-white text-lg mr-4 cursor-pointer p-2 bg-slate-900/70 rounded-sm"
					onClick={handleTapAutoModeIndicator}
					onKeyDown={handleTapAutoModeIndicator}
				>
					{isAutoMode ? "Auto Off" : "Auto On"}
				</div>
			)}
			{!isPreviewMode && (
				<div
					id="history-button"
					className="text-white text-lg mr-4 cursor-pointer p-2 bg-slate-900/70 rounded-sm"
					onClick={handleHisotyButton}
					onKeyDown={handleHisotyButton}
				>
					History
				</div>
			)}
		</div>
	);
};
