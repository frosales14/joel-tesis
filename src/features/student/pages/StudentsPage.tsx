import { useState } from "react"
import { MoreHorizontal, Plus, Search, Filter } from "lucide-react"
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

// Mock data for students
const studentsData = [
    {
        id: "1",
        nombre: "Juan Pérez",
        email: "juan.perez@email.com",
        edad: 20,
        carrera: "Ingeniería de Sistemas",
        fechaIngreso: "2023-01-15",
        estado: "Activo",
        telefono: "+57 301 234 5678",
    },
    {
        id: "2",
        nombre: "María González",
        email: "maria.gonzalez@email.com",
        edad: 19,
        carrera: "Psicología",
        fechaIngreso: "2023-02-20",
        estado: "Activo",
        telefono: "+57 302 345 6789",
    },
    {
        id: "3",
        nombre: "Carlos Rodríguez",
        email: "carlos.rodriguez@email.com",
        edad: 21,
        carrera: "Administración",
        fechaIngreso: "2023-01-10",
        estado: "Inactivo",
        telefono: "+57 303 456 7890",
    },
    {
        id: "4",
        nombre: "Ana Martínez",
        email: "ana.martinez@email.com",
        edad: 22,
        carrera: "Diseño Gráfico",
        fechaIngreso: "2023-03-05",
        estado: "Activo",
        telefono: "+57 304 567 8901",
    },
    {
        id: "5",
        nombre: "Luis Hernández",
        email: "luis.hernandez@email.com",
        edad: 20,
        carrera: "Ingeniería Civil",
        fechaIngreso: "2023-02-15",
        estado: "Activo",
        telefono: "+57 305 678 9012",
    },
]

export default function StudentsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [students] = useState(studentsData)

    const filteredStudents = students.filter(student =>
        student.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.carrera.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getStatusBadge = (estado: string) => {
        return estado === "Activo" ? (
            <Badge className="bg-muted-sage-green-100 text-muted-sage-green-700 hover:bg-muted-sage-green-200">
                Activo
            </Badge>
        ) : (
            <Badge variant="secondary" className="bg-muted-tan-100 text-muted-tan-700">
                Inactivo
            </Badge>
        )
    }

    return (
        <div className="space-y-6">
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
                <Button className="bg-gradient-to-r from-soft-blue to-soft-blue-600 hover:from-soft-blue-600 hover:to-soft-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Alumno
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-soft-blue-50 to-soft-blue-100 border-soft-blue-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-soft-blue-700">
                            Total Alumnos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-soft-blue">{students.length}</div>
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
                            {students.filter(s => s.estado === "Activo").length}
                        </div>
                        <p className="text-xs text-muted-sage-green-600">Estudiantes activos</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-warm-peach-50 to-warm-peach-100 border-warm-peach-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-warm-peach-700">
                            Nuevos este mes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-warm-peach-700">3</div>
                        <p className="text-xs text-warm-peach-600">Ingresos recientes</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-soft-coral-50 to-soft-coral-100 border-soft-coral-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-soft-coral-700">
                            Carreras
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-soft-coral">
                            {new Set(students.map(s => s.carrera)).size}
                        </div>
                        <p className="text-xs text-soft-coral-600">Programas académicos</p>
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
                                placeholder="Buscar por nombre, email o carrera..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button variant="outline" className="border-soft-blue text-soft-blue hover:bg-soft-blue hover:text-white">
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
                        Lista de Alumnos
                    </CardTitle>
                    <CardDescription>
                        {filteredStudents.length} de {students.length} estudiantes
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">Nombre</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Edad</TableHead>
                                    <TableHead>Carrera</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Fecha Ingreso</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStudents.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-8 w-8 bg-soft-blue rounded-full flex items-center justify-center">
                                                    <span className="text-white text-sm font-semibold">
                                                        {student.nombre.charAt(0)}
                                                    </span>
                                                </div>
                                                <span>{student.nombre}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{student.email}</TableCell>
                                        <TableCell>{student.edad} años</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-muted-tan-50 text-muted-tan-700">
                                                {student.carrera}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(student.estado)}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(student.fechaIngreso).toLocaleDateString('es-ES')}
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

                    {filteredStudents.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gentle-slate-gray">
                                No se encontraron alumnos que coincidan con la búsqueda.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}