"use client";

import type { UserProfile } from "@/client/schema";
import { useEffect, useState } from "react";

import { Alert, AlertDescription } from "~/client/components/shadcn/alert";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "~/client/components/shadcn/avatar";
// shadcn components
import { Button } from "~/client/components/shadcn/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/client/components/shadcn/card";
import { Input } from "~/client/components/shadcn/input";
import { Label } from "~/client/components/shadcn/label";
import { Textarea } from "~/client/components/shadcn/textarea";

// lucide icons
import { AlertTriangle, Camera, LogOut } from "lucide-react";

const currentUser = {
	name: "John Doe",
	bio: "Hello, I'm John Doe",
	avatarUrl: "https://i.pravatar.cc/300",
};

export default function SettingsPage() {
	// useStore からユーザー状態を取得
	// const updateProfile = useStore((state) => state.updateProfile);
	// const logout = useStore((state) => state.logout);

	const updateProfile = (profileData: Partial<UserProfile>) => {
		console.log("updateProfile");
	};
	const logout = () => {
		console.log("logout");
	};

	// ローカル状態
	const [profileData, setProfileData] = useState<Partial<UserProfile>>({
		name: "",
		bio: "",
	});

	const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	useEffect(() => {
		if (currentUser) {
			setProfileData({
				name: currentUser.name,
				bio: currentUser.bio,
			});
		}
	}, []);

	const handleProfileInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setProfileData((prev) => ({ ...prev, [name]: value }));
	};

	const handleProfileSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!profileData.name?.trim()) {
			setMessage({ type: "error", text: "ニックネームは必須です" });
			return;
		}

		try {
			setIsSubmittingProfile(true);
			await updateProfile(profileData);
			setMessage({ type: "success", text: "プロフィールを更新しました" });

			// 3秒後にメッセージをクリア
			setTimeout(() => setMessage(null), 3000);
		} catch (error) {
			setMessage({
				type: "error",
				text: "プロフィールの更新中にエラーが発生しました",
			});
		} finally {
			setIsSubmittingProfile(false);
		}
	};

	const handleLogout = () => {
		logout();
		window.location.href = "/";
	};

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((part) => part.charAt(0))
			.join("")
			.toUpperCase();
	};

	if (!currentUser) {
		return (
			<Card>
				<CardContent className="flex items-center justify-center h-40">
					<p className="text-muted-foreground">
						プロフィール情報を読み込み中...
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-6">
			{message && (
				<Alert
					variant={message.type === "success" ? "default" : "destructive"}
					className="mb-6"
				>
					<AlertTriangle className="h-4 w-4" />
					<AlertDescription>{message.text}</AlertDescription>
				</Alert>
			)}

			<Card>
				<CardHeader>
					<CardTitle>プロフィール情報</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleProfileSubmit} className="space-y-6">
						<div className="space-y-4">
							<div className="flex flex-col space-y-2 items-center sm:flex-row sm:space-y-0 sm:space-x-4">
								<Avatar className="h-24 w-24">
									<AvatarImage
										src={currentUser.avatarUrl}
										alt={currentUser.name}
									/>
									<AvatarFallback className="text-2xl">
										{currentUser.name ? getInitials(currentUser.name) : "GC"}
									</AvatarFallback>
								</Avatar>
								<div className="space-y-2 text-center sm:text-left">
									<Button variant="outline" size="sm" type="button">
										<Camera className="mr-2 h-4 w-4" />
										アバターを変更
									</Button>
								</div>
							</div>

							<div className="grid gap-1 pt-4">
								<Label htmlFor="name">ニックネーム</Label>
								<Input
									id="name"
									name="name"
									value={profileData.name}
									onChange={handleProfileInputChange}
									placeholder="表示名を入力"
								/>
							</div>
							<div className="grid gap-1">
								<Label htmlFor="bio">自己紹介</Label>
								<Textarea
									id="bio"
									name="bio"
									value={profileData.bio || ""}
									onChange={handleProfileInputChange}
									placeholder="自分自身について簡単に説明"
									rows={4}
								/>
								<p className="text-sm text-muted-foreground">
									公開プロフィールに表示される簡単な自己紹介文
								</p>
							</div>
						</div>
					</form>
				</CardContent>
				<CardFooter className="flex justify-between">
					<Button variant="outline" onClick={handleLogout}>
						<LogOut className="mr-2 h-4 w-4" />
						ログアウト
					</Button>
					<Button
						type="submit"
						onClick={handleProfileSubmit}
						disabled={isSubmittingProfile}
					>
						{isSubmittingProfile ? "保存中..." : "変更を保存"}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
