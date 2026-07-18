import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Explicitly bypass API requests, static files, and assets
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // If already at root, continue as normal
  if (pathname === "/") {
    return NextResponse.next();
  }

  // Redirect any other path to "/"
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: "/:path*",
};
