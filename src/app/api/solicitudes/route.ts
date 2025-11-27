import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { PaymentRequest } from '@/types/common';
import { pushNotification } from '@/lib/queue';

const jsonDirectory = path.join(process.cwd(), 'data');
const file_path = path.join(jsonDirectory, 'requests.json');

export const dynamic = 'force-dynamic';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// GET: Obtener solicitudes
export async function GET() {
    await sleep(1000);
    try {
        const fileContents = await fs.readFile(file_path, 'utf8');
        const data = JSON.parse(fileContents);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Error al leer solicitudes' + error }, { status: 500 });
    }
}

// PATCH: Actualizar estado de una solicitud
export async function PATCH(request: Request) {
    try {
        const { id, status } = await request.json();

        const fileContents = await fs.readFile(file_path, 'utf8');
        const requests: PaymentRequest[] = JSON.parse(fileContents);

        const index = requests.findIndex((r) => r.id === id);
        if (index === -1) {
            return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 });
        }

        requests[index] = { ...requests[index], status };

        setTimeout(async () => {
            await pushNotification({
                message: `Solicitud #${id} ${status === 'approved' ? 'aprobada' : 'rechazada'} a las ${new Date().toLocaleTimeString()}`,
                type: status === 'approved' ? 'success' : 'error',
            });
        }, 10000);

        await fs.writeFile(file_path, JSON.stringify(requests, null, 2));

        return NextResponse.json({ success: true, data: requests[index] });
    } catch (error) {
        return NextResponse.json({ error: 'Error actualizando solicitud' + error }, { status: 500 });
    }
}