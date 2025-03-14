"use client";

import { Input } from "@/client/components/shadcn/input";
import { Search } from "lucide-react";
import { useState } from "react";

export const SearchForm = () => {
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			window.location.href = `/games?search=${encodeURIComponent(searchQuery)}`;
		}
	};

	return (
		<form onSubmit={handleSearch} className="relative">
			<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
			<Input
				placeholder="ゲームを検索..."
				className="pl-10 w-full"
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>
		</form>
	);
};
