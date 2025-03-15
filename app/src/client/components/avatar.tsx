import clsx from "clsx";
import React from "react";
import { getInitials } from "../utils/string";
import {
	AvatarFallback,
	AvatarImage,
	Avatar as ShadcnAvatar,
} from "./shadcn/avatar";

export type AvatarProps = {
	avatarUrl: string | null | undefined;
	username: string;
	className?: string;
};

export const Avatar = ({ avatarUrl, username, className }: AvatarProps) => {
	return (
		<ShadcnAvatar className={clsx("h-8 w-8", className)}>
			<AvatarImage src={avatarUrl} alt={username} />
			<AvatarFallback className="text-xs">
				{getInitials(username)}
			</AvatarFallback>
		</ShadcnAvatar>
	);
};
