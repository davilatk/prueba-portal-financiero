import { LucideIcon } from "lucide-react";

/**
 * @export
 * @interface User
 * Define la estructura de un usuario autenticado.
 */
export interface User {
    name: string;
    email: string;
    avatar?: string;
}


/**
 * Estado de la solicitud de pago.
 *
 * @export
 * @typedef {('pending' | 'approved' | 'rejected')} RequestStatus
 */
export type RequestStatus = 'pending' | 'approved' | 'rejected';


/**
 * @export
 * @interface PaymentRequest
 * Define la estructura de una solicitud de pago individual.
 */
export interface PaymentRequest {
    id: string;
    provider: string;
    amount: number;
    status: RequestStatus;
    date: string;
}

/**
 * @export
 * @interface AuthState
 * Estado y acciones de autenticación para la tienda Zustand.
 */
export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    isHydrated: boolean;
    login: (_user: User) => void;
    logout: () => void;
    checkAuth: () => void;
}

/**
 * @export
 * @interface LoginResponse
 * Respuesta esperada del endpoint de inicio de sesión.
 */
export interface LoginResponse {
    accessToken: string;
    user: User;
}

/**
 * @export
 * @interface MenuItem
 * Define la estructura de un elemento de navegación del menú.
 */
export interface MenuItem {
    label: string;
    icon: React.ReactElement<LucideIcon>;
    href: string;
    selected: boolean;
}

/**
 * @export
 * @interface KpiData
 * Estructura de datos para las tarjetas KPI estáticas del Dashboard.
 */
export interface KpiData {
    id: string;
    title: string;
    value: number | string;
    description: string;
    key: 'totalTransacciones' | 'montoConciliado' | 'pagosPendientes' | 'proveedoresActivos';
}

/**
 * @export
 * @interface PaymentStats
 * Datos en tiempo real de conciliación de pagos (usado con SSE).
 */
export interface PaymentStats {
    conciliado: number;
    pendiente: number;
}

/**
 * @export
 * @interface ChartData
 * Estructura para los puntos de datos de Recharts (e.g., Gráfica de Pastel).
 */
export interface ChartData {
    name: string;
    value: number;
    // Permite propiedades dinámicas para la librería Recharts
    [key: string]: string | number | undefined;
}

/**
 * @export
 * @interface WeeklyMetric
 * Estructura para los datos de la gráfica de barras de la última semana.
 */
export interface WeeklyMetric {
    dia: string;
    monto: number;
}

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
    id: string;
    message: string;
    type: NotificationType;
}

export interface NotificationState {
    notifications: Notification[];
    addNotification: (_message: string, _type: NotificationType) => void;
    removeNotification: (_id: string) => void;
}