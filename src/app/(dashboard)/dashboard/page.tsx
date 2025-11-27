"use client";

import { GraficaBarrasSemanal } from "@/components/dashboard/GraficaBarrasSemanal";
import { GraficaPastelPagos } from "@/components/dashboard/GraficaPastelPagos";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { fetchKpiData } from "@/lib/services";
import { KpiData } from "@/types/common";
import { Repeat2, DollarSign, Clock, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const [data, setData] = useState<KpiData[]>([]);

    const kpiMap: Record<KpiData["key"], { icon: React.ReactNode; colorClass: string }> = {
        totalTransacciones: {
            icon: <Repeat2 className="w-5 h-5 text-indigo-700" />,
            colorClass: 'bg-indigo-100'
        },
        montoConciliado: {
            icon: <DollarSign className="w-5 h-5 text-green-700" />,
            colorClass: 'bg-green-100'
        },
        pagosPendientes: {
            icon: <Clock className="w-5 h-5 text-red-700" />,
            colorClass: 'bg-red-100'
        },
        proveedoresActivos: {
            icon: <Users className="w-5 h-5 text-cyan-700" />,
            colorClass: 'bg-cyan-100'
        },
    };

    useEffect(() => {
        let active = true;

        const load = () => {
            fetchKpiData()
                .then((d) => active && setData(d))
                .catch((err) => console.error(err));
        };
        load();
        const interval = setInterval(() => {
            load();
        }, 30000);

        return () => {
            active = false;
            clearInterval(interval);
        };
    }, []);


    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {data.map((kpi) => <KpiCard key={kpi.id} icon={kpiMap[kpi.key].icon} colorClass={kpiMap[kpi.key].colorClass} title={kpi.title} value={kpi.value} description={kpi.description} />)}
            <GraficaPastelPagos />
            <GraficaBarrasSemanal />
        </div>
    )
}
