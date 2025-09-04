import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { MoreHorizontal, Plus, Search, Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { familiaresService } from "../services/familiaresService"
import type { FamiliarWithGastos, FamiliarFilters } from "../types"

export default function FamiliaresPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const [searchTerm, setSearchTerm] = useState("")
    const [familiares, setFamiliares] = useState<FamiliarWithGastos[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [totalFamiliares, setTotalFamiliares] = useState(0)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        familiar: null as FamiliarWithGastos | null,
        isDeleting: false
    })


    // Load familiares data
    const loadFamiliares = async (filters: FamiliarFilters = {}, page: number = 1) => {
        try {
            setLoading(true)
            setError(null)

            const response = await familiaresService.getFamiliares(filters, page, 10)
            setFamiliares(response.familiares)
            setTotalFamiliares(response.total)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error loading familiares')
            console.error('Error loading familiares:', err)
        } finally {
            setLoading(false)
        }
    }



    // Load data on component mount and handle success messages
    useEffect(() => {
        loadFamiliares()

        // Check for success message from navigation state
        if (location.state?.message && location.state?.type === 'success') {
            setSuccessMessage(location.state.message)
            // Clear the message after showing it
            window.history.replaceState({}, document.title)
            // Auto-hide success message after 5 seconds
            setTimeout(() => setSuccessMessage(null), 5000)
        }
    }, [])

    // Handle search with debouncing
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm.trim()) {
                loadFamiliares({ searchTerm: searchTerm.trim() })
            } else {
                loadFamiliares()
            }
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [searchTerm])



    const formatCurrency = (amount?: number) => {
        if (!amount) return 'No especificado'
        return new Intl.NumberFormat('es-HN', {
            style: 'currency',
            currency: 'HNL',
            minimumFractionDigits: 2
        }).format(amount)
    }

    const handleCreateFamiliar = () => {
        navigate('/dashboard/familiares/crear')
    }

    const handleDeleteFamiliar = (familiar: FamiliarWithGastos) => {
        setDeleteDialog({
            open: true,
            familiar,
            isDeleting: false
        })
    }

    const confirmDeleteFamiliar = async () => {
        if (!deleteDialog.familiar) return

        try {
            setDeleteDialog(prev => ({ ...prev, isDeleting: true }))
            await familiaresService.deleteFamiliar(deleteDialog.familiar.id_familiar)
            setSuccessMessage(`Familiar "${deleteDialog.familiar.nombre_familiar}" eliminado exitosamente`)
            loadFamiliares() // Reload the list
            // Auto-hide success message after 5 seconds
            setTimeout(() => setSuccessMessage(null), 5000)
            // Close dialog
            setDeleteDialog({ open: false, familiar: null, isDeleting: false })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al eliminar el familiar')
            // Auto-hide error message after 5 seconds
            setTimeout(() => setError(null), 5000)
            setDeleteDialog(prev => ({ ...prev, isDeleting: false }))
        }
    }

    const cancelDeleteFamiliar = () => {
        setDeleteDialog({ open: false, familiar: null, isDeleting: false })
    }

    return (
        <div className="space-y-6">
            {/* Success Message */}
            {successMessage && (
                <Alert className="border-muted-sage-green-200 bg-muted-sage-green-50 relative">
                    <AlertDescription className="text-muted-sage-green-700 font-medium pr-8">
                        {successMessage}
                    </AlertDescription>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-muted-sage-green-100"
                        onClick={() => setSuccessMessage(null)}
                    >
                        ×
                    </Button>
                </Alert>
            )}

            {/* Page Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-soft-blue">
                        Gestión de Familiares
                    </h1>
                    <p className="text-gentle-slate-gray mt-2">
                        Administra la información de los familiares registrados en el sistema.
                    </p>
                </div>
                <Button
                    onClick={handleCreateFamiliar}
                    className="bg-gradient-to-r from-soft-blue to-soft-blue-600 hover:from-soft-blue-600 hover:to-soft-blue-700 text-neutral-off-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Familiar
                </Button>
            </div>



            {/* Filters and Search */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg text-gentle-slate-gray">
                        Buscar y Filtrar
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gentle-slate-gray h-4 w-4" />
                            <Input
                                placeholder="Buscar por nombre..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                                disabled={loading}
                            />
                            {loading && (
                                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gentle-slate-gray" />
                            )}
                        </div>

                    </div>
                </CardContent>
            </Card>

            {/* Data Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg text-gentle-slate-gray">
                        Lista de Familiares
                    </CardTitle>
                    <CardDescription>
                        {familiares.length} de {totalFamiliares} familiares
                        {searchTerm && ` (filtrados por "${searchTerm}")`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">Nombre</TableHead>
                                    <TableHead>Edad</TableHead>
                                    <TableHead>Ingresos</TableHead>
                                    <TableHead>Gastos</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {error && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">
                                            <div className="text-soft-coral-600">
                                                <p className="font-medium">Error al cargar los familiares</p>
                                                <p className="text-sm text-gentle-slate-gray mt-1">{error}</p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="mt-3"
                                                    onClick={() => loadFamiliares()}
                                                >
                                                    Reintentar
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}

                                {loading && !error && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">
                                            <div className="flex items-center justify-center space-x-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span className="text-gentle-slate-gray">Cargando familiares...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}

                                {!loading && !error && familiares.map((familiar) => (
                                    <TableRow key={familiar.id_familiar}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-8 w-8 bg-soft-blue rounded-full flex items-center justify-center">
                                                    <span className="text-white text-sm font-semibold">
                                                        {familiar.nombre_familiar.charAt(0)}
                                                    </span>
                                                </div>
                                                <span>{familiar.nombre_familiar}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {familiar.edad_familiar ? `${familiar.edad_familiar} años` : 'No especificada'}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`font-medium ${familiar.ingreso_familiar && familiar.ingreso_familiar > 0
                                                ? 'text-muted-sage-green'
                                                : 'text-muted-tan-600'
                                                }`}>
                                                {formatCurrency(familiar.ingreso_familiar)}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {familiar.gastos && familiar.gastos.length > 0 ? (
                                                <div className="text-sm">
                                                    <div className="font-medium text-gentle-slate-gray">
                                                        {familiar.gastos.length === 1
                                                            ? familiar.gastos[0].nombre_gasto
                                                            : `${familiar.gastos.length} gastos`
                                                        }
                                                    </div>
                                                    <div className="text-xs text-warm-peach-600">
                                                        {familiar.gastos.length === 1
                                                            ? formatCurrency(familiar.gastos[0].cantidad_gasto)
                                                            : `Total: ${formatCurrency(familiar.gastos.reduce((sum, g) => sum + g.cantidad_gasto, 0))}`
                                                        }
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-muted-tan-600 text-sm">Sin gastos asignados</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                    <DropdownMenuItem
                                                        onClick={() => navigate(`/dashboard/familiares/crear?id=${familiar.id_familiar}`)}
                                                    >
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-soft-coral cursor-pointer"
                                                        onClick={() => handleDeleteFamiliar(familiar)}
                                                    >
                                                        Eliminar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {!loading && !error && familiares.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gentle-slate-gray">
                                {searchTerm
                                    ? `No se encontraron familiares que coincidan con "${searchTerm}".`
                                    : "No hay familiares registrados en el sistema."
                                }
                            </p>
                            {!searchTerm && (
                                <Button
                                    onClick={handleCreateFamiliar}
                                    variant="outline"
                                    size="sm"
                                    className="mt-3 border-soft-blue text-soft-blue hover:bg-soft-blue hover:text-neutral-off-white hover:border-soft-blue"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Agregar primer familiar
                                </Button>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog.open} onOpenChange={(open) => {
                if (!open && !deleteDialog.isDeleting) {
                    cancelDeleteFamiliar()
                }
            }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-soft-coral">
                            <Trash2 className="h-5 w-5" />
                            Confirmar Eliminación
                        </DialogTitle>
                        <DialogDescription className="text-gentle-slate-gray">
                            ¿Estás seguro de que quieres eliminar al familiar <strong>"{deleteDialog.familiar?.nombre_familiar}"</strong>?
                            <br />
                            <br />
                            Esta acción eliminará:
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>Todos los gastos asociados</li>
                                <li>Todas las relaciones con estudiantes</li>
                                <li>Todos los datos del familiar</li>
                            </ul>
                            <br />
                            <strong>Esta acción no se puede deshacer.</strong>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={cancelDeleteFamiliar}
                            disabled={deleteDialog.isDeleting}
                            className="border-muted-tan-300 text-gentle-slate-gray hover:bg-muted-tan-50"
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDeleteFamiliar}
                            disabled={deleteDialog.isDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md disabled:bg-red-400"
                        >
                            {deleteDialog.isDeleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Eliminando...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Eliminar
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
