"use client";

// エディタ部分は SPA として実装
// https://github.com/vercel/next.js/discussions/55393#discussioncomment-11896236

import nextDynamic from "next/dynamic";

const Editor = nextDynamic(() => import("~/client/features/editor"), {
	ssr: false,
});

export const dynamic = "force-static";

export default function SceneList() {
	return (
		<div className="w-full h-dvh flex justify-center">
			<Editor />
		</div>
	);
}
