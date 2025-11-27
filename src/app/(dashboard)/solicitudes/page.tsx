// src/app/(dashboard)/solicitudes/page.tsx
'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { PaymentRequest, RequestStatus } from '@/types/common';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X, ArrowUpDown } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from "@tanstack/react-table"
import { fetchSolicitudes, updateSolicitudStatus } from '@/lib/services';

export default function SolicitudesPage() {
    const [requests, setRequests] = useState<PaymentRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSolicitudes()
            .then(data =>
                setRequests(data)
            )
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleStatusUpdate = useCallback((id: string, newStatus: RequestStatus) => {
        const previousRequests = [...requests];

        setRequests(prev => prev.map(req =>
            req.id === id ? { ...req, status: newStatus } : req
        ));

        updateSolicitudStatus(id, newStatus)
            .catch((_error) => {
                // Rollback si falla
                setRequests(previousRequests);
            });
    }, [requests]);

    const columns = useMemo<ColumnDef<PaymentRequest>[]>(() => [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
        },
        {
            accessorKey: "provider",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="pl-0 hover:bg-transparent"
                    >
                        Proveedor
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        {
            accessorKey: "date",
            header: "Fecha",
        },
        {
            accessorKey: "amount",
            header: () => <div className="text-right">Monto</div>,
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("amount"))
                const formatted = new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                }).format(amount)
                return <div className="text-right font-bold">{formatted}</div>
            },
        },
        {
            accessorKey: "status",
            header: "Estatus",
            cell: ({ row }) => {
                const status = row.getValue("status") as RequestStatus;
                const styles = {
                    pending: 'bg-yellow-100 text-yellow-800',
                    approved: 'bg-green-100 text-green-800',
                    rejected: 'bg-red-100 text-red-800'
                };
                const labels = {
                    pending: 'Pendiente',
                    approved: 'Aprobado',
                    rejected: 'Rechazado'
                };
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
                        {labels[status]}
                    </span>
                );
            },
        },
        {
            id: "actions",
            header: () => <div className="text-right">Acciones</div>,
            cell: ({ row }) => {
                const request = row.original

                if (request.status !== 'pending') return null;

                return (
                    <div className="flex justify-end gap-2">
                        <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0"
                            onClick={() => handleStatusUpdate(request.id, 'approved')}
                            title="Aprobar"
                        >
                            <Check className="w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 w-8 p-0"
                            onClick={() => handleStatusUpdate(request.id, 'rejected')}
                            title="Rechazar"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                )
            },
        },
    ], [handleStatusUpdate]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Solicitudes</h1>

            <Card className="overflow-hidden">
                <CardContent className="p-6">
                    {loading ? (
                        <div className="text-center py-10 text-gray-500">Cargando solicitudes...</div>
                    ) : (
                        <DataTable columns={columns} data={requests} searchKey="provider" />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}