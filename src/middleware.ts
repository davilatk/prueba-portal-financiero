import { NextResponse, NextRequest } from 'next/server';

// Rutas qeu requieren autenticación
const protectedRoutes = ['/dashboard', '/solicitudes'];
// Rutas que no requieren autenticación
const publicRoutes = ['/login', '/'];

export function middleware(request: NextRequest) {

    const token = request.cookies.get('auth_token')?.value;

    const url = request.nextUrl.clone();
    const isProtected = protectedRoutes.some(path => url.pathname.startsWith(path));
    const isPublic = publicRoutes.some(path => url.pathname === path);

    // Si intenta acceder a una ruta protegida sin token
    if (isProtected && !token) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // Si intenta acceder a una ruta pública ya autenticado
    if (isPublic && token) {
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
    }

    // Continuar con la solicitud
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
    ],
};