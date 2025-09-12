import { auth } from "@/auth";
import { NextResponse, type NextRequest } from "next/server";

export default auth((req: NextRequest & { auth: unknown }) => {
    const { pathname } = req.nextUrl;
    const isLoggedIn = !!req.auth;

    // Rotas públicas que não requerem autenticação
    const publicRoutes = ["/", "/auth/signin", "/auth/signup", "/auth/error"];
    const _isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith("/api/auth");

    // Rotas protegidas que requerem autenticação
    const protectedRoutes = ["/dashboard", "/profile", "/admin"];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // Se não está logado e tenta acessar rota protegida
    if (!isLoggedIn && isProtectedRoute) {
        const signInUrl = new URL("/auth/signin", req.nextUrl.origin);
        signInUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(signInUrl);
    }

    // Se está logado e tenta acessar página de login
    if (isLoggedIn && pathname === "/auth/signin") {
        return NextResponse.redirect(new URL("/", req.nextUrl.origin));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public (public files)
         */
        "/((?!_next/static|_next/image|favicon.ico|public).*)",
    ],
};
