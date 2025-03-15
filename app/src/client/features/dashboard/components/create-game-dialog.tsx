import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@/client/components/shadcn/alert";
import { Button } from "@/client/components/shadcn/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/client/components/shadcn/dialog";
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
	type CreateGameRequest,
	createGameRequestSchema,
} from "@/schemas/games/dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type * as z from "zod";

export default function CreateGameDialog({
	open,
	onOpenChange,
	onCreate,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onCreate: (title: string, description: string) => Promise<number | undefined>;
}) {
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const form = useForm<CreateGameRequest>({
		resolver: zodResolver(createGameRequestSchema),
		defaultValues: {
			name: "",
			description: "",
		},
	});

	const handleCreateGame = async (values: CreateGameRequest) => {
		try {
			setIsSubmitting(true);
			setError("");
			const gameId = await onCreate(values.name, values.description || "");

			if (gameId) {
				form.reset();
				onOpenChange(false);
				router.push(`/dashboard/games/${gameId}/edit`);
			} else {
				setError("ゲームの作成に失敗しました");
			}
		} catch (err) {
			setError("ゲームの作成中にエラーが発生しました");
			console.error(err);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[525px]">
				<DialogHeader>
					<DialogTitle>新しいゲームを作成</DialogTitle>
					<DialogDescription>
						新しいゲームプロジェクトを作成します。詳細は後で編集できます。
					</DialogDescription>
				</DialogHeader>

				{error && (
					<Alert variant="destructive" className="my-2">
						<AlertTitle>エラー</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleCreateGame)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>タイトル</FormLabel>
									<FormControl>
										<Input placeholder="ゲームタイトルを入力" {...field} />
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
											placeholder="ゲームの説明を入力"
											rows={3}
											value={field.value ?? ""}
											onChange={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter className="pt-4">
							<DialogClose asChild>
								<Button variant="outline" type="button" disabled={isSubmitting}>
									キャンセル
								</Button>
							</DialogClose>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? "作成中..." : "作成"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
