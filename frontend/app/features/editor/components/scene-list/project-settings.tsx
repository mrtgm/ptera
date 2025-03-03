import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "~/components/shadcn/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/shadcn/form";
import { Input } from "~/components/shadcn/input";
import type { Game } from "~/schema";

export type ProjectSettingsFormData = {
	gameTitle: string;
	authorName: string;
	description: string;
};

export const ProjectSettings = ({
	game,
	onSaveSettings,
}: {
	game: Game | null;
	onSaveSettings: (data: ProjectSettingsFormData) => void;
}) => {
	const form = useForm<ProjectSettingsFormData>({
		defaultValues: {
			gameTitle: game?.title || "",
			authorName: game?.author || "",
			description: game?.description || "",
		},
	});

	const handleSubmit = (data: ProjectSettingsFormData) => {
		onSaveSettings(data);
	};

	useEffect(() => {
		if (game) {
			form.reset({
				gameTitle: game.title || "",
				authorName: game.author || "",
				description: game.description || "",
			});
		}
	}, [game, form.reset]);

	return (
		<>
			<h2 className="text-lg font-bold mb-2">ゲーム設定</h2>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
					<FormField
						control={form.control}
						name="gameTitle"
						render={({ field }) => (
							<FormItem>
								<FormLabel>タイトル</FormLabel>
								<FormControl>
									<Input placeholder="ゲームのタイトル" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="authorName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>作者</FormLabel>
								<FormControl>
									<Input placeholder="作者名" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>説明</FormLabel>
								<FormControl>
									<Input placeholder="ゲームの説明" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div>
						<Button type="submit" className="mt-2">
							保存
						</Button>
					</div>
				</form>
			</Form>
		</>
	);
};
