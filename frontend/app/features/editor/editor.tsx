import { useEffect, useRef, useState } from "react";
import dummyAssets from "~/__mocks__/dummy-assets.json";
import dummyGame from "~/__mocks__/dummy-game.json";
import { states } from "~/features/player/constants";
import { player } from "~/features/player/libs/engine";
import { resourceManager } from "~/utils/preloader";
import { usePlayerInitialize } from "../player/hooks";

export const Editor = () => {
	const { game, state, stage, history, currentEvent } = usePlayerInitialize();

	const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
	const selectedScene = game?.scenes.find(
		(scene) => scene.id === selectedSceneId,
	);

	return (
		<div className="w-full h-full flex flex-col">
			<div className="w-full flex justify-between items-center h-[64px]">
				<div className="p-2">Noveller</div>
				<div className="flex-1 flex gap-3 justify-end p-2">
					<div className="flex items-center">プロジェクト設定</div>
					<div className="flex items-center">アセット</div>
					<div className="flex items-center">キャラクター</div>
					<div className="flex items-center">最初からプレビュー</div>
				</div>
			</div>
			<div className="w-full h-full grid grid-cols-12">
				<div className="col-span-3 flex justify-center items-center">
					サイドバー
				</div>
				<div className="col-span-6 flex justify-center items-center">
					{state === "loading" || !game ? (
						<div className="w-full h-ful flex justify-center items-center select-none">
							<div className="text-2xl">読み込み中...</div>
						</div>
					) : selectedSceneId === null ? (
						<div className="w-full h-full flex flex-col justify-center items-center select-none">
							{game.scenes.map((scene) => (
								<div
									key={scene.id}
									className="cursor-pointer"
									onClick={() => setSelectedSceneId(scene.id)}
									onKeyDown={() => {}}
								>
									{scene.id}
								</div>
							))}
						</div>
					) : (
						<div className="w-full h-full flex flex-col justify-center items-center select-none">
							{selectedScene?.events.map((event) => (
								<div key={event.id}>{event.type}</div>
							))}
						</div>
					)}
				</div>
				<div className="col-span-3 flex justify-center items-center">
					プレビュー
				</div>
			</div>
		</div>
	);
};
