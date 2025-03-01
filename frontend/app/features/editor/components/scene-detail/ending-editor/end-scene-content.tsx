import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/shadcn/card";

export const EndSceneContent: React.FC = () => {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-xl font-bold">ゲーム終了</CardTitle>
				<CardDescription>このシーンでゲームが終了します</CardDescription>
			</CardHeader>
		</Card>
	);
};
