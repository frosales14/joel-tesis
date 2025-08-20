"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
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
import type { CreateAlumnoData, Familiar } from "../types"
import { cn } from "@/lib/utils"

// Form validation schema
const createStudentSchema = z.object({
    nombre_alumno: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100, "El nombre es demasiado largo"),
    edad_alumno: z.number().min(1, "La edad debe ser mayor a 0").max(100, "La edad debe ser menor a 100").optional(),
    fecha_nacimiento: z.date().optional(),
    grado_alumno: z.number().min(1, "El grado debe ser mayor a 0").max(15, "El grado debe ser menor a 15").optional(),
    fecha_ingreso: z.date().optional(),
    motivo_ingreso: z.string().max(500, "El motivo es demasiado largo").optional(),
    situacion_familiar: z.string().max(500, "La descripción es demasiado larga").optional(),
    situacion_actual: z.string().max(100, "La situación actual es demasiado larga").optional(),
    id_familiar: z.number().optional(),
})

type CreateStudentFormData = z.infer<typeof createStudentSchema>

export default function CreateStudent() {
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [familiares, setFamiliares] = useState<Familiar[]>([])
    const [loadingFamiliares, setLoadingFamiliares] = useState(true)

    const form = useForm<CreateStudentFormData>({
        resolver: zodResolver(createStudentSchema),
        defaultValues: {
            nombre_alumno: "",
            edad_alumno: undefined,
            fecha_nacimiento: undefined,
            grado_alumno: undefined,
            fecha_ingreso: new Date(),
            motivo_ingreso: "",
            situacion_familiar: "",
            situacion_actual: "Activo",
            id_familiar: undefined,
        },
    })

    // Load family members for selection
    useEffect(() => {
        const loadFamiliares = async () => {
            try {
                setLoadingFamiliares(true)
                const familiaresData = await studentService.getFamiliares()
                setFamiliares(familiaresData)
            } catch (err) {
                console.error("Error loading familiares:", err)
            } finally {
                setLoadingFamiliares(false)
            }
        }

        loadFamiliares()
    }, [])

    const onSubmit = async (data: CreateStudentFormData) => {
        try {
            setIsSubmitting(true)
            setError(null)

            // Convert dates to ISO strings for Supabase
            const submitData: CreateAlumnoData = {
                ...data,
                fecha_nacimiento: data.fecha_nacimiento?.toISOString().split('T')[0],
                fecha_ingreso: data.fecha_ingreso?.toISOString().split('T')[0],
            }

            await studentService.createStudent(submitData)

            // Navigate back to students list with success message
            navigate('/dashboard/alumnos', {
                state: {
                    message: `Estudiante "${data.nombre_alumno}" creado exitosamente`,
                    type: 'success'
                }
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear el estudiante')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancel = () => {
        navigate('/dashboard/alumnos')
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
                        Crear Nuevo Estudiante
                    </h1>
                    <p className="text-gentle-slate-gray mt-2">
                        Registra un nuevo estudiante en el sistema
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
                                    name="grado_alumno"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Grado Académico</FormLabel>
                                            <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-white border-muted-tan-300">
                                                        <SelectValue placeholder="Seleccionar grado" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="1">1° Primaria</SelectItem>
                                                    <SelectItem value="2">2° Primaria</SelectItem>
                                                    <SelectItem value="3">3° Primaria</SelectItem>
                                                    <SelectItem value="4">4° Primaria</SelectItem>
                                                    <SelectItem value="5">5° Primaria</SelectItem>
                                                    <SelectItem value="6">6° Bachillerato</SelectItem>
                                                    <SelectItem value="7">7° Bachillerato</SelectItem>
                                                    <SelectItem value="8">8° Bachillerato</SelectItem>
                                                    <SelectItem value="9">9° Bachillerato</SelectItem>
                                                    <SelectItem value="10">10° Bachillerato</SelectItem>
                                                    <SelectItem value="11">11° Bachillerato</SelectItem>
                                                </SelectContent>
                                            </Select>
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
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-white border-muted-tan-300">
                                                        <SelectValue placeholder="Seleccionar situación" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Activo">Activo</SelectItem>
                                                    <SelectItem value="Estudiando">Estudiando</SelectItem>
                                                    <SelectItem value="En pausa">En pausa</SelectItem>
                                                    <SelectItem value="Graduado">Graduado</SelectItem>
                                                    <SelectItem value="Retirado">Retirado</SelectItem>
                                                    <SelectItem value="Transferido">Transferido</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Family Member */}
                                <FormField
                                    control={form.control}
                                    name="id_familiar"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Familiar Responsable</FormLabel>
                                            <Select
                                                onValueChange={(value) => field.onChange(parseInt(value))}
                                                defaultValue={field.value?.toString()}
                                                disabled={loadingFamiliares}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="bg-white border-muted-tan-300">
                                                        <SelectValue placeholder={
                                                            loadingFamiliares ? "Cargando familiares..." : "Seleccionar familiar"
                                                        } />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {familiares.map((familiar) => (
                                                        <SelectItem key={familiar.id_familiar} value={familiar.id_familiar.toString()}>
                                                            {familiar.nombre_familiar}
                                                            {familiar.parentesco_familiar && ` (${familiar.parentesco_familiar})`}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Familiar principal responsable del estudiante
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
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
                            className="bg-gradient-to-r from-soft-blue to-soft-blue-600 hover:from-soft-blue-600 hover:to-soft-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creando...
                                </>
                            ) : (
                                <>
                                    <Users className="h-4 w-4 mr-2" />
                                    Crear Estudiante
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
