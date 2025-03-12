"use client";

import { useState } from "react";

import { Alert, AlertDescription } from "@/client/components/shadcn/alert";
// shadcn components
import { Button } from "@/client/components/shadcn/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/client/components/shadcn/card";
import { Checkbox } from "@/client/components/shadcn/checkbox";
import { Label } from "@/client/components/shadcn/label";
import { Separator } from "@/client/components/shadcn/separator";

// icons
import { AlertTriangle, Github, Loader2, Mail, Twitter } from "lucide-react";
import Link from "next/link";

export default function Register() {
	const [isLoading, setIsLoading] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [agreeTerms, setAgreeTerms] = useState(false);

	const handleSocialSignup = async (provider: string) => {
		if (!agreeTerms) {
			setError("利用規約とプライバシーポリシーに同意してください");
			return;
		}

		try {
			setError(null);
			setIsLoading(provider);

			// AWS Cognitoで外部IdP認証を開始する処理
			// 実際の実装では、Cognitoの認証URLにリダイレクトします
			window.location.href = `/api/auth/${provider}?action=signup`;
		} catch (err) {
			setError("認証中にエラーが発生しました");
			console.error(err);
			setIsLoading(null);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold">
						<Link href="/" className="text-primary">
							Ptera
						</Link>
					</h1>
					<p className="text-slate-600 mt-2">あなただけのゲームを作ろう</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="text-xl">アカウント作成</CardTitle>
					</CardHeader>
					<CardContent>
						{error && (
							<Alert variant="destructive" className="mb-6">
								<AlertTriangle className="h-4 w-4 mr-2" />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<div className="space-y-4">
							<div className="flex items-center space-x-2 mb-2">
								<Checkbox
									id="terms"
									checked={agreeTerms}
									onCheckedChange={(checked) => setAgreeTerms(checked === true)}
									disabled={!!isLoading}
								/>
								<Label htmlFor="terms" className="text-sm">
									<span>
										<Link
											href="/terms"
											className="text-primary hover:underline"
										>
											利用規約
										</Link>
										と
										<Link
											href="/privacy"
											className="text-primary hover:underline"
										>
											プライバシーポリシー
										</Link>
										に同意します
									</span>
								</Label>
							</div>

							<Button
								variant="outline"
								className="w-full flex items-center justify-center gap-2"
								onClick={() => handleSocialSignup("google")}
								disabled={!!isLoading}
							>
								{isLoading === "google" ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<svg
										width="18"
										height="18"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
									>
										<title>Google</title>
										<path
											fill="#4285F4"
											d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
										/>
										<path
											fill="#34A853"
											d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
										/>
										<path
											fill="#FBBC05"
											d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
										/>
										<path
											fill="#EA4335"
											d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
										/>
									</svg>
								)}
								Googleで登録
							</Button>

							<Button
								variant="outline"
								className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white"
								onClick={() => handleSocialSignup("x")}
								disabled={!!isLoading}
							>
								{isLoading === "x" ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<svg
										width="18"
										height="18"
										viewBox="0 0 1200 1227"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<title>X</title>
										<path
											d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"
											fill="white"
										/>
									</svg>
								)}
								Xでログイン
							</Button>
						</div>

						<div className="mt-4 text-center text-sm text-slate-500">
							<p>
								外部アカウントで登録すると、そのサービスからプロフィール情報を取得します
							</p>
						</div>
					</CardContent>
					<CardFooter className="flex flex-col">
						<Separator className="my-4" />
						<div className="text-center text-sm">
							すでにアカウントをお持ちですか？{" "}
							<Link
								href="/login"
								className="font-medium text-primary hover:underline"
							>
								ログイン
							</Link>
						</div>
					</CardFooter>
				</Card>

				<div className="text-center mt-8 text-sm text-slate-500">
					<p>&copy; 2025 Ptera. All rights reserved.</p>
				</div>
			</div>
		</div>
	);
}
