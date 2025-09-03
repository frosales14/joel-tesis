import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { MoreHorizontal, Plus, Search, Loader2, GraduationCap, Users, TrendingUp, BookOpen } from "lucide-react"
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

    const handleDeleteGrado = async (grado: GradoWithAlumnos) => {
        if (grado.total_alumnos && grado.total_alumnos > 0) {
            setError(`No se puede eliminar el grado "${grado.nombre_grado}" porque tiene ${grado.total_alumnos} estudiante(s) asignado(s)`)
            setTimeout(() => setError(null), 5000)
            return
        }

        if (window.confirm(`¿Estás seguro de que quieres eliminar el grado "${grado.nombre_grado}"?`)) {
            try {
                setLoading(true)
                await gradosService.deleteGrado(grado.id_grado)
                setSuccessMessage(`Grado "${grado.nombre_grado}" eliminado exitosamente`)
                loadGrados()
                loadStats()
                setTimeout(() => setSuccessMessage(null), 5000)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al eliminar el grado')
                setTimeout(() => setError(null), 5000)
            } finally {
                setLoading(false)
            }
        }
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

                <Card className="bg-gradient-to-br from-soft-coral-50 to-soft-coral-100 border-soft-coral-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-soft-coral-700 flex items-center">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Más Popular
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold text-soft-coral">
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> :
                                stats.mostPopularGrado ? stats.mostPopularGrado.nombre_grado : 'N/A'
                            }
                        </div>
                        <p className="text-xs text-soft-coral-600">
                            {stats.mostPopularGrado ? `${stats.mostPopularGrado.student_count} estudiantes` : 'Sin datos'}
                        </p>
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
        </div>
    )
}
