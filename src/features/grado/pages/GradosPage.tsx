import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { MoreHorizontal, Plus, Search, Loader2, GraduationCap, Users, TrendingUp } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { gradosService } from "../services/gradosService"
import type { GradoWithAlumnos, GradoFilters, GradoStats } from "../types"

export default function GradosPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const [searchTerm, setSearchTerm] = useState("")
    const [grados, setGrados] = useState<GradoWithAlumnos[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [totalGrados, setTotalGrados] = useState(0)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [stats, setStats] = useState<GradoStats>({
        totalGrados: 0,
        gradosWithStudents: 0,
        totalStudentsInGrados: 0,
        averageStudentsPerGrado: 0,
        recentGrados: []
    })
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        grado: null as GradoWithAlumnos | null,
        isDeleting: false,
        forceDelete: false
    })

    // Load grados data
    const loadGrados = async (filters: GradoFilters = {}, page: number = 1) => {
        try {
            setLoading(true)
            setError(null)

            const response = await gradosService.getGrados(filters, page, 10)
            setGrados(response.grados)
            setTotalGrados(response.total)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error loading grados')
            console.error('Error loading grados:', err)
        } finally {
            setLoading(false)
        }
    }

    // Load dashboard stats
    const loadStats = async () => {
        try {
            const dashboardStats = await gradosService.getGradoStats()
            setStats(dashboardStats)
        } catch (err) {
            console.error('Error loading stats:', err)
        }
    }

    // Load data on component mount and handle success messages
    useEffect(() => {
        loadGrados()
        loadStats()

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
                loadGrados({ searchTerm: searchTerm.trim() })
            } else {
                loadGrados()
            }
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [searchTerm])

    const handleCreateGrado = () => {
        navigate('/dashboard/grados/crear')
    }

    const handleDeleteGrado = (grado: GradoWithAlumnos) => {
        setDeleteDialog({
            open: true,
            grado,
            isDeleting: false,
            forceDelete: false
        })
    }

    const confirmDeleteGrado = async () => {
        if (!deleteDialog.grado) return

        try {
            setDeleteDialog(prev => ({ ...prev, isDeleting: true }))

            if (deleteDialog.forceDelete) {
                await gradosService.forceDeleteGrado(deleteDialog.grado.id_grado)
                setSuccessMessage(`Grado "${deleteDialog.grado.nombre_grado}" eliminado exitosamente (estudiantes reasignados sin grado)`)
            } else {
                await gradosService.deleteGrado(deleteDialog.grado.id_grado)
                setSuccessMessage(`Grado "${deleteDialog.grado.nombre_grado}" eliminado exitosamente`)
            }

            loadGrados() // Reload the list
            loadStats() // Reload stats
            // Auto-hide success message after 5 seconds
            setTimeout(() => setSuccessMessage(null), 5000)
            // Close dialog
            setDeleteDialog({ open: false, grado: null, isDeleting: false, forceDelete: false })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al eliminar el grado')
            // Auto-hide error message after 5 seconds
            setTimeout(() => setError(null), 5000)
            setDeleteDialog(prev => ({ ...prev, isDeleting: false }))
        }
    }

    const cancelDeleteGrado = () => {
        setDeleteDialog({ open: false, grado: null, isDeleting: false, forceDelete: false })
    }

    const toggleForceDelete = () => {
        setDeleteDialog(prev => ({ ...prev, forceDelete: !prev.forceDelete }))
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

            {/* Error Message */}
            {error && (
                <Alert className="border-soft-coral-200 bg-soft-coral-50 relative">
                    <AlertDescription className="text-soft-coral-700 font-medium pr-8">
                        {error}
                    </AlertDescription>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-soft-coral-100"
                        onClick={() => setError(null)}
                    >
                        ×
                    </Button>
                </Alert>
            )}

            {/* Page Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-soft-blue">
                        Gestión de Grados
                    </h1>
                    <p className="text-gentle-slate-gray mt-2">
                        Administra los grados académicos disponibles en el sistema.
                    </p>
                </div>
                <Button
                    onClick={handleCreateGrado}
                    className="bg-gradient-to-r from-soft-blue to-soft-blue-600 hover:from-soft-blue-600 hover:to-soft-blue-700 text-neutral-off-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Grado
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-soft-blue-50 to-soft-blue-100 border-soft-blue-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-soft-blue-700 flex items-center">
                            <GraduationCap className="h-4 w-4 mr-2" />
                            Total Grados
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-soft-blue">
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.totalGrados}
                        </div>
                        <p className="text-xs text-soft-blue-600">Grados registrados</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-muted-sage-green-50 to-muted-sage-green-100 border-muted-sage-green-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-sage-green-700 flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            Con Estudiantes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-muted-sage-green">
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.gradosWithStudents}
                        </div>
                        <p className="text-xs text-muted-sage-green-600">Grados con alumnos</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-warm-peach-50 to-warm-peach-100 border-warm-peach-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-warm-peach-700 flex items-center">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Promedio Estudiantes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-warm-peach-700">
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.averageStudentsPerGrado}
                        </div>
                        <p className="text-xs text-warm-peach-600">Por grado</p>
                    </CardContent>
                </Card>

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
                                placeholder="Buscar por nombre de grado..."
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
                        Lista de Grados
                    </CardTitle>
                    <CardDescription>
                        {grados.length} de {totalGrados} grados
                        {searchTerm && ` (filtrados por "${searchTerm}")`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[300px]">Nombre del Grado</TableHead>
                                    <TableHead>Total Estudiantes</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {error && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8">
                                            <div className="text-soft-coral-600">
                                                <p className="font-medium">Error al cargar los grados</p>
                                                <p className="text-sm text-gentle-slate-gray mt-1">{error}</p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="mt-3"
                                                    onClick={() => loadGrados()}
                                                >
                                                    Reintentar
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}

                                {loading && !error && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8">
                                            <div className="flex items-center justify-center space-x-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span className="text-gentle-slate-gray">Cargando grados...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}

                                {!loading && !error && grados.map((grado) => (
                                    <TableRow key={grado.id_grado}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-8 w-8 bg-soft-blue rounded-full flex items-center justify-center">
                                                    <GraduationCap className="h-4 w-4 text-white" />
                                                </div>
                                                <span>{grado.nombre_grado}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Users className="h-4 w-4 text-gentle-slate-gray" />
                                                <span className="font-medium">
                                                    {grado.total_alumnos || 0} estudiante{grado.total_alumnos !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {grado.total_alumnos && grado.total_alumnos > 0 ? (
                                                <Badge className="bg-muted-sage-green-100 text-muted-sage-green-700 hover:bg-muted-sage-green-200">
                                                    Activo
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-muted-tan-50 text-muted-tan-700">
                                                    Sin estudiantes
                                                </Badge>
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
                                                        onClick={() => navigate(`/dashboard/grados/crear?id=${grado.id_grado}`)}
                                                    >
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-soft-coral"
                                                        onClick={() => handleDeleteGrado(grado)}
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

                    {!loading && !error && grados.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gentle-slate-gray">
                                {searchTerm
                                    ? `No se encontraron grados que coincidan con "${searchTerm}".`
                                    : "No hay grados registrados en el sistema."
                                }
                            </p>
                            {!searchTerm && (
                                <Button
                                    onClick={handleCreateGrado}
                                    variant="outline"
                                    size="sm"
                                    className="mt-3 border-soft-blue text-soft-blue hover:bg-soft-blue hover:text-neutral-off-white hover:border-soft-blue"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Agregar primer grado
                                </Button>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog.open} onOpenChange={(open) => {
                if (!open && !deleteDialog.isDeleting) {
                    cancelDeleteGrado()
                }
            }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-soft-coral">
                            <GraduationCap className="h-5 w-5" />
                            Confirmar Eliminación
                        </DialogTitle>
                        <DialogDescription className="text-gentle-slate-gray">
                            ¿Estás seguro de que quieres eliminar el grado <strong>"{deleteDialog.grado?.nombre_grado}"</strong>?
                            <br />
                            <br />
                            {deleteDialog.grado?.total_alumnos && deleteDialog.grado.total_alumnos > 0 ? (
                                <>
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 my-3">
                                        <p className="text-yellow-800 font-medium">
                                            ⚠️ Este grado tiene {deleteDialog.grado.total_alumnos} estudiante(s) asignado(s).
                                        </p>
                                    </div>
                                    <div className="flex items-start space-x-3 mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                                        <Checkbox
                                            id="force-delete"
                                            checked={deleteDialog.forceDelete}
                                            onCheckedChange={toggleForceDelete}
                                            className="mt-0.5 border-2 border-red-400 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                        />
                                        <label
                                            htmlFor="force-delete"
                                            className="text-sm text-red-800 cursor-pointer font-medium leading-relaxed"
                                        >
                                            Eliminar de todos modos (los estudiantes quedarán sin grado asignado)
                                        </label>
                                    </div>
                                </>
                            ) : (
                                <p>Esta acción no se puede deshacer.</p>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={cancelDeleteGrado}
                            disabled={deleteDialog.isDeleting}
                            className="border-muted-tan-300 text-gentle-slate-gray hover:bg-muted-tan-50"
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDeleteGrado}
                            disabled={deleteDialog.isDeleting || (deleteDialog.grado?.total_alumnos && deleteDialog.grado.total_alumnos > 0 && !deleteDialog.forceDelete)}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md disabled:bg-red-400"
                        >
                            {deleteDialog.isDeleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Eliminando...
                                </>
                            ) : (
                                <>
                                    <GraduationCap className="h-4 w-4 mr-2" />
                                    {deleteDialog.forceDelete ? 'Forzar Eliminación' : 'Eliminar'}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
