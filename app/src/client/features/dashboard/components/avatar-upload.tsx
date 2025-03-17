"use client";

import { Avatar } from "@/client/components/avatar";
import { Button } from "@/client/components/shadcn/button";
import { Camera } from "lucide-react";
import { useRef, useState } from "react";

const uploadAvatar = async (userId: number, file: File) => {
	const formData = new FormData();
	formData.append("avatar", file);

	const response = await fetch(`/api/users/${userId}/avatar`, {
		method: "POST",
		body: formData,
	});

	return response.json();
};

export function AvatarUpload({
	userId,
	username,
	avatarUrl,
	onAvatarUploaded,
}: {
	userId: number;
	username: string;
	avatarUrl: string;
	onAvatarUploaded: (newAvatarUrl: string) => void;
}) {
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleAvatarClick = () => {
		alert("ファイルアップロードは現在開発中です。");
		//fileInputRef.current?.click();
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!file.type.startsWith("image/")) {
			setError("画像ファイルを選択してください");
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			setError("ファイルサイズは5MB以下にしてください");
			return;
		}

		try {
			setIsUploading(true);
			setError(null);

			const result = await uploadAvatar(userId, file);

			if (result.success && result.data) {
				onAvatarUploaded(result.data.avatarUrl || "");
			} else {
				setError(result.error || "アップロードに失敗しました");
			}
		} catch (err) {
			setError("アバターのアップロード中にエラーが発生しました");
			console.error("Avatar upload error:", err);
		} finally {
			setIsUploading(false);

			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		}
	};

	return (
		<div className="flex flex-col space-y-2 items-center sm:flex-row sm:space-y-0 sm:space-x-4">
			<div
				className="relative cursor-pointer"
				onClick={handleAvatarClick}
				onKeyDown={() => {}}
			>
				<Avatar
					username={username}
					avatarUrl={avatarUrl}
					className="h-24 w-24"
				/>
				{isUploading && (
					<div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
						<div className="animate-spin h-8 w-8 border-4 border-t-white border-opacity-50 rounded-full" />
					</div>
				)}
			</div>

			<div className="space-y-2 text-center sm:text-left">
				<Button
					variant="outline"
					size="sm"
					type="button"
					onClick={handleAvatarClick}
					disabled={isUploading}
				>
					<Camera className="mr-2 h-4 w-4" />
					{isUploading ? "アップロード中..." : "アバターを変更"}
				</Button>

				{error && <p className="text-sm text-red-500">{error}</p>}

				<p className="text-xs text-muted-foreground">
					JPG, PNG, GIF形式の画像 (最大5MB)
				</p>

				<input
					type="file"
					ref={fileInputRef}
					className="hidden"
					accept="image/*"
					// onChange={handleFileChange}
					// disabled={isUploading}
				/>
			</div>
		</div>
	);
}
