import { Button } from "@/client/components/shadcn/button";
import { Checkbox } from "@/client/components/shadcn/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/client/components/shadcn/form";
import { Input } from "@/client/components/shadcn/input";
import { Textarea } from "@/client/components/shadcn/textarea";
import {
	type CategoryResponse,
	type GameDetailResponse,
	type UpdateGameRequest,
	updateGameRequestSchema,
} from "@/schemas/games/dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export const ProjectSettings = ({
	game,
	onSaveSettings,
	categories,
}: {
	game: GameDetailResponse | null;
	onSaveSettings: (data: UpdateGameRequest) => void;
	categories: CategoryResponse[];
}) => {
	const [previewImage, setPreviewImage] = useState<string | null>(null);

	const form = useForm<UpdateGameRequest>({
		resolver: zodResolver(updateGameRequestSchema),
		defaultValues: {
			name: game?.name || "",
			description: game?.description || "",
			categoryIds: game?.categoryIds || [],
			coverImageUrl: game?.coverImageUrl || "",
		},
	});

	const handleSubmit = (data: UpdateGameRequest) => {
		onSaveSettings(data);
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				const result = reader.result as string;
				setPreviewImage(result);
				form.setValue("coverImageUrl", result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleCategoryChange = (
		checked: boolean,
		category: CategoryResponse,
	) => {
		const currentCategories = form.getValues("categoryIds") || [];
		const newCategories = checked
			? [...currentCategories, category.id]
			: currentCategories.filter((id) => id !== category.id);
		form.setValue("categoryIds", newCategories, {
			shouldValidate: true,
		});
	};

	useEffect(() => {
		if (game) {
			form.reset({
				name: game.name,
				description: game.description,
				categoryIds: game.categoryIds,
				coverImageUrl: game.coverImageUrl,
			});
			setPreviewImage(game.coverImageUrl);
		}
	}, [game, form.reset]);

	return (
		<>
			<h2 className="text-lg font-bold mb-2">ゲーム設定</h2>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>タイトル</FormLabel>
								<FormControl>
									<Input
										placeholder="ゲームのタイトル"
										value={field.value || ""}
										onChange={field.onChange}
									/>
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
									<Textarea
										placeholder="ゲームの説明"
										value={field.value || ""}
										onChange={field.onChange}
										rows={4}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="categoryIds"
						render={() => (
							<FormItem>
								<FormLabel>カテゴリ</FormLabel>
								<div className="flex flex-col gap-2 mt-2">
									{categories.map((category) => (
										<div
											key={category.id}
											className="flex items-center space-x-2"
										>
											<Checkbox
												id={`category-${category.id}`}
												checked={form
													.watch("categoryIds")
													?.includes(category.id)}
												onCheckedChange={(checked) => {
													handleCategoryChange(Boolean(checked), category);
												}}
											/>
											<label
												htmlFor={`category-${category.id}`}
												className="text-sm font-medium leading-none cursor-pointer"
											>
												{category.name}
											</label>
										</div>
									))}
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* TODO: アップロード */}
					<FormField
						control={form.control}
						name="coverImageUrl"
						render={({ field }) => (
							<FormItem>
								<FormLabel>カバー画像</FormLabel>
								<div className="flex flex-col space-y-2">
									{previewImage && (
										<div className="relative w-full h-40 overflow-hidden rounded-md">
											<img
												src={previewImage}
												alt="カバープレビュー"
												className="object-cover w-full h-full"
											/>
										</div>
									)}
									<div className="flex items-center gap-2">
										<Input
											type="file"
											accept="image/*"
											onChange={handleImageChange}
											className="flex-1"
										/>
										{field.value && (
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() => {
													form.setValue("coverImageUrl", "");
													setPreviewImage(null);
												}}
											>
												クリア
											</Button>
										)}
									</div>
									<p className="text-xs text-gray-500">
										推奨サイズ: 1280x720px (16:9)
									</p>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div>
						<Button type="submit" className="mt-4">
							保存
						</Button>
					</div>
				</form>
			</Form>
		</>
	);
};
