import type { Game } from "@/client/schema";

export const InitialScreen = ({
	game,
	handleTapInitialScreen,
}: {
	game: Game | null;
	handleTapInitialScreen: () => void;
}) => {
	return (
		<div
			className={`w-full h-full relative select-none ${
				game?.coverImageUrl
					? `bg-cover bg-center bg-no-repeat
			`
					: "bg-black"
			}`}
			style={
				game?.coverImageUrl
					? {
							backgroundImage: `url(${game.coverImageUrl})`,
						}
					: {}
			}
			onClick={handleTapInitialScreen}
			onKeyDown={() => {}}
		>
			<div className="absolute bottom-16 right-16 p-4 bg-black/70 rounded-sm space-y-2">
				<div className="text-white text-4xl">{game?.name}</div>
				<div className="text-white text-2xl">by {game?.username}</div>
				<div className="text-white text-lg">タップしてスタート</div>
			</div>
		</div>
	);
};
