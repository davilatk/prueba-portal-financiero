"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
    SortingState,
    ColumnFiltersState,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button, } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { NativeSelect, NativeSelectOption } from "./native-select"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    searchKey?: string
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchKey = "provider",
}: DataTableProps<TData, TValue>) {
    const [pageSize, setpageSize] = useState(30)
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    })

    return (
        <div>
            <div className="flex items-center py-4 gap-2">
                <Input
                    placeholder={`Filtrar por ${searchKey}...`}
                    value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn(searchKey)?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No hay resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <div className="flex justify-end items-center space-x-2 py-4 px-2">
                    <NativeSelect onChange={(e) => {
                        setpageSize(Number(e.target.value))
                        table.setPageSize(Number(e.target.value))
                    }} value={pageSize}>
                        <NativeSelectOption value="10">10</NativeSelectOption>
                        <NativeSelectOption value="20">20</NativeSelectOption>
                        <NativeSelectOption value="50">50</NativeSelectOption>
                    </NativeSelect>
                    <div className="flex items-center space-x-2">
                        <span>Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}</span>
                        <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                            {'<<'}
                        </Button>
                        <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                            {'>>'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}