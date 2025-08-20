"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft, User, DollarSign, Receipt, Loader2, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { familiaresService } from "../services/familiaresService"
import type { CreateFamiliarData, Gasto } from "../types"

// Form validation schema
const createFamiliarSchema = z.object({
    nombre_familiar: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100, "El nombre es demasiado largo"),
    edad_familiar: z.number().min(1, "La edad debe ser mayor a 0").max(120, "La edad debe ser menor a 120").optional(),
    parentesco_familiar: z.string().max(50, "El parentesco es demasiado largo").optional(),
    ingreso_familiar: z.number().min(0, "El ingreso no puede ser negativo").optional(),
    id_gasto: z.number().optional(),
})

type CreateFamiliarFormData = z.infer<typeof createFamiliarSchema>

// Common relationships for dropdown
const commonRelationships = [
    "Madre",
    "Padre",
    "Hermano/a",
    "Abuelo/a",
    "Tío/a",
    "Primo/a",
    "Tutor/a Legal",
    "Otro"
]

export default function CreateFamiliar() {
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [gastos, setGastos] = useState<Gasto[]>([])
    const [loadingGastos, setLoadingGastos] = useState(true)

    const form = useForm<CreateFamiliarFormData>({
        resolver: zodResolver(createFamiliarSchema),
        defaultValues: {
            nombre_familiar: "",
            edad_familiar: undefined,
            parentesco_familiar: "",
            ingreso_familiar: undefined,
            id_gasto: undefined,
        },
    })

    // Load gastos for selection
    useEffect(() => {
        const loadGastos = async () => {
            try {
                setLoadingGastos(true)
                const gastosData = await familiaresService.getGastos()
                setGastos(gastosData)
            } catch (err) {
                console.error("Error loading gastos:", err)
            } finally {
                setLoadingGastos(false)
            }
        }

        loadGastos()
    }, [])

    const onSubmit = async (data: CreateFamiliarFormData) => {
        try {
            setIsSubmitting(true)
            setError(null)

            const submitData: CreateFamiliarData = {
                ...data,
                // Ensure empty strings are converted to undefined for optional fields
                parentesco_familiar: data.parentesco_familiar?.trim() || undefined,
            }

            await familiaresService.createFamiliar(submitData)

            // Navigate back to familiares list with success message
            navigate('/dashboard/familiares', {
                state: {
                    message: `Familiar "${data.nombre_familiar}" creado exitosamente`,
                    type: 'success'
                }
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear el familiar')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancel = () => {
        navigate('/dashboard/familiares')
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount)
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
                        Crear Nuevo Familiar
                    </h1>
                    <p className="text-gentle-slate-gray mt-2">
                        Registra un nuevo familiar en el sistema
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
                                    Datos básicos del familiar
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Familiar Name */}
                                <FormField
                                    control={form.control}
                                    name="nombre_familiar"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre Completo *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Nombre completo del familiar"
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
                                    name="edad_familiar"
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
                                            <FormDescription>
                                                Edad del familiar (opcional)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Relationship */}
                                <FormField
                                    control={form.control}
                                    name="parentesco_familiar"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Parentesco</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-white border-muted-tan-300">
                                                        <SelectValue placeholder="Seleccionar parentesco" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {commonRelationships.map((relationship) => (
                                                        <SelectItem key={relationship} value={relationship}>
                                                            {relationship}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Relación familiar con el estudiante
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Financial Information Card */}
                        <Card className="bg-gradient-to-br from-muted-sage-green-25 to-muted-sage-green-50 border-muted-sage-green-200">
                            <CardHeader>
                                <CardTitle className="flex items-center text-muted-sage-green-700">
                                    <DollarSign className="h-5 w-5 mr-2" />
                                    Información Financiera
                                </CardTitle>
                                <CardDescription>
                                    Datos sobre ingresos y gastos
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Income */}
                                <FormField
                                    control={form.control}
                                    name="ingreso_familiar"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ingresos Mensuales</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    className="bg-white border-muted-tan-300 focus:border-muted-sage-green"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Ingresos mensuales en pesos colombianos
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Expense Category */}
                                <FormField
                                    control={form.control}
                                    name="id_gasto"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Categoría de Gastos</FormLabel>
                                            <Select
                                                onValueChange={(value) => field.onChange(parseInt(value))}
                                                defaultValue={field.value?.toString()}
                                                disabled={loadingGastos}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="bg-white border-muted-tan-300">
                                                        <SelectValue placeholder={
                                                            loadingGastos ? "Cargando gastos..." : "Seleccionar categoría de gastos"
                                                        } />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {gastos.map((gasto) => (
                                                        <SelectItem key={gasto.id_gasto} value={gasto.id_gasto.toString()}>
                                                            <div className="flex items-center justify-between w-full">
                                                                <span>{gasto.nombre_gasto}</span>
                                                                <span className="text-sm text-muted-foreground ml-2">
                                                                    {formatCurrency(gasto.cantidad_gasto)}
                                                                </span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Categoría principal de gastos del familiar (opcional)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Display selected expense details */}
                                {form.watch("id_gasto") && (
                                    <div className="mt-4 p-3 bg-warm-peach-50 rounded-lg border border-warm-peach-200">
                                        <div className="flex items-center space-x-2">
                                            <Receipt className="h-4 w-4 text-warm-peach-600" />
                                            <span className="text-sm font-medium text-warm-peach-700">
                                                Gasto seleccionado:
                                            </span>
                                        </div>
                                        {(() => {
                                            const selectedGasto = gastos.find(g => g.id_gasto === form.watch("id_gasto"))
                                            return selectedGasto ? (
                                                <div className="mt-2">
                                                    <p className="text-sm text-warm-peach-700 font-medium">
                                                        {selectedGasto.nombre_gasto}
                                                    </p>
                                                    <p className="text-xs text-warm-peach-600">
                                                        Monto: {formatCurrency(selectedGasto.cantidad_gasto)}
                                                    </p>
                                                </div>
                                            ) : null
                                        })()}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

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
                                    Crear Familiar
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
