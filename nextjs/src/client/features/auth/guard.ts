import { api } from "@/client/api";
import { CONSTANTS } from "@ptera/config";
import { ENV } from "@ptera/config";
import { verify } from "hono/jwt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const guard = async () => {
  const cookieStore = await cookies();
  const signedCookie = cookieStore.get(CONSTANTS.AUTH_TOKEN_COOKIE_NAME)?.value;
  if (!signedCookie) {
    return redirect("/login");
  }
  const parsedToken = await verify(signedCookie, ENV.JWT_SECRET);
  const userId = parsedToken.userId as number | undefined;
  if (!userId) {
    return redirect("/login");
  }
  const user = await api.users.get(userId);
  if (!user) {
    return redirect("/login");
  }

  api.withToken(signedCookie);

  return user;
};
