import { api } from "@/client/api";
import { AUTH_TOKEN_COOKIE_NAME } from "@/configs/constants";
import { ENV } from "@/configs/env";
import { verify } from "hono/jwt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const guard = async () => {
	const cookieStore = await cookies();
	const signedCookie = cookieStore.get(AUTH_TOKEN_COOKIE_NAME)?.value;
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
