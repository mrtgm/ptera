"use client";

import { api } from "@/client/api";
import { Button } from "@/client/components/shadcn/button";
import { CardContent, CardFooter } from "@/client/components/shadcn/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/client/components/shadcn/form";
import { Input } from "@/client/components/shadcn/input";
import { Toaster } from "@/client/components/shadcn/sonner";
import { Textarea } from "@/client/components/shadcn/textarea";
import { useStore } from "@/client/stores";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	type UpdateProfileRequest,
	type UserResponse,
	updateProfileRequestSchema,
} from "@ptera/schema";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AvatarUpload } from "./avatar-upload";

export const ProfileForm = ({ user }: { user: UserResponse }) => {
	const router = useRouter();
	const userSlice = useStore.useSlice.user();
	const [avatarUrl, setAvatarUrl] = useState<string>(user.avatarUrl || "");
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	const form = useForm<UpdateProfileRequest>({
		resolver: zodResolver(updateProfileRequestSchema),
		defaultValues: {
			name: user.name,
			bio: user.bio,
		},
	});

	const isSubmitting = form.formState.isSubmitting;

	const onSubmit = async (data: UpdateProfileRequest) => {
		try {
			await api.users.updateProfile(user.id, data);
			toast.success("プロフィールを更新しました");
		} catch (error) {
			toast.error("プロフィールの更新中にエラーが発生しました");
		}
	};

	const handleAvatarUploaded = (newAvatarUrl: string) => {
		setAvatarUrl(newAvatarUrl);
		toast.success("アバターを更新しました");
	};

	// ログアウトハンドラ
	const handleLogout = async () => {
		try {
			setIsLoggingOut(true);
			userSlice.logout();
			toast.success("ログアウトしました");

			router.push("/login");
			router.refresh();
		} catch (error) {
			toast.error("ログアウト中にエラーが発生しました");
			console.error("Error logging out:", error);
		} finally {
			setIsLoggingOut(false);
		}
	};

	return (
		<Form {...form}>
			<Toaster />

			<form onSubmit={form.handleSubmit(onSubmit)}>
				<CardContent>
					<div className="space-y-6">
						<AvatarUpload
							userId={user.id}
							username={user.name}
							avatarUrl={avatarUrl}
							onAvatarUploaded={handleAvatarUploaded}
						/>

						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>ニックネーム</FormLabel>
									<FormControl>
										<Input placeholder="表示名を入力" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="bio"
							render={({ field }) => (
								<FormItem>
									<FormLabel>自己紹介</FormLabel>
									<FormControl>
										<Textarea
											placeholder="自分自身について簡単に説明"
											rows={4}
											{...field}
											value={field.value || ""}
										/>
									</FormControl>
									<p className="text-sm text-muted-foreground">
										公開プロフィールに表示される簡単な自己紹介文
									</p>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</CardContent>

				<CardFooter className="flex justify-between">
					<Button
						variant="outline"
						type="button"
						onClick={handleLogout}
						disabled={isLoggingOut}
					>
						<LogOut className="mr-2 h-4 w-4" />
						{isLoggingOut ? "ログアウト中..." : "ログアウト"}
					</Button>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "保存中..." : "変更を保存"}
					</Button>
				</CardFooter>
			</form>
		</Form>
	);
};
