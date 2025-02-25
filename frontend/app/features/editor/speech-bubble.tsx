import { Pen } from "lucide-react";
import { type ReactElement, type ReactNode, cloneElement } from "react";

export const SpeechBubble = ({
	id,
	hex,
	icon,
	title,
	children,
	onClick,
}: {
	id?: string;
	hex: string;
	title: string;
	icon: ReactElement | null;
	children: ReactNode;
	onClick?: () => void;
}) => {
	return (
		<div
			key={id}
			className="flex items-center w-full cursor-pointer"
			onClick={onClick}
			onKeyDown={() => {}}
		>
			<div
				className="w-8 h-0.5 flex-shrink-0"
				style={{ backgroundColor: hex }}
			/>

			{/* Marker */}
			<div
				className="absolute w-5 h-5 rounded-full bg-white border-2 transform"
				style={{
					borderColor: hex || "#6366F1",
				}}
			>
				<div
					className="w-3 h-3 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
					style={{
						backgroundColor: hex || "#6366F1",
					}}
				/>
			</div>

			<div
				className="rounded-lg p-3 shadow-md relative flex-1 w-full"
				style={{
					backgroundColor: `${hex}20`,
					borderLeft: `4px solid ${hex}`,
				}}
			>
				{icon && (
					<div className="absolute -top-3 -left-3 bg-white rounded-full p-1 shadow-md">
						{cloneElement(icon || <Pen />, { color: hex, size: 16 })}
					</div>
				)}

				<div className="font-medium text-gray-800">{title}</div>

				<div className="text-xs text-gray-600 mt-1 overflow-hidden text-ellipsis whitespace-nowrap">
					{children}
				</div>
			</div>
		</div>
	);
};
