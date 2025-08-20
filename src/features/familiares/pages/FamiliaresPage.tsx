import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { MoreHorizontal, Plus, Search, Filter, Loader2, Users, DollarSign, Receipt, TrendingUp } from "lucide-react"
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
import { familiaresService } from "../services/familiaresService"
import type { FamiliarWithGastos, FamiliarFilters, FamiliarStats } from "../types"

export default function FamiliaresPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const [searchTerm, setSearchTerm] = useState("")
    const [familiares, setFamiliares] = useState<FamiliarWithGastos[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [totalFamiliares, setTotalFamiliares] = useState(0)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [stats, setStats] = useState<FamiliarStats>({
        totalFamiliares: 0,
        withIncome: 0,
        withExpenses: 0,
        averageIncome: 0,
        uniqueRelationships: 0,
        recentFamiliares: []
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

    // Load dashboard stats
    const loadStats = async () => {
        try {
            const dashboardStats = await familiaresService.getFamiliarStats()
            setStats(dashboardStats)
        } catch (err) {
            console.error('Error loading stats:', err)
        }
    }

    // Load data on component mount and handle success messages
    useEffect(() => {
        loadFamiliares()
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
                loadFamiliares({ searchTerm: searchTerm.trim() })
            } else {
                loadFamiliares()
            }
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [searchTerm])

    const getRelationshipBadge = (parentesco?: string) => {
        if (!parentesco) {
            return (
                <Badge variant="secondary" className="bg-muted-tan-100 text-muted-tan-700">
                    Sin especificar
                </Badge>
            )
        }

        const relationship = parentesco.toLowerCase()
        if (relationship.includes('madre') || relationship.includes('mamá')) {
            return (
                <Badge className="bg-soft-coral-100 text-soft-coral-700 hover:bg-soft-coral-200">
                    {parentesco}
                </Badge>
            )
        } else if (relationship.includes('padre') || relationship.includes('papá')) {
            return (
                <Badge className="bg-soft-blue-100 text-soft-blue-700 hover:bg-soft-blue-200">
                    {parentesco}
                </Badge>
            )
        } else if (relationship.includes('abuel') || relationship.includes('tí') || relationship.includes('herman')) {
            return (
                <Badge className="bg-warm-peach-100 text-warm-peach-700 hover:bg-warm-peach-200">
                    {parentesco}
                </Badge>
            )
        } else {
            return (
                <Badge variant="outline" className="bg-muted-sage-green-50 text-muted-sage-green-700">
                    {parentesco}
                </Badge>
            )
        }
    }

    const formatCurrency = (amount?: number) => {
        if (!amount) return 'No especificado'
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount)
    }

    const handleCreateFamiliar = () => {
        navigate('/dashboard/familiares/crear')
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
                    className="bg-gradient-to-r from-soft-blue to-soft-blue-600 hover:from-soft-blue-600 hover:to-soft-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Familiar
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-soft-blue-50 to-soft-blue-100 border-soft-blue-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-soft-blue-700 flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            Total Familiares
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-soft-blue">
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.totalFamiliares}
                        </div>
                        <p className="text-xs text-soft-blue-600">Familiares registrados</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-muted-sage-green-50 to-muted-sage-green-100 border-muted-sage-green-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-sage-green-700 flex items-center">
                            <DollarSign className="h-4 w-4 mr-2" />
                            Con Ingresos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-muted-sage-green">
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.withIncome}
                        </div>
                        <p className="text-xs text-muted-sage-green-600">Familiares con ingresos</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-warm-peach-50 to-warm-peach-100 border-warm-peach-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-warm-peach-700 flex items-center">
                            <Receipt className="h-4 w-4 mr-2" />
                            Con Gastos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-warm-peach-700">
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.withExpenses}
                        </div>
                        <p className="text-xs text-warm-peach-600">Con gastos asignados</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-soft-coral-50 to-soft-coral-100 border-soft-coral-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-soft-coral-700 flex items-center">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Ingreso Promedio
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold text-soft-coral">
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> :
                                stats.averageIncome > 0 ? formatCurrency(stats.averageIncome) : 'N/A'
                            }
                        </div>
                        <p className="text-xs text-soft-coral-600">Ingreso promedio mensual</p>
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
                                placeholder="Buscar por nombre o parentesco..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                                disabled={loading}
                            />
                            {loading && (
                                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gentle-slate-gray" />
                            )}
                        </div>
                        <Button
                            variant="outline"
                            className="border-soft-blue text-soft-blue hover:bg-soft-blue hover:text-white"
                            disabled={loading}
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            Filtros
                        </Button>
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
                                    <TableHead>Parentesco</TableHead>
                                    <TableHead>Ingresos</TableHead>
                                    <TableHead>Gastos</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {error && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
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
                                        <TableCell colSpan={6} className="text-center py-8">
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
                                            {getRelationshipBadge(familiar.parentesco_familiar)}
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
                                                    <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                                                    <DropdownMenuItem>Editar</DropdownMenuItem>
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
                                    className="mt-3 border-soft-blue text-soft-blue hover:bg-soft-blue hover:text-white"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Agregar primer familiar
                                </Button>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
