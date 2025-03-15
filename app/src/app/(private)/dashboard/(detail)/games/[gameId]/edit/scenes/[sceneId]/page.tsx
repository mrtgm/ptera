import { api } from "@/client/api";
import { Editor } from "~/client/features/editor";

export default async function SceneDetail({
	params,
}: {
	params: Promise<{
		gameId: number;
	}>;
}) {
	const p = await params;
	const gameId = p.gameId;

	const [game, categories, resources] = await Promise.all([
		api.games.get(gameId),
		api.games.getCategories(),
		api.games.getAssets(gameId),
	]);

	return (
		<div className="w-full h-dvh flex justify-center">
			<Editor game={game} categories={categories} resources={resources} />
		</div>
	);
}
