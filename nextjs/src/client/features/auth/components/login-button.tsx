"use client";

import { Alert, AlertDescription } from "@/client/components/shadcn/alert";
import { Button } from "@/client/components/shadcn/button";
import { useStore } from "@/client/stores";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";

export function LoginButtons() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const userSlice = useStore.useSlice.user();

  const handleSocialLogin = async (provider: string) => {
    try {
      setError(null);
      setIsLoading(provider);
      userSlice.login(provider);
    } catch (err) {
      setError("認証中にエラーが発生しました");
      console.error(err);
      setIsLoading(null);
    }
  };

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => handleSocialLogin("google")}
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
          Googleでログイン
        </Button>

        {/* <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white"
          onClick={() => handleSocialLogin("x")}
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
        </Button> */}
      </div>
    </>
  );
}
