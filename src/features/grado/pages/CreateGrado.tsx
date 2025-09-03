"use client"

import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft, GraduationCap, Loader2, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { gradosService } from "../services/gradosService"
import type { CreateGradoData } from "../types"

// Form validation schema
const createGradoSchema = z.object({
    nombre_grado: z.string()
        .min(2, "El nombre del grado debe tener al menos 2 caracteres")
        .max(50, "El nombre del grado es demasiado largo")
        .trim(),
})

type CreateGradoFormData = z.infer<typeof createGradoSchema>

export default function CreateGrado() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const gradoId = searchParams.get('id')
    const isEditMode = !!gradoId

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(isEditMode)

    const form = useForm<CreateGradoFormData>({
        resolver: zodResolver(createGradoSchema),
        defaultValues: {
            nombre_grado: "",
        },
    })

    // Load existing grado data for editing
    useEffect(() => {
        if (isEditMode && gradoId) {
            loadGradoData()
        }
    }, [isEditMode, gradoId])

    const loadGradoData = async () => {
        try {
            setIsLoading(true)
            const grado = await gradosService.getGradoById(parseInt(gradoId!))

            if (grado) {
                form.reset({
                    nombre_grado: grado.nombre_grado,
                })
            } else {
                setError('Grado no encontrado')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error loading grado data')
        } finally {
            setIsLoading(false)
        }
    }

    const onSubmit = async (data: CreateGradoFormData) => {
        try {
            setIsSubmitting(true)
            setError(null)

            const gradoData: CreateGradoData = {
                nombre_grado: data.nombre_grado,
            }

            if (isEditMode && gradoId) {
                // Update existing grado
                await gradosService.updateGrado({
                    id_grado: parseInt(gradoId),
                    ...gradoData
                })

                navigate('/dashboard/grados', {
                    state: {
                        message: `Grado "${data.nombre_grado}" actualizado exitosamente`,
                        type: 'success'
                    }
                })
            } else {
                // Create new grado
                await gradosService.createGrado(gradoData)

                navigate('/dashboard/grados', {
                    state: {
                        message: `Grado "${data.nombre_grado}" creado exitosamente`,
                        type: 'success'
                    }
                })
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al guardar el grado')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleBack = () => {
        navigate('/dashboard/grados')
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-neutral-off-white flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <Loader2 className="h-8 w-8 animate-spin text-soft-blue" />
                    <span className="text-gentle-slate-gray">Cargando datos del grado...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBack}
                        className="border-muted-tan-300 text-gentle-slate-gray hover:bg-muted-tan-50"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver a Grados
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-soft-blue">
                            {isEditMode ? 'Editar Grado' : 'Crear Nuevo Grado'}
                        </h1>
                        <p className="text-gentle-slate-gray mt-2">
                            {isEditMode
                                ? 'Modifica la información del grado académico'
                                : 'Completa la información para crear un nuevo grado académico'
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <Alert className="border-soft-coral-200 bg-soft-coral-50">
                    <AlertDescription className="text-soft-coral-700 font-medium">
                        {error}
                    </AlertDescription>
                </Alert>
            )}

            {/* Main Form */}
            <Card className="max-w-2xl">
                <CardHeader className="bg-gradient-to-r from-soft-blue-50 to-warm-peach-50">
                    <CardTitle className="flex items-center text-soft-blue">
                        <GraduationCap className="h-5 w-5 mr-2" />
                        Información del Grado
                    </CardTitle>
                    <CardDescription>
                        Ingresa el nombre del grado académico
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Nombre del Grado */}
                            <FormField
                                control={form.control}
                                name="nombre_grado"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gentle-slate-gray font-medium">
                                            Nombre del Grado *
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ej: 1° Primaria, 5° Bachillerato, Preescolar..."
                                                {...field}
                                                className="border-muted-tan-300 focus:border-soft-blue focus:ring-soft-blue"
                                            />
                                        </FormControl>
                                        <FormDescription className="text-muted-tan-600">
                                            Nombre descriptivo del grado académico (máximo 50 caracteres)
                                        </FormDescription>
                                        <FormMessage className="text-soft-coral" />
                                    </FormItem>
                                )}
                            />

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleBack}
                                    className="flex-1 border-muted-tan-300 text-gentle-slate-gray hover:bg-muted-tan-50"
                                    disabled={isSubmitting}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 bg-gradient-to-r from-soft-blue to-soft-blue-600 hover:from-soft-blue-600 hover:to-soft-blue-700 text-neutral-off-white shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            {isEditMode ? 'Actualizando...' : 'Creando...'}
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            {isEditMode ? 'Actualizar Grado' : 'Crear Grado'}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Information Card */}
            <Card className="max-w-2xl bg-gradient-to-br from-warm-peach-25 to-pale-sky-yellow-25 border-warm-peach-200">
                <CardHeader>
                    <CardTitle className="text-warm-peach-700 text-lg">
                        💡 Información Importante
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-warm-peach-700">
                    <div className="flex items-start space-x-2">
                        <span className="font-medium">•</span>
                        <span>Los grados se utilizan para clasificar a los estudiantes por nivel académico</span>
                    </div>
                    <div className="flex items-start space-x-2">
                        <span className="font-medium">•</span>
                        <span>Puedes usar nombres descriptivos como "1° Primaria", "Preescolar", "5° Bachillerato", etc.</span>
                    </div>
                    <div className="flex items-start space-x-2">
                        <span className="font-medium">•</span>
                        <span>Una vez creado, podrás asignar estudiantes a este grado desde la gestión de alumnos</span>
                    </div>
                    <div className="flex items-start space-x-2">
                        <span className="font-medium">•</span>
                        <span>No podrás eliminar un grado que tenga estudiantes asignados</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
