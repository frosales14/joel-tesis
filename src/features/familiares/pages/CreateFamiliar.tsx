"use client"

import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft, User, DollarSign, Receipt, Loader2, Users, Plus, Trash2, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { familiaresService } from "../services/familiaresService"
import type { CreateFamiliarData, Gasto } from "../types"

// Form validation schema - Basic info only for step 1
const createFamiliarSchema = z.object({
    nombre_familiar: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100, "El nombre es demasiado largo"),
    edad_familiar: z.number().min(1, "La edad debe ser mayor a 0").max(120, "La edad debe ser menor a 120").optional(),
    parentesco_familiar: z.string().max(50, "El parentesco es demasiado largo").optional(),
})

// Schema for creating new gastos
const createGastoSchema = z.object({
    nombre_gasto: z.string().min(2, "El nombre del gasto debe tener al menos 2 caracteres").max(100, "El nombre es demasiado largo"),
    cantidad_gasto: z.number().min(0, "La cantidad no puede ser negativa"),
})

type CreateFamiliarFormData = z.infer<typeof createFamiliarSchema>
type CreateGastoFormData = z.infer<typeof createGastoSchema>

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
    const [searchParams] = useSearchParams()
    const familiarId = searchParams.get('id')
    const isEditMode = !!familiarId

    // Step 1: Basic familiar creation/editing
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [createdFamiliar, setCreatedFamiliar] = useState<any>(null)
    const [step, setStep] = useState<'basic' | 'financial'>(isEditMode ? 'financial' : 'basic')
    const [isLoading, setIsLoading] = useState(isEditMode)

    // Step 2: Financial management
    const [familiarGastos, setFamiliarGastos] = useState<Gasto[]>([])
    const [loadingGastos, setLoadingGastos] = useState(false)
    const [ingreso_familiar, setIngresoFamiliar] = useState<number | undefined>(undefined)
    const [isUpdatingFinancial, setIsUpdatingFinancial] = useState(false)

    // Forms
    const familiarForm = useForm<CreateFamiliarFormData>({
        resolver: zodResolver(createFamiliarSchema),
        defaultValues: {
            nombre_familiar: "",
            edad_familiar: undefined,
            parentesco_familiar: "",
        },
    })

    const gastoForm = useForm<CreateGastoFormData>({
        resolver: zodResolver(createGastoSchema),
        defaultValues: {
            nombre_gasto: "",
            cantidad_gasto: 0,
        },
    })

    // Load existing familiar data when in edit mode
    const loadFamiliarData = async () => {
        if (!familiarId) return

        try {
            setIsLoading(true)
            setError(null)

            const familiar = await familiaresService.getFamiliarById(parseInt(familiarId))
            if (!familiar) {
                setError('Familiar no encontrado')
                return
            }

            // Set the familiar data
            setCreatedFamiliar(familiar)

            // Pre-fill the form with existing data
            familiarForm.reset({
                nombre_familiar: familiar.nombre_familiar,
                edad_familiar: familiar.edad_familiar,
                parentesco_familiar: familiar.parentesco_familiar,
            })

            // Set income
            setIngresoFamiliar(familiar.ingreso_familiar)

            // Set gastos for this familiar
            if (familiar.gastos) {
                setFamiliarGastos(familiar.gastos)
            }

            // Load all gastos for reference
            await loadAllGastos()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar el familiar')
        } finally {
            setIsLoading(false)
        }
    }

    // Load all gastos when moving to financial step
    const loadAllGastos = async () => {
        try {
            setLoadingGastos(true)
            // We don't need to store all gastos anymore since we only work with familiar-specific gastos
            // This function can be used for future features if needed
        } catch (err) {
            console.error("Error loading gastos:", err)
        } finally {
            setLoadingGastos(false)
        }
    }

    // Load data on component mount
    useEffect(() => {
        if (isEditMode) {
            loadFamiliarData()
        }
    }, [familiarId, isEditMode])

    // Step 1: Create or update basic familiar info
    const onSubmitBasicInfo = async (data: CreateFamiliarFormData) => {
        try {
            setIsSubmitting(true)
            setError(null)

            const submitData: CreateFamiliarData = {
                ...data,
                parentesco_familiar: data.parentesco_familiar?.trim() || undefined,
            }

            let familiar
            if (isEditMode && familiarId) {
                // Update existing familiar
                await familiaresService.updateFamiliar({
                    id_familiar: parseInt(familiarId),
                    ...submitData
                })
                familiar = await familiaresService.getFamiliarById(parseInt(familiarId))
            } else {
                // Create new familiar
                familiar = await familiaresService.createFamiliar(submitData)
            }

            setCreatedFamiliar(familiar)
            setStep('financial')

            // Load gastos for the financial step
            await loadAllGastos()
        } catch (err) {
            setError(err instanceof Error ? err.message : `Error al ${isEditMode ? 'actualizar' : 'crear'} el familiar`)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Create a new gasto and add it to the familiar
    const onCreateGasto = async (data: CreateGastoFormData) => {
        if (!createdFamiliar) return

        try {
            setIsSubmitting(true)
            setError(null)

            // Include the familiar ID when creating the gasto
            const gastoData = {
                ...data,
                id_familiar: createdFamiliar.id_familiar
            }

            const newGasto = await familiaresService.createGasto(gastoData)
            setFamiliarGastos(prev => [...prev, newGasto])

            // Reset the gasto form
            gastoForm.reset()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear el gasto')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Update familiar with income and selected gasto
    const updateFamiliarFinancial = async () => {
        if (!createdFamiliar) return

        try {
            setIsUpdatingFinancial(true)
            setError(null)

            // Update familiar with income
            await familiaresService.updateFamiliar({
                id_familiar: createdFamiliar.id_familiar,
                ingreso_familiar: ingreso_familiar
            })

            // Navigate back with success message
            navigate('/dashboard/familiares', {
                state: {
                    message: `Familiar "${createdFamiliar.nombre_familiar}" ${isEditMode ? 'actualizado' : 'creado'} exitosamente con información financiera`,
                    type: 'success'
                }
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al actualizar información financiera')
        } finally {
            setIsUpdatingFinancial(false)
        }
    }

    // Remove a gasto from the list
    const removeGasto = async (gastoId: number) => {
        try {
            await familiaresService.deleteGasto(gastoId)
            setFamiliarGastos(prev => prev.filter(g => g.id_gasto !== gastoId))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al eliminar el gasto')
        }
    }

    const handleCancel = () => {
        if (step === 'financial' && createdFamiliar) {
            // If we're in financial step and familiar was created, we can save and exit
            updateFamiliarFinancial()
        } else {
            navigate('/dashboard/familiares')
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-HN', {
            style: 'currency',
            currency: 'HNL',
            minimumFractionDigits: 2
        }).format(amount)
    }

    const renderBasicInfoStep = () => (
        <Form {...familiarForm}>
            <form onSubmit={familiarForm.handleSubmit(onSubmitBasicInfo)} className="space-y-6">
                <Card className="bg-gradient-to-br from-soft-blue-25 to-soft-blue-50 border-soft-blue-200">
                    <CardHeader>
                        <CardTitle className="flex items-center text-soft-blue">
                            <User className="h-5 w-5 mr-2" />
                            Información Personal
                        </CardTitle>
                        <CardDescription>
                            Primero creamos el familiar con la información básica
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Familiar Name */}
                        <FormField
                            control={familiarForm.control}
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
                            control={familiarForm.control}
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
                            control={familiarForm.control}
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

                {/* Financial Information Card - Disabled */}
                <Card className="bg-gradient-to-br from-muted-tan-25 to-muted-tan-50 border-muted-tan-200 opacity-60">
                    <CardHeader>
                        <CardTitle className="flex items-center text-muted-tan-700">
                            <DollarSign className="h-5 w-5 mr-2" />
                            Información Financiera
                            <span className="ml-2 text-xs bg-muted-tan-200 text-muted-tan-600 px-2 py-1 rounded">
                                Disponible después de crear
                            </span>
                        </CardTitle>
                        <CardDescription>
                            La información financiera estará disponible una vez que se cree el familiar
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center py-8 text-muted-tan-600">
                            <Receipt className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">
                                Primero completa la información básica para habilitar esta sección
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/dashboard/familiares')}
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
                                {isEditMode ? 'Actualizando familiar...' : 'Creando familiar...'}
                            </>
                        ) : (
                            <>
                                <Users className="h-4 w-4 mr-2" />
                                {isEditMode ? 'Actualizar Familiar' : 'Crear Familiar'}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )

    const renderFinancialStep = () => (
        <div className="space-y-6">
            {/* Success message */}
            <Card className="bg-gradient-to-br from-muted-sage-green-25 to-muted-sage-green-50 border-muted-sage-green-200">
                <CardHeader>
                    <CardTitle className="flex items-center text-muted-sage-green-700">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Familiar Creado Exitosamente
                    </CardTitle>
                    <CardDescription>
                        {createdFamiliar?.nombre_familiar} ha sido registrado. Ahora puedes agregar información financiera.
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Income Section */}
            <Card className="bg-gradient-to-br from-soft-blue-25 to-soft-blue-50 border-soft-blue-200">
                <CardHeader>
                    <CardTitle className="flex items-center text-soft-blue">
                        <DollarSign className="h-5 w-5 mr-2" />
                        Ingresos Mensuales
                    </CardTitle>
                    <CardDescription>
                        Especifica los ingresos mensuales del familiar
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Label htmlFor="ingreso">Ingresos Mensuales</Label>
                        <Input
                            id="ingreso"
                            type="number"
                            placeholder="0"
                            value={ingreso_familiar || ''}
                            onChange={(e) => setIngresoFamiliar(e.target.value ? parseFloat(e.target.value) : undefined)}
                            className="bg-white border-muted-tan-300 focus:border-soft-blue"
                        />
                        <p className="text-xs text-muted-foreground">
                            Ingresos mensuales en lempiras hondureñas
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Gastos Management Section */}
            <Card className="bg-gradient-to-br from-warm-peach-25 to-warm-peach-50 border-warm-peach-200">
                <CardHeader>
                    <CardTitle className="flex items-center text-warm-peach-700">
                        <Receipt className="h-5 w-5 mr-2" />
                        Gestión de Gastos
                    </CardTitle>
                    <CardDescription>
                        Crea y gestiona las categorías de gastos para este familiar
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Create new gasto form */}
                    <Form {...gastoForm}>
                        <form onSubmit={gastoForm.handleSubmit(onCreateGasto)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={gastoForm.control}
                                    name="nombre_gasto"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre del Gasto</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Ej: Alimentación, Transporte..."
                                                    className="bg-white border-muted-tan-300"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={gastoForm.control}
                                    name="cantidad_gasto"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cantidad</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    className="bg-white border-muted-tan-300"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex items-end">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-warm-peach hover:bg-warm-peach-600 text-gentle-slate-gray hover:text-gentle-slate-gray"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Agregar Gasto
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>

                    {/* List of created gastos */}
                    {familiarGastos.length > 0 && (
                        <div className="space-y-2">
                            <Label>Gastos Creados:</Label>
                            {familiarGastos.map((gasto) => (
                                <div
                                    key={gasto.id_gasto}
                                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-warm-peach-200"
                                >
                                    <div>
                                        <span className="font-medium">{gasto.nombre_gasto}</span>
                                        <span className="text-sm text-muted-foreground ml-2">
                                            {formatCurrency(gasto.cantidad_gasto)}
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeGasto(gasto.id_gasto)}
                                        className="text-soft-coral hover:text-soft-coral-700 hover:bg-soft-coral-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Existing gastos */}
                    {loadingGastos && (
                        <div className="text-center py-4">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                            <p className="text-sm text-muted-foreground mt-2">Cargando gastos existentes...</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isUpdatingFinancial}
                    className="border-muted-tan-300 hover:bg-muted-tan-50"
                >
                    Terminar Después
                </Button>
                <Button
                    onClick={updateFamiliarFinancial}
                    disabled={isUpdatingFinancial}
                    className="bg-gradient-to-r from-muted-sage-green to-muted-sage-green-600 hover:from-muted-sage-green-600 hover:to-muted-sage-green-700 text-neutral-off-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                    {isUpdatingFinancial ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Finalizando...
                        </>
                    ) : (
                        <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Finalizar y Guardar
                        </>
                    )}
                </Button>
            </div>
        </div>
    )

    // Show loading while loading familiar data in edit mode
    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/dashboard/familiares')}
                        className="border-muted-tan-300 hover:bg-muted-tan-50"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-soft-blue to-soft-blue-600 bg-clip-text text-transparent">
                            Cargando Familiar...
                        </h1>
                        <p className="text-gentle-slate-gray mt-2">
                            Obteniendo información del familiar
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-center py-12">
                    <div className="flex items-center space-x-3">
                        <Loader2 className="h-8 w-8 animate-spin text-soft-blue" />
                        <span className="text-gentle-slate-gray">Cargando datos del familiar...</span>
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
                    onClick={() => step === 'basic' ? navigate('/dashboard/familiares') : setStep('basic')}
                    className="border-muted-tan-300 hover:bg-muted-tan-50"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {step === 'basic' ? 'Volver' : 'Paso Anterior'}
                </Button>
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-soft-blue to-soft-blue-600 bg-clip-text text-transparent">
                        {isEditMode
                            ? (step === 'basic' ? 'Editar Familiar' : 'Gestión Financiera')
                            : (step === 'basic' ? 'Crear Nuevo Familiar' : 'Gestión Financiera')
                        }
                    </h1>
                    <p className="text-gentle-slate-gray mt-2">
                        {isEditMode
                            ? (step === 'basic'
                                ? 'Actualiza la información del familiar en el sistema'
                                : `Administra la información financiera de ${createdFamiliar?.nombre_familiar}`
                            )
                            : (step === 'basic'
                                ? 'Registra un nuevo familiar en el sistema'
                                : `Administra la información financiera de ${createdFamiliar?.nombre_familiar}`
                            )
                        }
                    </p>
                </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center space-x-4 py-4">
                <div className={`flex items-center space-x-2 ${step === 'basic' ? 'text-soft-blue' : 'text-muted-sage-green'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'basic' ? 'bg-soft-blue text-white' : 'bg-muted-sage-green text-white'
                        }`}>
                        {step === 'basic' ? '1' : <CheckCircle className="h-4 w-4" />}
                    </div>
                    <span className="font-medium">Información Básica</span>
                </div>
                <div className={`h-0.5 flex-1 ${step === 'financial' ? 'bg-muted-sage-green' : 'bg-muted-tan-300'}`}></div>
                <div className={`flex items-center space-x-2 ${step === 'financial' ? 'text-soft-blue' : 'text-muted-tan-600'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'financial' ? 'bg-soft-blue text-white' : 'bg-muted-tan-300 text-muted-tan-600'
                        }`}>
                        2
                    </div>
                    <span className="font-medium">Información Financiera</span>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <Alert variant="destructive" className="border-soft-coral bg-soft-coral-50">
                    <AlertDescription className="text-soft-coral-700">{error}</AlertDescription>
                </Alert>
            )}

            {/* Render the appropriate step */}
            {step === 'basic' ? renderBasicInfoStep() : renderFinancialStep()}
        </div>
    )
}
