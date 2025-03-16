"use client";

import { ApiError } from "@/client/api/generated";
import { Button } from "@/client/components/shadcn/button";
import { useEffect } from "react";

interface ErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function GlobalErrorBoundary({ error, reset }: ErrorProps) {
	useEffect(() => {
		// TODO: sentry
		console.error(error);
	}, [error]);

	const getErrorMessage = () => {
		if (error instanceof ApiError) {
			return "サーバーエラーが発生しました。しばらく経ってから再度お試しください。";
		}
		// https://nextjs.org/docs/app/api-reference/file-conventions/error#errordigest
		const digestInfo = error.digest ? `(ID: ${error.digest})` : "";
		return `予期しないエラーが発生しました。${digestInfo}`;
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-[70vh] p-6">
			<div className="max-w-md w-full p-6 bg-card border rounded-lg shadow-sm">
				<h2 className="text-2xl font-bold mb-4 text-destructive">
					問題が発生しました
				</h2>

				<p className="text-muted-foreground mb-6">{getErrorMessage()}</p>

				<div className="flex flex-col sm:flex-row gap-4">
					<Button onClick={reset} variant="default" className="flex-1">
						再試行
					</Button>

					<Button
						onClick={() => {
							window.location.href = "/";
						}}
						variant="outline"
						className="flex-1"
					>
						ホームに戻る
					</Button>
				</div>

				{process.env.NODE_ENV === "development" && (
					<div className="mt-8 p-4 bg-muted rounded text-xs overflow-auto max-h-48">
						<p className="font-bold mb-2">開発者向け詳細:</p>
						<pre>{error.stack || error.message || String(error)}</pre>
					</div>
				)}
			</div>
		</div>
	);
}
