import { Button } from "@/client/components/shadcn/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
} from "@/client/components/shadcn/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { useNavigationGuard } from "next-navigation-guard";

export const UnsavedChangeDialog = ({ isDirty }: { isDirty: boolean }) => {
	const navGuard = useNavigationGuard({ enabled: isDirty });
	return (
		<Dialog open={navGuard.active}>
			<DialogHeader className="sr-only">
				<DialogTitle>変更を破棄しますか？</DialogTitle>
				<DialogDescription>未保存の変更があります。</DialogDescription>
			</DialogHeader>

			<DialogContent className="[&>button]:hidden">
				未保存の変更があります。変更を破棄しますか？
				<DialogFooter>
					<Button variant="secondary" onClick={navGuard.reject}>
						キャンセル
					</Button>
					<Button variant="destructive" onClick={navGuard.accept}>
						破棄する
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
