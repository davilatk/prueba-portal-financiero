'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from 'lucide-react';
import { WeeklyMetric } from '@/types/common';

const weeklyData: WeeklyMetric[] = [
    { dia: 'Lun', monto: 4500 },
    { dia: 'Mar', monto: 3200 },
    { dia: 'Mié', monto: 7800 },
    { dia: 'Jue', monto: 5600 },
    { dia: 'Vie', monto: 9100 },
    { dia: 'Sáb', monto: 6400 },
    { dia: 'Dom', monto: 2300 },
];

export function GraficaBarrasSemanal() {
    return (
        <Card className="shadow-md flex flex-col md:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2 text-lg">
                    <span>Transacciones Semanales</span>
                    <div className="p-2 rounded-full bg-cyan-100">
                        <BarChart3 className="w-5 h-5 text-cyan-500" />
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="md:h-[450px] h-[250px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis
                                dataKey="dia"
                                tick={{ fontSize: 12, fill: '#888' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tickFormatter={(val: number) => `$${val / 1000}k`}
                                tick={{ fontSize: 12, fill: '#888' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                cursor={{ fill: '#f9fafb' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Volumen']}
                            />
                            <Bar
                                dataKey="monto"
                                fill="#6366f1"
                                radius={[4, 4, 0, 0]}
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}