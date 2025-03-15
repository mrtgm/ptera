// app/page.tsx
"use client";

import { useEffect, useState } from "react";

interface User {
	id: string;
	sub: string;
	email: string;
	name?: string | null;
	picture?: string | null;
	createdAt: string;
	updatedAt: string;
}

export default function Home() {
	const [user, setUser] = useState<User | null>(null);

	const handleLogout = async () => {
		window.location.href = "/api/v1/auth/logout";
	};

	const createPost = async () => {};

	return (
		<main className="min-h-screen p-8">
			<div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
				<h1 className="text-2xl font-bold mb-4">Auth0 + Hono + Next.js Demo</h1>

				<div>
					<p className="mb-4">
						ログインして、保護されたコンテンツにアクセスしてください。
					</p>
					<a
						href="/api/v1/auth/google"
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block"
					>
						ログイン
					</a>
					<button
						onClick={handleLogout}
						className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-block ml-4"
						type="button"
					>
						ログアウト
					</button>

					<button
						onClick={createPost}
						className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-block ml-4"
						type="button"
					>
						POST
					</button>
				</div>
			</div>
		</main>
	);
}
