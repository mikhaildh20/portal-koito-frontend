const { NextResponse } = require("next/server");

export default function proxy(request) {
    const token = request.cookies.get("jwtToken");
    const userDataCookie = request.cookies.get("userData");
    const { pathname } = request.nextUrl;

    const publicRoutes = ["/pages/auth/login", "/pages/auth/unauthorized", "/"];
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    // Redirect ke login kalo ga ada token dan bukan public route
    if (!token && !isPublicRoute) {
        return NextResponse.redirect(new URL("/pages/auth/login", request.url));
    }

    // Redirect ke pages kalo udah login tapi masih di login page
    if (token && pathname === "/pages/auth/login") {
        return NextResponse.redirect(new URL("/pages", request.url));
    }

    // Check force redirect ke profile
    if (token && userDataCookie) {
        try {
            const userData = JSON.parse(userDataCookie.value);
            
            // Kalo force === 1 dan bukan di profile page, paksa ke profile
            if (userData.force === 1 && pathname !== "/pages/user/profile") {
                return NextResponse.redirect(new URL("/pages/user/profile", request.url));
            }
        } catch (error) {
            console.error("Error parsing userData:", error);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};