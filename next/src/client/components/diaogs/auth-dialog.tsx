"use client";

import { Button } from "@/client/components/shadcn/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/client/components/shadcn/dialog";
import { useStore } from "@/client/stores";
import { useState } from "react";

export const useAuthDialog = () => {
	const [authDialogOpen, setAuthDialogOpen] = useState(false);
	const userSlice = useStore.useSlice.user();

	const handleLogin = () => {
		userSlice.login("google");
		setAuthDialogOpen(false);
	};

	const AuthDialog = ({
		message,
	}: {
		message: string;
	}) => {
		return (
			<Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>ログインが必要です</DialogTitle>
						<DialogDescription>{message}</DialogDescription>
					</DialogHeader>
					<DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-4">
						<Button variant="outline" onClick={() => setAuthDialogOpen(false)}>
							キャンセル
						</Button>
						<Button onClick={handleLogin}>ログイン</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	};

	return { AuthDialog, setAuthDialogOpen, authDialogOpen };
};
