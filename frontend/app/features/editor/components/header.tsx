import { useParams } from "@remix-run/react";
import { Button } from "~/components/shadcn/button";
import { Menubar } from "~/components/shadcn/menubar";
import { useStore } from "~/stores";

export const Header = () => {
	const editorSlice = useStore.useSlice.editor();
	const modalSlice = useStore.useSlice.modal();
	const pathparams = useParams();
	const selectedSceneId = pathparams.sceneId;
	const selectedEventId = pathparams.eventId;

	if (!editorSlice.editingGame || !editorSlice.editingResources) {
		return null;
	}

	const previewSceneId = selectedSceneId
		? selectedSceneId
		: editorSlice.editingGame?.initialSceneId;

	// TODO: イベントはオーダーをもたせる
	const previewEventId = selectedEventId
		? selectedEventId
			? editorSlice.editingGame.scenes.find(
					(scene) => scene.id === selectedSceneId,
				)?.events[0].id
			: editorSlice.editingGame.scenes.find(
					(scene) => scene.id === editorSlice.editingGame?.initialSceneId,
				)?.events[0].id
		: undefined;

	return (
		<Menubar className="rounded-none flex justify-between bg-[#1E1E1E] text-[#8D8D8D] w-full">
			<div className="p-2">Noveller</div>
			<div className="flex-1 flex gap-3 justify-end p-2">
				{/* TODO: 実装 */}
				{/* <Button variant="ghost" onClick={() => {}}>
					プロジェクト設定
				</Button> */}
				<>
					{/* イベントがない場合プレビュー不能 */}
					{previewEventId && (
						<Button
							variant="ghost"
							onClick={() => {
								modalSlice.openModal("preview", {
									currentSceneId: previewSceneId,
									currentEventId: previewEventId,
									formValues: {},
								});
							}}
						>
							プレビュー
						</Button>
					)}
					<Button
						variant="ghost"
						onClick={() => {
							console.log("fired?");
							modalSlice.openModal("asset.manage", {
								target: "backgroundImages",
							});
						}}
					>
						アセット
					</Button>
					<Button
						variant="ghost"
						onClick={() => modalSlice.openModal("character.manage", undefined)}
					>
						キャラクター
					</Button>
				</>
			</div>
		</Menubar>
	);
};
