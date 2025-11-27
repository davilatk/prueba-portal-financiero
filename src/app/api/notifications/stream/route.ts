import { NextResponse } from 'next/server';
import { popNotifications } from '@/lib/queue';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const headers = new Headers({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });

    const stream = new ReadableStream({
        start(controller) {
            const encoder = new TextEncoder();

            // Función para enviar datos al cliente
            const sendData = (data: unknown) => {
                const message = `data: ${JSON.stringify(data)}\n\n`;
                controller.enqueue(encoder.encode(message));
            };

            // Revisar el archivo
            const intervalId = setInterval(async () => {
                try {
                    const notifications = await popNotifications();

                    if (notifications.length > 0) {
                        notifications.forEach(note => {
                            sendData(note);
                        });
                    }
                } catch (error) {
                    console.error("Error leyendo cola de notificaciones", error);
                }
            }, 1000);

            request.signal.addEventListener('abort', () => {
                clearInterval(intervalId);
                try { controller.close(); } catch { }
            });
        }
    });

    return new NextResponse(stream, { headers });
}