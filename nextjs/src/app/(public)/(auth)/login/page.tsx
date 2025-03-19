import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/client/components/shadcn/card";
import { LoginButtons } from "@/client/features/auth/components/login-button";
import Link from "next/link";

export default function Login() {
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
            <CardTitle className="text-xl">ログイン</CardTitle>
          </CardHeader>
          <CardContent>
            <LoginButtons />

            <div className="mt-4 text-center text-sm text-slate-500">
              <p>
                ログインすることで、
                <Link href="/terms" className="text-primary hover:underline">
                  利用規約
                </Link>
                と
                <Link href="/privacy" className="text-primary hover:underline">
                  プライバシーポリシー
                </Link>
                に同意したことになります
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-sm text-slate-500">
          <p>&copy; 2025 Ptera. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
