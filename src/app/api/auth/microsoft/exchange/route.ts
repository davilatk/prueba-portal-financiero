import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const { code } = await request.json();

        if (!code || code === "invalid") {
            return NextResponse.json(
                { error: "invalid_code", message: "Código de autenticación inválido." },
                { status: 400 }
            );
        }

        const user = {
            name: "Dummy User",
            email: "dummy@viajeslili.com",
            avatar: "https://github.com/shadcn.png"
        };
        const token = "dummy-token-123456";

        const cookieStore = await cookies();

        cookieStore.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
            sameSite: 'strict',
        });

        return NextResponse.json(
            {
                user,
                message: "Autenticación exitosa. Token guardado en cookie HttpOnly."
            },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: "server_error", details: String(error) },
            { status: 500 }
        );
    }
}