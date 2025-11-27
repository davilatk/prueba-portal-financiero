# 🚀 Portal Financiero de Gestión de Pagos

Este proyecto es una prueba técnica para un Portal Financiero construido sobre el _stack_ moderno de **Next.js (App Router)** y **TypeScript**.

El objetivo es demostrar una arquitectura escalable, segura y reactiva, enfocada en la gestión de métricas financieras y flujos de aprobación de pagos con experiencia de usuario optimizada.

---

## ✨ Características Principales

| Módulo             | Funcionalidad         | Detalle Técnico                                                                                                                                            |
| :----------------- | :-------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Dashboard**      | **KPIs y Gráficos**   | Visualización de datos con **Recharts**. Gráfico de pastel actualizado en **Tiempo Real** vía **Server-Sent Events (SSE)**.                                |
| **Solicitudes**    | **Gestión de Pagos**  | **DataTable** avanzada (TanStack Table) con filtrado por servidor/cliente, ordenamiento y paginación.                                                      |
| **UX**             | **Optimistic UI**     | Las acciones de aprobación/rechazo actualizan la interfaz **instantáneamente** antes de confirmar con el servidor, mejorando la percepción de velocidad.   |
| **Notificaciones** | **Sistema Asíncrono** | Arquitectura de **Cola de Mensajes** basada en archivos (`fs`) que desacopla la petición HTTP del envío de la notificación (Simulación de Background Job). |
| **Seguridad**      | **Auth Robusta**      | Manejo de sesiones mediante Cookies con flags **`HttpOnly`**, **`Secure`** y **`SameSite=Strict`** para mitigar XSS y CSRF.                                |
| **Calidad**        | **Testing**           | Tests unitarios y de integración con **Jest** y **React Testing Library**.                                                                                 |

---

## 🛠️ Stack Tecnológico

-   **Core:** Next.js 14+ (App Router), React, TypeScript.
-   **Estilos:** Tailwind CSS, Shadcn UI, Lucide React.
-   **Estado:** Zustand (Ligero y desacoplado de React Context).
-   **Visualización:** Recharts, TanStack Table v8.
-   **Backend (BFF):** Next.js Route Handlers & Server Actions.
-   **Testing:** Jest, Jest Environment JSDOM.

---

## 📐 Arquitectura y Decisiones de Diseño

### 1. Sistema de Notificaciones Desacoplado (Pattern: File Queue + SSE)

Para simular un entorno real donde un proceso pesado (ej. transacción bancaria) notifica al usuario al terminar, implementé una arquitectura sin dependencias externas (como Redis):

1.  **Trigger:** El endpoint `PATCH /api/solicitudes` escribe un mensaje en una cola física (`data/notifications.json`) y responde `200 OK` inmediatamente.
2.  **Worker Simulado:** El endpoint `GET /api/notifications/stream` mantiene una conexión SSE abierta y "pollea" el archivo cada segundo.
3.  **Push:** Si encuentra mensajes, los envía al cliente y limpia la cola.
4.  **Resultado:** El usuario recibe una notificación "push" independiente de su navegación, incluso si cambia de página.

### 2. Actualización Optimista (Optimistic Updates)

En la sección de `/solicitudes`:

-   Al hacer clic en "Aprobar", el estado de React se actualiza inmediatamente.
-   Se envía la petición al servidor en segundo plano.
-   Si la petición falla, se hace un **Rollback** automático al estado anterior y se notifica el error.

### 3. Seguridad en Autenticación

A diferencia del almacenamiento en `localStorage` (vulnerable a XSS), este proyecto:

-   Genera el token JWT (simulado) en el servidor.
-   Lo inyecta en una cookie **`HttpOnly`** que JavaScript no puede leer.
-   Valida la sesión en el Middleware o Server Components leyendo esta cookie.

---

## 🚀 Instalación y Ejecución

1.  **Clonar el repositorio:**

    ```bash
    git clone https://github.com/davilatk/prueba-portal-financiero
    cd prueba-portal-financiero
    ```

2.  **Instalar dependencias:**

    ```bash
    npm install
    ```

3.  **Ejecutar entorno de desarrollo:**

    ```bash
    npm run dev
    ```

    La aplicación estará disponible en `http://localhost:3000`.

4.  **Ejecutar Tests:**
    ```bash
    npm run test
    ```

---

## 📂 Estructura del Proyecto

```text
src/
├── actions/        # Server Actions (Logout, operaciones sensibles)
├── app/            # Next.js App Router (Rutas y Layouts)
│   ├── (auth)/     # Rutas públicas (Login)
│   ├── (dashboard)/# Rutas protegidas (Dashboard, Solicitudes)
│   └── api/        # Backend for Frontend (SSE, Mock DB)
├── components/     # Componentes React
│   ├── common/     # Sidebar, Header, NotificationListener
│   ├── dashboard/  # Gráficos, KPIs
│   └── ui/         # Componentes base (Shadcn)
├── lib/            # Utilidades (Axios, Queue Logic, Events)
├── store/          # Estado Global (Zustand)
└── types/          # Definiciones TypeScript
data/               # Base de datos simulada (JSON Files)
```
