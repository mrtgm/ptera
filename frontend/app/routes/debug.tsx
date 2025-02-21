import { Player } from "~/features/player";

export default function Debug() {
	return (
		<div className="w-full h-dvh flex pt-[64px] justify-center bg-black">
			<Player />
		</div>
	);
}
