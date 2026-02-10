const { NextResponse } = require("next/server");

export function middleware(request){
    const token = request.cookies.get("jwtToken");
    const userData = request.cookies.get("userData");
    const { pathname } = request.nextUrl;

    const publicRoutes = ["/pages/auth/login", "/pages/auth/unauthorized", "/"];
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    if(!token && !isPublicRoute){
        return NextResponse.redirect(new URL("/pages/auth/login", request.url));
    }

    if (token && pathname === "/pages/auth/login") {
        return NextResponse.redirect(new URL("/pages", request.url));
    }

    return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};