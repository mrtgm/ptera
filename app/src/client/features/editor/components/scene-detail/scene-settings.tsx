import { Button } from "@/client/components/shadcn/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/client/components/shadcn/form";
import { Input } from "@/client/components/shadcn/input";
import type { SceneResponse } from "@/schemas/games/dto";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export type SceneSettingsFormData = {
	sceneTitle: string;
};

export const SceneSettings = ({
	scene,
	onSaveSettings,
}: {
	scene: SceneResponse | null;
	onSaveSettings: (data: SceneSettingsFormData) => void;
}) => {
	const form = useForm<SceneSettingsFormData>({
		defaultValues: {
			sceneTitle: scene?.name || "",
		},
	});

	const handleSubmit = (data: SceneSettingsFormData) => {
		onSaveSettings(data);
	};

	useEffect(() => {
		if (scene) {
			form.reset({
				sceneTitle: scene.name || "",
			});
		}
	}, [scene, form.reset]);

	return (
		<>
			<h2 className="text-lg font-bold mb-2">シーン設定</h2>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
					<FormField
						control={form.control}
						name="sceneTitle"
						render={({ field }) => (
							<FormItem>
								<FormLabel>タイトル</FormLabel>
								<FormControl>
									<Input placeholder="シーンのタイトル" {...field} />
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
