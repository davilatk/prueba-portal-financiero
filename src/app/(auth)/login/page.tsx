'use client';

import Image from "next/image";
import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MicrosoftLogo } from '@/components/common/MicrosoftLogo';

function LoginPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const searchParams = useSearchParams();

    useEffect(() => {
        const error = searchParams.get("error");

        if (error) {
            const messages: Record<string, string> = {
                missing_code: "Microsoft no regresó un código de autenticación.",
                invalid_user: "No se pudo obtener tu perfil de Microsoft.",
                exchange_failed: "Falló el intercambio del código por un token.",
                unauthorized: "No tienes autorización para acceder.",
            };

            const url = new URL(window.location.href);
            url.searchParams.delete("error");
            router.replace(url.toString());

            toast.error("Error en el inicio de sesión", { description: messages[error] ?? "Error desconocido en el inicio de sesión." });
        }
    }, [searchParams, router]);

    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/dashboard');
        }
    }, [isAuthenticated, router]);

    const handleLogin = () => {
        if (isAuthenticated) return;

        // Construir URL de Microsoft OAuth2
        const params = new URLSearchParams({
            client_id: process.env.NEXT_PUBLIC_MS_CLIENT_ID || "TEST_CLIENT_ID",
            response_type: "code",
            response_mode: "query",
            redirect_uri: process.env.NEXT_PUBLIC_MS_REDIRECT_URI || "/auth/callback",
            scope: "openid profile email https://graph.microsoft.com/User.Read offline_access"
        });

        const url = `/common/oauth2/v2.0/authorize?${params.toString()}`;

        window.location.href = url;
    };

    if (isAuthenticated) return null;

    return (
        <div className="flex min-h-screen items-center justify-center dark:bg-gray-900">
            <Card className="w-[380px] shadow-2xl">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto my-4">
                        <Image
                            src="/brand-primary.png"
                            alt="Logo Viajes Lili"
                            width={128}
                            height={50}
                        />
                    </div>
                    <CardTitle className="text-2xl font-bold">Bienvenido a Viajes Lili</CardTitle>
                    <CardDescription>
                        Portal Financiero - Acceso
                    </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-4">
                    <Button
                        onClick={handleLogin}
                        className="w-full h-12 bg-white hover:bg-gray-50 text-black border border-gray-300"
                    >
                        <MicrosoftLogo />
                        Iniciar sesión con Microsoft
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default function LoginPageSus() {
    return (
        <Suspense fallback={<div>Cargando URL...</div>}>
            <LoginPage />
        </Suspense>
    );
}