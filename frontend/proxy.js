import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // 1. Bypass Next.js internal requests (_next/static, _next/image, etc.)
  // and API routes
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 2. Bypass static assets in the public directory (images, manifest, robots, etc.)
  // Checks if the path has a file extension (e.g. .png, .jpg, .svg, .txt)
  const hasFileExtension = /\.[a-zA-Z0-9]+$/.test(pathname);
  if (hasFileExtension) {
    return NextResponse.next();
  }

  // 3. Allow access to the root homepage
  if (pathname === "/") {
    return NextResponse.next();
  }

  // 4. Redirect any other unknown page route to the homepage "/"
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  // Run on all paths except static files if matched here, but we also filter inside the function for safety
  matcher: "/:path*",
};
