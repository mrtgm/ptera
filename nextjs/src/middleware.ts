import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("ptera-auth");

  const header = request.headers.get("cookie");

  const headerKeys = request.headers.keys();
  const headerValues = request.headers.values();

  console.log(headerKeys);
  console.log(headerValues);

  console.log(header);
  console.log(request.nextUrl.pathname);
  console.log(authCookie);

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!authCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
