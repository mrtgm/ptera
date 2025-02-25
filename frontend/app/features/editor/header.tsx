import { Button } from "~/components/shadcn/button";
import { Menubar } from "~/components/shadcn/menubar";

export const Header = () => {
	return (
		<Menubar className="rounded-none flex justify-between bg-[#1E1E1E] text-[#8D8D8D] w-full">
			<div className="p-2">Noveller</div>
			<div className="flex-1 flex gap-3 justify-end p-2">
				<Button variant="ghost" onClick={() => {}}>
					プロジェクト設定
				</Button>
				<Button variant="ghost" onClick={() => {}}>
					プレビュー
				</Button>
				<Button variant="ghost" onClick={() => {}}>
					アセット
				</Button>
				<Button variant="ghost" onClick={() => {}}>
					キャラクター
				</Button>
			</div>
		</Menubar>
	);
};
