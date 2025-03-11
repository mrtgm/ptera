import type { MessageHistory } from "@/client/schema";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

export const History = ({
	history,
	closeHistory,
}: { history: MessageHistory[]; closeHistory: () => void }) => {
	const handleTapHistoryClose = () => closeHistory();
	const historyList = useRef<HTMLUListElement | null>(null);

	useEffect(() => {
		setTimeout(() => {
			if (!historyList.current) return;
			historyList.current.scrollTo({
				top: historyList.current.scrollHeight,
			});
		}, 0);
	}, []);

	return (
		<div
			id="history-modal"
			className="z-30 h-full w-full bg-gray-900 bg-opacity-90 text-white text-sm absolute top-0 left-0 p-4"
		>
			<div
				className="absolute top-2 right-2 cursor-pointer p-2"
				onClick={handleTapHistoryClose}
				onKeyDown={() => {}}
			>
				<X />
			</div>
			<ul className="overflow-y-scroll h-[calc(100%-32px)]" ref={historyList}>
				{history.map((message, index) => (
					<li
						key={message.text}
						className="text-white p-2 m-2 grid grid-cols-6 gap-2"
					>
						<div className="col-span-1 text-right font-medium">
							{message.characterName}
						</div>
						<div
							className={`col-span-5 ${message.isChoice ? "text-orange-400" : ""}`}
						>
							{message.text}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};
