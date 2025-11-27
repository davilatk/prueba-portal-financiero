import { KpiData } from '@/types/common';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {

  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Acceso no autorizado' }, { status: 401 });
  }

  // Datos KPIs
  const MOCK_KPI_DATA: KpiData[] = [
    {
      id: 'kpi-1',
      title: 'Total de Transacciones (Hoy)',
      value: Math.floor(Math.random() * 500 + 100),
      description: '25% más que el promedio de la semana',
      key: 'totalTransacciones',
    },
    {
      id: 'kpi-2',
      title: 'Monto Conciliado (Mes)',
      value: `$${(Math.random() * 200000 + 50000).toFixed(2)}`,
      description: 'Meta mensual alcanzada en un 85%',
      key: 'montoConciliado',
    },
    {
      id: 'kpi-3',
      title: 'Pagos Pendientes',
      value: Math.floor(Math.random() * 15 + 3),
      description: 'Requiere atención inmediata',
      key: 'pagosPendientes',
    },
    {
      id: 'kpi-4',
      title: 'Proveedores Activos',
      value: Math.floor(Math.random() * 500 + 50),
      description: '3 nuevos proveedores registrados este mes',
      key: 'proveedoresActivos',
    },
  ];

  return NextResponse.json(MOCK_KPI_DATA, { status: 200 });
}