"use client"

import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, ArrowLeft, User, Users, Calendar as CalendarIconSolid, FileText, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { studentService } from "../services/studentService"
import type { CreateAlumnoData } from "../types"
import { FamiliarDataTable, type Familiar } from "../../familiares"
import { cn } from "@/lib/utils"

// Extended Familiar interface for student creation form - includes parentesco for UI purposes
interface FamiliarWithParentesco extends Familiar {
    parentesco_familiar?: string; // For display and selection in student creation
}

// Form validation schema
const createStudentSchema = z.object({
    nombre_alumno: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100, "El nombre es demasiado largo"),
    edad_alumno: z.number().min(1, "La edad debe ser mayor a 0").max(100, "La edad debe ser menor a 100").optional(),
    fecha_nacimiento: z.date().optional(),
    id_grado: z.number().min(1, "Debe seleccionar un grado").optional(),
    fecha_ingreso: z.date().optional(),
    motivo_ingreso: z.string().max(500, "El motivo es demasiado largo").optional(),
    situacion_familiar: z.string().max(500, "La descripción es demasiado larga").optional(),
    situacion_actual: z.string().max(500, "La situación actual es demasiado larga").optional(),
})

type CreateStudentFormData = z.infer<typeof createStudentSchema>

export default function CreateStudent() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const studentId = searchParams.get('id')
    const isEditMode = !!studentId

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [familiares, setFamiliares] = useState<FamiliarWithParentesco[]>([])
    const [selectedFamiliares, setSelectedFamiliares] = useState<FamiliarWithParentesco[]>([])
    const [grados, setGrados] = useState<{ id_grado: number, nombre_grado: string }[]>([])
    const [loadingFamiliares, setLoadingFamiliares] = useState(true)
    const [loadingGrados, setLoadingGrados] = useState(true)
    const [loadingStudent, setLoadingStudent] = useState(isEditMode)

    const form = useForm<CreateStudentFormData>({
        resolver: zodResolver(createStudentSchema),
        defaultValues: {
            nombre_alumno: "",
            edad_alumno: undefined,
            fecha_nacimiento: undefined,
            id_grado: undefined,
            fecha_ingreso: new Date(),
            motivo_ingreso: "",
            situacion_familiar: "",
            situacion_actual: "",
        },
    })

    // Load student data when in edit mode
    const loadStudentData = async () => {
        if (!studentId) return

        try {
            setLoadingStudent(true)
            setError(null)

            const student = await studentService.getStudentById(parseInt(studentId))
            if (!student) {
                setError('Estudiante no encontrado')
                return
            }

            // Pre-fill the form with existing data
            form.reset({
                nombre_alumno: student.nombre_alumno,
                edad_alumno: student.edad_alumno,
                fecha_nacimiento: student.fecha_nacimiento ? new Date(student.fecha_nacimiento) : undefined,
                id_grado: student.id_grado,
                fecha_ingreso: student.fecha_ingreso ? new Date(student.fecha_ingreso) : undefined,
                motivo_ingreso: student.motivo_ingreso || "",
                situacion_familiar: student.situacion_familiar || "",
                situacion_actual: student.situacion_actual || "",
            })

            // Set selected familiares (from alumnoxfamiliar relationships)
            if (student.familiares && student.familiares.length > 0) {
                // Convert AlumnoXFamiliar relationships to Familiar objects with parentesco
                const familiaresWithParentesco = student.familiares
                    .filter(rel => rel.familiar) // Only include relationships with valid familiar data
                    .map(rel => ({
                        ...rel.familiar!,
                        parentesco_familiar: rel.parentesco_familiar || 'No especificado'
                    }));
                setSelectedFamiliares(familiaresWithParentesco)
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar el estudiante')
        } finally {
            setLoadingStudent(false)
        }
    }

    // Load family members for selection
    const loadFamiliares = async () => {
        try {
            setLoadingFamiliares(true)
            const familiaresData = await studentService.getAllFamiliares()
            // Convert to FamiliarWithParentesco - initialize with empty parentesco for new selections
            const familiaresWithParentesco: FamiliarWithParentesco[] = familiaresData.map(familiar => ({
                ...familiar,
                parentesco_familiar: 'No especificado' // Default for new selections
            }))
            setFamiliares(familiaresWithParentesco)
        } catch (err) {
            console.error("Error loading familiares:", err)
            setError("Error al cargar la lista de familiares")
        } finally {
            setLoadingFamiliares(false)
        }
    }

    // Load grados for selection
    const loadGrados = async () => {
        try {
            setLoadingGrados(true)
            const gradosData = await studentService.getAllGrados()
            setGrados(gradosData)
        } catch (err) {
            console.error("Error loading grados:", err)
            setError("Error al cargar la lista de grados")
        } finally {
            setLoadingGrados(false)
        }
    }

    // Load data on component mount
    useEffect(() => {
        if (isEditMode) {
            loadStudentData()
        }
        loadFamiliares()
        loadGrados()
    }, [studentId, isEditMode])

    const onSubmit = async (data: CreateStudentFormData) => {
        try {
            setIsSubmitting(true)
            setError(null)

            // Validate that at least one familiar is selected
            if (selectedFamiliares.length === 0) {
                setError("Debe seleccionar al menos un familiar responsable")
                return
            }

            // Validate that all selected familiares have a specified parentesco
            const familiaresWithoutParentesco = selectedFamiliares.filter(f => !f.parentesco_familiar || f.parentesco_familiar === 'No especificado')
            if (familiaresWithoutParentesco.length > 0) {
                setError(`Debe especificar el parentesco para: ${familiaresWithoutParentesco.map(f => f.nombre_familiar).join(', ')}`)
                return
            }

            // Convert dates to ISO strings for Supabase
            const submitData: CreateAlumnoData = {
                ...data,
                fecha_nacimiento: data.fecha_nacimiento?.toISOString().split('T')[0],
                fecha_ingreso: data.fecha_ingreso?.toISOString().split('T')[0],
                // Pass all selected familiares with their parentesco info for the many-to-many relationship
                familiares_data: selectedFamiliares.map(f => ({
                    id_familiar: f.id_familiar,
                    parentesco_familiar: f.parentesco_familiar || 'No especificado'
                })),
            }

            if (isEditMode && studentId) {
                // Update existing student
                await studentService.updateStudent({
                    id_alumno: parseInt(studentId),
                    ...submitData
                })
            } else {
                // Create new student
                await studentService.createStudent(submitData)
            }

            // Navigate back to students list with success message
            navigate('/dashboard/alumnos', {
                state: {
                    message: `Estudiante "${data.nombre_alumno}" ${isEditMode ? 'actualizado' : 'creado'} exitosamente con ${selectedFamiliares.length} familiar(es) asociado(s)`,
                    type: 'success'
                }
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : `Error al ${isEditMode ? 'actualizar' : 'crear'} el estudiante`)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancel = () => {
        navigate('/dashboard/alumnos')
    }

    // Show loading while loading student data in edit mode
    if (loadingStudent) {
        return (
            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        className="border-muted-tan-300 hover:bg-muted-tan-50"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-soft-blue to-soft-blue-600 bg-clip-text text-transparent">
                            Cargando Estudiante...
                        </h1>
                        <p className="text-gentle-slate-gray mt-2">
                            Obteniendo información del estudiante
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-center py-12">
                    <div className="flex items-center space-x-3">
                        <Loader2 className="h-8 w-8 animate-spin text-soft-blue" />
                        <span className="text-gentle-slate-gray">Cargando datos del estudiante...</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    className="border-muted-tan-300 hover:bg-muted-tan-50"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                </Button>
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-soft-blue to-soft-blue-600 bg-clip-text text-transparent">
                        {isEditMode ? 'Editar Estudiante' : 'Crear Nuevo Estudiante'}
                    </h1>
                    <p className="text-gentle-slate-gray mt-2">
                        {isEditMode
                            ? 'Actualiza la información del estudiante en el sistema'
                            : 'Registra un nuevo estudiante en el sistema'
                        }
                    </p>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <Alert variant="destructive" className="border-soft-coral bg-soft-coral-50">
                    <AlertDescription className="text-soft-coral-700">{error}</AlertDescription>
                </Alert>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Personal Information Card */}
                        <Card className="bg-gradient-to-br from-soft-blue-25 to-soft-blue-50 border-soft-blue-200">
                            <CardHeader>
                                <CardTitle className="flex items-center text-soft-blue">
                                    <User className="h-5 w-5 mr-2" />
                                    Información Personal
                                </CardTitle>
                                <CardDescription>
                                    Datos básicos del estudiante
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Student Name */}
                                <FormField
                                    control={form.control}
                                    name="nombre_alumno"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre Completo *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Nombre completo del estudiante"
                                                    className="bg-white border-muted-tan-300 focus:border-soft-blue"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Age */}
                                <FormField
                                    control={form.control}
                                    name="edad_alumno"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Edad</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Edad en años"
                                                    className="bg-white border-muted-tan-300 focus:border-soft-blue"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Birth Date */}
                                <FormField
                                    control={form.control}
                                    name="fecha_nacimiento"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Fecha de Nacimiento</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal bg-white border-muted-tan-300",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP", { locale: es })
                                                            ) : (
                                                                <span>Seleccionar fecha</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date > new Date() || date < new Date("1900-01-01")
                                                        }
                                                        captionLayout="dropdown"
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Grade */}
                                <FormField
                                    control={form.control}
                                    name="id_grado"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Grado Académico</FormLabel>
                                            <Select
                                                onValueChange={(value) => field.onChange(parseInt(value))}
                                                defaultValue={field.value?.toString()}
                                                disabled={loadingGrados}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="bg-white border-muted-tan-300">
                                                        <SelectValue placeholder={loadingGrados ? "Cargando grados..." : "Seleccionar grado"} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {grados.map((grado) => (
                                                        <SelectItem key={grado.id_grado} value={grado.id_grado.toString()}>
                                                            {grado.nombre_grado}
                                                        </SelectItem>
                                                    ))}
                                                    {grados.length === 0 && !loadingGrados && (
                                                        <SelectItem value="" disabled>
                                                            No hay grados disponibles
                                                        </SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                {loadingGrados ? "Cargando grados disponibles..." : "Selecciona el grado académico del estudiante"}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Academic Information Card */}
                        <Card className="bg-gradient-to-br from-warm-peach-25 to-warm-peach-50 border-warm-peach-200">
                            <CardHeader>
                                <CardTitle className="flex items-center text-warm-peach-700">
                                    <CalendarIconSolid className="h-5 w-5 mr-2" />
                                    Información Académica
                                </CardTitle>
                                <CardDescription>
                                    Datos sobre el ingreso y situación actual
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Entry Date */}
                                <FormField
                                    control={form.control}
                                    name="fecha_ingreso"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Fecha de Ingreso</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal bg-white border-muted-tan-300",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP", { locale: es })
                                                            ) : (
                                                                <span>Seleccionar fecha</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) => date > new Date()}
                                                        captionLayout="dropdown"
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormDescription>
                                                Fecha en que el estudiante ingresó al programa
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Current Status */}
                                <FormField
                                    control={form.control}
                                    name="situacion_actual"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Situación Actual</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Describe la situación actual del estudiante (Ej: Activo, Estudiando, En pausa, Graduado, Retirado, etc.)..."
                                                    className="bg-white border-muted-tan-300 focus:border-muted-sage-green min-h-[80px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Opcional: Estado actual del estudiante en el programa
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Family Members Selection */}
                                <div className="space-y-3">
                                    <Label className="text-base font-medium text-gentle-slate-gray">
                                        Familiares Responsables *
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Selecciona uno o más familiares responsables del estudiante. Puedes buscar y filtrar la lista.
                                    </p>

                                    <FamiliarDataTable
                                        familiares={familiares as Familiar[]}
                                        selectedFamiliares={selectedFamiliares as Familiar[]}
                                        onSelectionChange={(selected) => setSelectedFamiliares(selected as FamiliarWithParentesco[])}
                                        loading={loadingFamiliares}
                                    />

                                    {selectedFamiliares.length === 0 && error && error.includes("familiar") && (
                                        <p className="text-sm text-red-600 mt-2">
                                            ⚠️ Debe seleccionar al menos un familiar responsable
                                        </p>
                                    )}

                                    {/* Parentesco specification for selected familiares */}
                                    {selectedFamiliares.length > 0 && (
                                        <div className="space-y-3 mt-4">
                                            <Label className="text-sm font-medium text-gentle-slate-gray">
                                                Especificar Parentesco
                                            </Label>
                                            <p className="text-sm text-muted-foreground">
                                                Define la relación de cada familiar con el estudiante.
                                            </p>
                                            <div className="space-y-3">
                                                {selectedFamiliares.map((familiar, index) => (
                                                    <div key={familiar.id_familiar} className="flex items-center gap-3 p-3 bg-white border border-muted-tan-200 rounded-lg">
                                                        <div className="flex-1">
                                                            <div className="font-medium text-gentle-slate-gray">
                                                                {familiar.nombre_familiar}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {familiar.edad_familiar ? `${familiar.edad_familiar} años` : 'Edad no especificada'}
                                                            </div>
                                                        </div>
                                                        <div className="w-48">
                                                            <Select
                                                                value={familiar.parentesco_familiar || ''}
                                                                onValueChange={(value) => {
                                                                    const updated = [...selectedFamiliares]
                                                                    updated[index] = { ...familiar, parentesco_familiar: value }
                                                                    setSelectedFamiliares(updated)
                                                                }}
                                                            >
                                                                <SelectTrigger className="bg-white border-muted-tan-300">
                                                                    <SelectValue placeholder="Seleccionar parentesco" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="Madre">Madre</SelectItem>
                                                                    <SelectItem value="Padre">Padre</SelectItem>
                                                                    <SelectItem value="Hermano/a">Hermano/a</SelectItem>
                                                                    <SelectItem value="Abuelo/a">Abuelo/a</SelectItem>
                                                                    <SelectItem value="Tío/a">Tío/a</SelectItem>
                                                                    <SelectItem value="Primo/a">Primo/a</SelectItem>
                                                                    <SelectItem value="Tutor/a Legal">Tutor/a Legal</SelectItem>
                                                                    <SelectItem value="Otro">Otro</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Additional Information Card */}
                    <Card className="bg-gradient-to-br from-muted-sage-green-25 to-muted-sage-green-50 border-muted-sage-green-200">
                        <CardHeader>
                            <CardTitle className="flex items-center text-muted-sage-green-700">
                                <FileText className="h-5 w-5 mr-2" />
                                Información Adicional
                            </CardTitle>
                            <CardDescription>
                                Detalles sobre el contexto del estudiante
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Entry Reason */}
                            <FormField
                                control={form.control}
                                name="motivo_ingreso"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Motivo de Ingreso</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe las razones por las que el estudiante ingresó al programa..."
                                                className="bg-white border-muted-tan-300 focus:border-muted-sage-green min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Opcional: Explica las circunstancias que llevaron al ingreso
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Family Situation */}
                            <FormField
                                control={form.control}
                                name="situacion_familiar"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Situación Familiar</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe la situación familiar del estudiante..."
                                                className="bg-white border-muted-tan-300 focus:border-muted-sage-green min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Opcional: Información sobre el contexto familiar
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className="border-muted-tan-300 hover:bg-muted-tan-50"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-soft-blue to-soft-blue-600 hover:from-soft-blue-600 hover:to-soft-blue-700 text-neutral-off-white shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    {isEditMode ? 'Actualizando...' : 'Creando...'}
                                </>
                            ) : (
                                <>
                                    <Users className="h-4 w-4 mr-2" />
                                    {isEditMode ? 'Actualizar Estudiante' : 'Crear Estudiante'}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
