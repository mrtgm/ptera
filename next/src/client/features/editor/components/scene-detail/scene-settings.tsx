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
import { zodResolver } from "@hookform/resolvers/zod";
import {
	type SceneResponse,
	type UpdateSceneSettingRequest,
	updateSceneSettingRequestSchema,
} from "@ptera/schema";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export const SceneSettings = ({
	scene,
	onSaveSettings,
}: {
	scene: SceneResponse | null;
	onSaveSettings: (data: UpdateSceneSettingRequest) => void;
}) => {
	const form = useForm<UpdateSceneSettingRequest>({
		defaultValues: {
			name: scene?.name || "",
		},
		resolver: zodResolver(updateSceneSettingRequestSchema),
	});

	const handleSubmit = (data: UpdateSceneSettingRequest) => {
		onSaveSettings(data);
	};

	useEffect(() => {
		if (scene) {
			form.reset({
				name: scene.name || "",
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
						name="name"
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
