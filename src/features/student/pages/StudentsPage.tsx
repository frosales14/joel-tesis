import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { MoreHorizontal, Plus, Search, Loader2, FileText } from "lucide-react"
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
import { studentService } from "../services/studentService"
import { generateStudentReport } from "../utils/pdfGenerator"
import type { AlumnoWithFamiliar, StudentFilters } from "../types"

export default function StudentsPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const [searchTerm, setSearchTerm] = useState("")
    const [students, setStudents] = useState<AlumnoWithFamiliar[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [totalStudents, setTotalStudents] = useState(0)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [stats, setStats] = useState({
        totalStudents: 0,
        activeStudents: 0,
        recentStudents: 0,
        uniqueGrades: 0
    })

    // Load students data
    const loadStudents = async (filters: StudentFilters = {}, page: number = 1) => {
        try {
            setLoading(true)
            setError(null)

            const response = await studentService.getStudents(filters, page, 10)
            setStudents(response.students)
            setTotalStudents(response.total)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error loading students')
            console.error('Error loading students:', err)
        } finally {
            setLoading(false)
        }
    }

    // Load dashboard stats
    const loadStats = async () => {
        try {
            const dashboardStats = await studentService.getStudentStats()
            setStats(dashboardStats)
        } catch (err) {
            console.error('Error loading stats:', err)
        }
    }

    // Load data on component mount and handle success messages
    useEffect(() => {
        loadStudents()
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
                loadStudents({ searchTerm: searchTerm.trim() })
            } else {
                loadStudents()
            }
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [searchTerm])

    const getStatusBadge = (situacion_actual?: string) => {
        if (!situacion_actual) {
            return (
                <Badge variant="secondary" className="bg-muted-tan-100 text-muted-tan-700">
                    Sin información
                </Badge>
            )
        }

        const status = situacion_actual.toLowerCase()
        if (status.includes('activo') || status.includes('estudiando')) {
            return (
                <Badge className="bg-muted-sage-green-100 text-muted-sage-green-700 hover:bg-muted-sage-green-200">
                    {situacion_actual}
                </Badge>
            )
        } else if (status.includes('inactivo') || status.includes('retirado')) {
            return (
                <Badge variant="destructive" className="bg-soft-coral-100 text-soft-coral-700">
                    {situacion_actual}
                </Badge>
            )
        } else {
            return (
                <Badge variant="outline" className="bg-warm-peach-50 text-warm-peach-700">
                    {situacion_actual}
                </Badge>
            )
        }
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'No especificada'
        return new Date(dateString).toLocaleDateString('es-ES')
    }

    const getGradeText = (student: AlumnoWithFamiliar) => {
        // @ts-ignore - Supabase returns grado as joined object
        if (student.grado?.nombre_grado) {
            // @ts-ignore
            return student.grado.nombre_grado
        }
        return 'No especificado'
    }

    const handleCreateStudent = () => {
        navigate('/dashboard/alumnos/crear')
    }

    const handleGenerateReport = async (student: AlumnoWithFamiliar) => {
        try {
            setLoading(true)
            await generateStudentReport(student)
            setSuccessMessage(`Reporte de ${student.nombre_alumno} generado exitosamente`)
            // Auto-hide success message after 5 seconds
            setTimeout(() => setSuccessMessage(null), 5000)
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error al generar el reporte')
            // Auto-hide error message after 5 seconds
            setTimeout(() => setError(null), 5000)
        } finally {
            setLoading(false)
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

            {/* Page Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-soft-blue">
                        Gestión de Alumnos
                    </h1>
                    <p className="text-gentle-slate-gray mt-2">
                        Administra la información de los estudiantes registrados en el sistema.
                    </p>
                </div>
                <Button
                    onClick={handleCreateStudent}
                    className="bg-gradient-to-r from-soft-blue to-soft-blue-600 hover:from-soft-blue-600 hover:to-soft-blue-700 text-neutral-off-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Alumno
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-soft-blue-50 to-soft-blue-100 border-soft-blue-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-soft-blue-700">
                            Total Alumnos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-soft-blue">
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.totalStudents}
                        </div>
                        <p className="text-xs text-soft-blue-600">Estudiantes registrados</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-muted-sage-green-50 to-muted-sage-green-100 border-muted-sage-green-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-sage-green-700">
                            Activos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-muted-sage-green">
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.activeStudents}
                        </div>
                        <p className="text-xs text-muted-sage-green-600">Estudiantes activos</p>
                    </CardContent>
                </Card>


                <Card className="bg-gradient-to-br from-soft-coral-50 to-soft-coral-100 border-soft-coral-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-soft-coral-700">
                            Grados
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-soft-coral">
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.uniqueGrades}
                        </div>
                        <p className="text-xs text-soft-coral-600">Niveles académicos</p>
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
                                placeholder="Buscar por nombre o situación actual..."
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
                        Lista de Alumnos
                    </CardTitle>
                    <CardDescription>
                        {students.length} de {totalStudents} estudiantes
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
                                    <TableHead>Grado</TableHead>
                                    <TableHead>Situación Actual</TableHead>
                                    <TableHead>Fecha Ingreso</TableHead>
                                    <TableHead>Familiares</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {error && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8">
                                            <div className="text-soft-coral-600">
                                                <p className="font-medium">Error al cargar los estudiantes</p>
                                                <p className="text-sm text-gentle-slate-gray mt-1">{error}</p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="mt-3"
                                                    onClick={() => loadStudents()}
                                                >
                                                    Reintentar
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}

                                {loading && !error && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8">
                                            <div className="flex items-center justify-center space-x-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span className="text-gentle-slate-gray">Cargando estudiantes...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}

                                {!loading && !error && students.map((student) => (
                                    <TableRow key={student.id_alumno}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-8 w-8 bg-soft-blue rounded-full flex items-center justify-center">
                                                    <span className="text-white text-sm font-semibold">
                                                        {student.nombre_alumno.charAt(0)}
                                                    </span>
                                                </div>
                                                <span>{student.nombre_alumno}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {student.edad_alumno ? `${student.edad_alumno} años` : 'No especificada'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-muted-tan-50 text-muted-tan-700">
                                                {getGradeText(student)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(student.situacion_actual)}
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(student.fecha_ingreso)}
                                        </TableCell>
                                        <TableCell>
                                            {student.familiares && student.familiares.length > 0 ? (
                                                <div className="text-sm">
                                                    {student.familiares.length}

                                                </div>
                                            ) : (
                                                <span className="text-muted-tan-600 text-sm">Sin familiares asignados</span>
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
                                                        onClick={() => handleGenerateReport(student)}
                                                        className="cursor-pointer"
                                                    >
                                                        <FileText className="h-4 w-4 mr-2" />
                                                        Generar Reporte
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => navigate(`/dashboard/alumnos/crear?id=${student.id_alumno}`)}
                                                    >
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-soft-coral">
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

                    {!loading && !error && students.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gentle-slate-gray">
                                {searchTerm
                                    ? `No se encontraron alumnos que coincidan con "${searchTerm}".`
                                    : "No hay estudiantes registrados en el sistema."
                                }
                            </p>
                            {!searchTerm && (
                                <Button
                                    onClick={handleCreateStudent}
                                    variant="outline"
                                    size="sm"
                                    className="mt-3 border-soft-blue text-soft-blue hover:bg-soft-blue hover:text-neutral-off-white hover:border-soft-blue"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Agregar primer estudiante
                                </Button>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}