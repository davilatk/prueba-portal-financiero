import path from 'path';
import { promises as fs } from 'fs';

const jsonDirectory = path.join(process.cwd(), 'data');
const queuePath = path.join(jsonDirectory, 'notifications.json');

export interface NotificationItem {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    timestamp: number;
}

async function ensureFile() {
    try {
        await fs.access(queuePath);
    } catch {
        await fs.writeFile(queuePath, '[]');
    }
}

// Agregar notificación a la cola
export async function pushNotification(notification: Omit<NotificationItem, 'id' | 'timestamp'>) {
    await ensureFile();
    const fileContent = await fs.readFile(queuePath, 'utf8');
    const queue: NotificationItem[] = fileContent ? JSON.parse(fileContent) : [];

    const newItem: NotificationItem = {
        ...notification,
        id: Math.random().toString(36).substring(7),
        timestamp: Date.now(),
    };

    queue.push(newItem);
    await fs.writeFile(queuePath, JSON.stringify(queue, null, 2));
}

// Leer y limpiar la cola
export async function popNotifications(): Promise<NotificationItem[]> {
    await ensureFile();
    const fileContent = await fs.readFile(queuePath, 'utf8');
    const queue: NotificationItem[] = fileContent ? JSON.parse(fileContent) : [];

    if (queue.length === 0) return [];

    await fs.writeFile(queuePath, '[]');

    return queue;
}