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

export type SceneSettingsFormData = {
	sceneTitle: string;
};

export const SceneSettings = ({
	scene,
	onSaveSettings,
}: {
	scene: Scene | null;
	onSaveSettings: (data: SceneSettingsFormData) => void;
}) => {
	const form = useForm<SceneSettingsFormData>({
		defaultValues: {
			sceneTitle: scene?.title || "",
		},
	});

	const handleSubmit = (data: SceneSettingsFormData) => {
		onSaveSettings(data);
	};

	useEffect(() => {
		if (scene) {
			form.reset({
				sceneTitle: scene.title || "",
			});
		}
	}, [scene, form.reset]);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)}>
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

				<Button type="submit" className="mt-2">
					保存
				</Button>
			</form>
		</Form>
	);
};
