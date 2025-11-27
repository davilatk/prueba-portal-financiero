"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { fetchMSexchange } from "@/lib/services";

export default function MicrosoftCallback() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);

    useEffect(() => {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");

        if (!code) {
            router.push("/login?error=missing_code");
            return;
        }

        fetchMSexchange({ code })
            .then(({ user }) => {
                if (user) {
                    // Guardar sesión
                    login(user);

                    toast.success("Inicio de sesión exitoso", {
                        description: "Redirigiendo al dashboard..."
                    });

                    router.push("/dashboard");
                } else {
                    router.push("/login?error=invalid_user");
                }
            })
            .catch(() => {
                router.push("/login?error=exchange_failed");
            });
    }, [router, login]);

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
                    <CardTitle className="text-2xl font-bold">Iniciando con Microsoft</CardTitle>
                    <CardDescription>
                        Portal Financiero - Acceso
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Button
                        disabled={true}
                        className="w-full h-12 bg-white hover:bg-gray-50 text-black border border-gray-300"
                    >
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Iniciando...
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
