import { PaymentStats } from '@/types/common';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Acceso no autorizado' }, { status: 401 });
    }

    const headers = new Headers({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });

    const stream = new ReadableStream({
        start(controller) {
            const encoder = new TextEncoder();

            const sendEvent = (data: PaymentStats) => {
                const formattedData = `data: ${JSON.stringify(data)}\n\n`;
                controller.enqueue(encoder.encode(formattedData));
            };

            const intervalId = setInterval(() => {
                const totalConciliado = Math.floor(Math.random() * 50000) + 150000;
                const totalPendiente = Math.floor(Math.random() * 20000) + 10000;

                sendEvent({
                    conciliado: totalConciliado,
                    pendiente: totalPendiente
                });
            }, 2000);

            request.signal.addEventListener('abort', () => {
                clearInterval(intervalId);
                controller.close();
            });
        },
    });

    return new NextResponse(stream, { headers });
}