// src/lib/api.ts

import { KpiData, User, PaymentRequest } from '@/types/common';
import axios from '@/lib/axios';

/**
 * Intercambia el código de autorización de Microsoft por un token y datos de usuario.
 * @param code Código de autorización recibido de Microsoft.
 * @returns {Promise<{ token: string, user: User }>}  Un objeto que contiene el token y los datos del usuario.
 */
export async function fetchMSexchange({ code }: { code: string }): Promise<{ user: User, message: string }> {
    const response = await axios.post<{ user: User, message: string }>('/api/auth/microsoft/exchange', { code });
    return response.data;
}

/**
 * Obtiene los datos de KPI desde la API.
 * @returns {KpiData[]>} Un array de datos de KPI.
 */
export async function fetchKpiData(): Promise<KpiData[]> {
    const response = await axios.get<KpiData[]>('/api/kpi');
    return response.data;
}

/**
 * Obtiene las solicitudes de pago desde la API.
 * @returns {PaymentRequest[]>} Un array de solicitudes de pago.
 */
export async function fetchSolicitudes(): Promise<PaymentRequest[]> {
    const response = await axios.get<PaymentRequest[]>('/api/solicitudes');
    return response.data;
}

/**
 * Actualiza el estado de una solicitud de pago.
 * @param id ID de la solicitud a actualizar.
 * @param status Nuevo estado de la solicitud.
 * @returns {Promise<void>}
 */
export async function updateSolicitudStatus(id: string, status: string): Promise<void> {
    await axios.patch('/api/solicitudes', { id, status });
}