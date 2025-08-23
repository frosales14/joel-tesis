"use client"

import * as React from "react"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import type {
    ColumnDef,
    SortingState,
    VisibilityState,
    ColumnFiltersState,
} from "@tanstack/react-table"
import { ChevronDown, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Familiar } from "../types"

interface FamiliarDataTableProps {
    familiares: Familiar[]
    selectedFamiliares: Familiar[]
    onSelectionChange: (selected: Familiar[]) => void
    loading?: boolean
}

export function FamiliarDataTable({
    familiares,
    selectedFamiliares,
    onSelectionChange,
    loading = false
}: FamiliarDataTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [globalFilter, setGlobalFilter] = React.useState("")

    // Format currency helper
    const formatCurrency = (amount?: number) => {
        if (!amount) return "No especificado"
        return new Intl.NumberFormat('es-HN', {
            style: 'currency',
            currency: 'HNL',
            minimumFractionDigits: 2
        }).format(amount)
    }

    // Calculate total gastos for a familiar
    const getTotalGastos = (familiar: Familiar) => {
        if (!familiar.gastos || familiar.gastos.length === 0) return 0
        return familiar.gastos.reduce((sum, gasto) => sum + gasto.cantidad_gasto, 0)
    }

    // Define columns for the data table
    const columns: ColumnDef<Familiar>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Seleccionar todos"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Seleccionar fila"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "nombre_familiar",
            header: "Nombre",
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue("nombre_familiar")}</div>
            ),
        },
        {
            accessorKey: "edad_familiar",
            header: "Edad",
            cell: ({ row }) => {
                const edad = row.getValue("edad_familiar") as number
                return <div>{edad ? `${edad} años` : "No especificada"}</div>
            },
        },

        {
            accessorKey: "ingreso_familiar",
            header: "Ingresos",
            cell: ({ row }) => {
                const ingreso = row.getValue("ingreso_familiar") as number
                return (
                    <div className={`text-sm ${ingreso && ingreso > 0
                        ? 'text-muted-sage-green-700 font-medium'
                        : 'text-muted-tan-600'
                        }`}>
                        {formatCurrency(ingreso)}
                    </div>
                )
            },
        },
        {
            id: "gastos",
            header: "Gastos",
            cell: ({ row }) => {
                const familiar = row.original
                const totalGastos = getTotalGastos(familiar)
                const gastosCount = familiar.gastos?.length || 0

                return (
                    <div className="text-sm">
                        {gastosCount > 0 ? (
                            <div>
                                <div className="font-medium text-gentle-slate-gray">
                                    {gastosCount === 1 ? "1 gasto" : `${gastosCount} gastos`}
                                </div>
                                <div className="text-xs text-warm-peach-600">
                                    {formatCurrency(totalGastos)}
                                </div>
                            </div>
                        ) : (
                            <span className="text-muted-tan-600">Sin gastos</span>
                        )}
                    </div>
                )
            },
        },
    ]

    // Row selection state
    const rowSelection = React.useMemo(() => {
        const selection: Record<string, boolean> = {}
        selectedFamiliares.forEach(familiar => {
            const index = familiares.findIndex(f => f.id_familiar === familiar.id_familiar)
            if (index !== -1) {
                selection[index.toString()] = true
            }
        })
        return selection
    }, [selectedFamiliares, familiares])

    const table = useReactTable({
        data: familiares,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: (updater) => {
            const newSelection = typeof updater === 'function' ? updater(rowSelection) : updater
            const selected = Object.keys(newSelection)
                .filter(key => newSelection[key])
                .map(key => familiares[parseInt(key)])
                .filter(Boolean)
            onSelectionChange(selected)
        },
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
        initialState: {
            pagination: {
                pageSize: 5, // Show fewer rows since this is embedded in a form
            },
        },
    })

    return (
        <div className="w-full space-y-4">
            {/* Controls */}
            <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gentle-slate-gray h-4 w-4" />
                    <Input
                        placeholder="Buscar familiares..."
                        value={globalFilter}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="pl-10 bg-white border-muted-tan-300 focus:border-soft-blue"
                        disabled={loading}
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="border-soft-blue text-soft-blue hover:bg-soft-blue hover:text-neutral-off-white hover:border-soft-blue">
                            Columnas <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id === "nombre_familiar" ? "Nombre" :
                                            column.id === "edad_familiar" ? "Edad" :
                                                column.id === "ingreso_familiar" ? "Ingresos" :
                                                    column.id === "gastos" ? "Gastos" :
                                                        column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Selection Summary */}
            {selectedFamiliares.length > 0 && (
                <div className="flex items-center gap-2 p-3 bg-soft-blue-50 border border-soft-blue-200 rounded-lg">
                    <Badge className="bg-soft-blue text-neutral-off-white">
                        {selectedFamiliares.length} seleccionado{selectedFamiliares.length !== 1 ? 's' : ''}
                    </Badge>
                    <span className="text-sm text-soft-blue-700">
                        {selectedFamiliares.map(f => f.nombre_familiar).join(", ")}
                    </span>
                </div>
            )}

            {/* Data Table */}
            <div className="rounded-md border border-muted-tan-200 bg-white">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="bg-warm-peach-25">
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
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="animate-spin h-4 w-4 border-2 border-soft-blue border-t-transparent rounded-full"></div>
                                        <span className="text-gentle-slate-gray">Cargando familiares...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className={row.getIsSelected() ? "bg-soft-blue-25" : ""}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <div className="text-gentle-slate-gray">
                                        {globalFilter
                                            ? `No se encontraron familiares que coincidan con "${globalFilter}".`
                                            : "No hay familiares registrados en el sistema."
                                        }
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} de{" "}
                    {table.getFilteredRowModel().rows.length} familiar(es) seleccionado(s).
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Anterior
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Siguiente
                    </Button>
                </div>
            </div>
        </div>
    )
}
