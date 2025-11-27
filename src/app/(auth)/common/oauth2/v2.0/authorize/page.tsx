'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MicrosoftLogo } from '@/components/common/MicrosoftLogo';
import { Suspense } from 'react';

function MicrosoftAuthorizeDummy() {
    const params = useSearchParams();
    const router = useRouter();

    // Extraemos los params directamente (sin estados → sin errores)
    const clientId = params.get('client_id') || '';
    const redirectUri = params.get('redirect_uri') || '';
    const state = params.get('state') || '';

    const handleDummyLogin = () => {
        const dummyCode = "DUMMY_AUTH_CODE_12345";

        router.push(
            `${redirectUri}?code=${dummyCode}&state=${encodeURIComponent(state)}`
        );
    };

    const handleDummyError = () => {
        router.push(
            `${redirectUri}`
        );
    };

    return (
        <div className="flex min-h-screen items-center justify-center dark:bg-gray-900">
            <Card className="w-[380px] shadow-2xl">
                <CardHeader>
                    <div className="mx-auto my-4">
                        <MicrosoftLogo />
                    </div>
                    <CardTitle className="text-2xl font-bold">
                        Microsoft OAuth2 (Dummy)
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 pt-4">
                    <div>
                        <p className="font-semibold">client_id:</p>
                        <p className="text-sm text-muted-foreground">{clientId}</p>
                    </div>

                    <div>
                        <p className="font-semibold">redirect_uri:</p>
                        <p className="text-sm text-muted-foreground">{redirectUri}</p>
                    </div>

                    <div>
                        <p className="font-semibold">Usuario dummy</p>
                        <p className="text-sm">dummy@viajeslili.com</p>
                    </div>
                </CardContent>

                <CardFooter>
                    <div className="w-full gap-2 flex flex-col">
                        <Button
                            className="w-full mb-2"
                            onClick={handleDummyLogin}
                        >
                            Iniciar sesión como dummy@viajeslili.com
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={handleDummyError}
                        >
                            Enviar error de autorización (Para pruebas)
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

export default function MicrosoftAuthorizeDummySus() {
    return (
        <Suspense fallback={<div>Cargando URL...</div>}>
            <MicrosoftAuthorizeDummy />
        </Suspense>
    );
}