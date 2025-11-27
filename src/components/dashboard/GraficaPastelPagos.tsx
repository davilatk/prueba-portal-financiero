'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Loader2, PieChart as PieIcon } from 'lucide-react';
import { ChartData, PaymentStats } from '@/types/common';

const COLORS = ['#10b981', '#f59e0b'];

export function GraficaPastelPagos() {
    const [data, setData] = useState<ChartData[]>([]);
    const [previousData, setPreviousData] = useState<ChartData[]>([]);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        const eventSource = new EventSource('/api/pagos');
        eventSource.onopen = () => setIsConnected(true);
        eventSource.onmessage = (event: MessageEvent) => {
            try {
                const parsed: PaymentStats = JSON.parse(event.data as string);

                setData((prevData) => {
                    if (prevData.length > 0) {
                        setPreviousData(prevData);
                    }

                    const newChartData: ChartData[] = [
                        { name: 'Conciliados', value: parsed.conciliado },
                        { name: 'Pendientes', value: parsed.pendiente },
                    ];
                    return newChartData;
                });
            } catch (error) {
                console.error('Error parsing SSE data:', error);
            }
        };
        eventSource.onerror = () => {
            eventSource.close();
            setIsConnected(false);
        };
        return () => eventSource.close();
    }, []);

    const getChangeIndicator = (name: string, currentValue: number) => {
        const prevItem = previousData.find(d => d.name === name);
        if (!prevItem) return null;
        const difference = currentValue - prevItem.value;

        if (difference > 0) {
            return <ArrowUp className="w-3 h-3 text-green-500" />;
        } else if (difference < 0) {
            return <ArrowDown className="w-3 h-3 text-red-500" />;
        }
        return null;
    };

    return (
        <Card className="shadow-md flex flex-col md:col-span-2">
            <CardHeader className="items-center pb-0">
                <CardTitle className="flex justify-between text-lg font-medium">
                    <div className='flex items-center gap-2'>
                        <span>Estado de Pagos</span>
                        {isConnected ? (
                            <span className="flex h-2 w-2 relative ml-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                        ) : (
                            <Loader2 className="w-4 h-4 animate-spin text-gray-400 ml-2" />
                        )}
                    </div>
                    <div className="p-2 rounded-full bg-indigo-100">
                        <PieIcon className="w-5 h-5 text-indigo-500" />
                    </div>
                </CardTitle>
                <div className='sm:flex items-center gap-6 mt-4 text-xs text-muted-foreground'>
                    {data.map(d => (
                        <span key={d.name} className="flex items-center gap-1">
                            {d.name}:
                            <span className="text-gray-900 font-semibold">${d.value.toLocaleString()}</span>
                            {getChangeIndicator(d.name, d.value)} {/* <-- Aquí se inyecta la flecha */}
                        </span>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <div className="md:h-[450px] h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={120}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Monto']}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}