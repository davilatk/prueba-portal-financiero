import '@testing-library/jest-dom';
import { render, screen, waitFor, act } from '@testing-library/react';
import Dashboard from '@/app/(dashboard)/dashboard/page';
import { fetchKpiData } from '@/lib/services';
import { KpiData } from '@/types/common';

jest.mock('@/lib/services', () => ({
    fetchKpiData: jest.fn(),
}));

jest.mock('@/components/dashboard/GraficaPastelPagos', () => ({
    GraficaPastelPagos: () => <div data-testid="mock-pastel">Gráfica Pastel de Pagos</div>,
}));

jest.mock('@/components/dashboard/GraficaBarrasSemanal', () => ({
    GraficaBarrasSemanal: () => <div data-testid="mock-barras">Gráfica Barras Semanal</div>,
}));

const mockKpiData: KpiData[] = [
    {
        id: '1',
        key: 'totalTransacciones',
        title: 'Total Transacciones',
        value: 150,
        description: 'vs ayer',
    },
    {
        id: '2',
        key: 'montoConciliado',
        title: 'Monto Conciliado',
        value: '$50,000',
        description: '80% meta',
    },
];

describe('Dashboard Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('debe renderizar los gráficos estáticos correctamente', async () => {
        (fetchKpiData as jest.Mock).mockResolvedValue([]);

        await act(async () => {
            render(<Dashboard />);
        });

        // Verificamos que los componentes gráficos están presentes
        expect(screen.getByTestId('mock-pastel')).toBeInTheDocument();
        expect(screen.getByTestId('mock-barras')).toBeInTheDocument();
    });

    it('debe obtener datos y renderizar las tarjetas KPI', async () => {
        // Simulamos una respuesta exitosa de la API
        (fetchKpiData as jest.Mock).mockResolvedValue(mockKpiData);

        await act(async () => {
            render(<Dashboard />);
        });

        // Verificamos que se llamó al servicio de datos
        expect(fetchKpiData).toHaveBeenCalledTimes(1);

        // Esperamos a que los datos se rendericen en el DOM
        await waitFor(() => {
            expect(screen.getByText('Total Transacciones')).toBeInTheDocument();
            expect(screen.getByText('Monto Conciliado')).toBeInTheDocument();
        });

        // Verificamos valores específicos de las tarjetas
        expect(screen.getByText('150')).toBeInTheDocument();
        expect(screen.getByText('$50,000')).toBeInTheDocument();
    });

    it('debe manejar errores en la carga de datos silenciosamente', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        (fetchKpiData as jest.Mock).mockRejectedValue(new Error('Error de red'));

        await act(async () => {
            render(<Dashboard />);
        });

        // Verificamos que intentó llamar a la API
        expect(fetchKpiData).toHaveBeenCalled();

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalled();
        });

        // Los gráficos deberían seguir ahí aunque fallen los KPIs
        expect(screen.getByTestId('mock-pastel')).toBeInTheDocument();

        consoleSpy.mockRestore();
    });
});