import { useState } from "react"
import { Users, BookOpen, Calendar, TrendingUp, Plus, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/features/auth/hooks/useAuth"

export default function DashboardHome() {
    const { user } = useAuth()
    const [currentTime] = useState(new Date())

    // Mock data for dashboard stats
    const stats = [
        {
            title: "Total Alumnos",
            value: "234",
            change: "+12%",
            trend: "up",
            icon: Users,
            color: "soft-blue",
            description: "Estudiantes activos"
        },
        {
            title: "Programas Activos",
            value: "8",
            change: "+2",
            trend: "up",
            icon: BookOpen,
            color: "muted-sage-green",
            description: "Programas académicos"
        },
        {
            title: "Eventos este mes",
            value: "15",
            change: "+5",
            trend: "up",
            icon: Calendar,
            color: "warm-peach",
            description: "Actividades programadas"
        },
        {
            title: "Tasa de retención",
            value: "94%",
            change: "+3%",
            trend: "up",
            icon: TrendingUp,
            color: "soft-coral",
            description: "Estudiantes que continúan"
        }
    ]

    const recentActivities = [
        {
            id: 1,
            type: "new_student",
            message: "Nuevo estudiante registrado: María González",
            time: "Hace 2 horas",
            color: "muted-sage-green"
        },
        {
            id: 2,
            type: "program_update",
            message: "Programa de Psicología actualizado",
            time: "Hace 4 horas",
            color: "soft-blue"
        },
        {
            id: 3,
            type: "event_scheduled",
            message: "Evento 'Conferencia de Ingeniería' programado",
            time: "Hace 6 horas",
            color: "warm-peach"
        }
    ]

    const quickActions = [
        {
            title: "Agregar Alumno",
            description: "Registrar nuevo estudiante",
            icon: Users,
            color: "soft-blue",
            action: () => console.log("Add student")
        },
        {
            title: "Crear Evento",
            description: "Programar nueva actividad",
            icon: Calendar,
            color: "warm-peach",
            action: () => console.log("Create event")
        },
        {
            title: "Nuevo Programa",
            description: "Añadir programa académico",
            icon: BookOpen,
            color: "muted-sage-green",
            action: () => console.log("Add program")
        }
    ]

    const getGreeting = () => {
        const hour = currentTime.getHours()
        if (hour < 12) return "Buenos días"
        if (hour < 18) return "Buenas tardes"
        return "Buenas noches"
    }

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-soft-blue-50 via-warm-peach-25 to-pale-sky-yellow-50 rounded-2xl p-6 border border-muted-tan-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-soft-blue to-soft-blue-600 bg-clip-text text-transparent">
                            {getGreeting()}, {user?.name || 'Usuario'}! 👋
                        </h1>
                        <p className="text-gentle-slate-gray mt-2 text-lg">
                            Bienvenido al panel de administración de SAN
                        </p>
                        <div className="flex items-center mt-3 space-x-4">
                            <Badge className="bg-muted-sage-green-100 text-muted-sage-green-700 hover:bg-muted-sage-green-200">
                                <Activity className="h-3 w-3 mr-1" />
                                Sistema Activo
                            </Badge>
                            <span className="text-sm text-muted-tan-600">
                                {currentTime.toLocaleDateString('es-ES', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="text-right">
                            <div className="text-4xl font-bold text-soft-blue">
                                {currentTime.toLocaleTimeString('es-ES', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                            <div className="text-sm text-gentle-slate-gray">
                                Hora actual
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 border-${stat.color}-200 hover:shadow-lg transition-all duration-200`}>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className={`text-sm font-medium text-${stat.color}-700`}>
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className={`h-4 w-4 text-${stat.color}-600`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline space-x-2">
                                <div className={`text-3xl font-bold text-${stat.color}`}>
                                    {stat.value}
                                </div>
                                <Badge className={`bg-${stat.color}-200 text-${stat.color}-800 text-xs`}>
                                    {stat.change}
                                </Badge>
                            </div>
                            <p className={`text-xs text-${stat.color}-600 mt-1`}>
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg text-gentle-slate-gray flex items-center">
                            <Plus className="h-5 w-5 mr-2 text-soft-blue" />
                            Acciones Rápidas
                        </CardTitle>
                        <CardDescription>
                            Tareas frecuentes del sistema
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {quickActions.map((action, index) => (
                            <Button
                                key={index}
                                onClick={action.action}
                                variant="outline"
                                className={`w-full justify-start h-auto p-4 border-${action.color}-200 hover:bg-${action.color}-50 hover:border-${action.color}-300 transition-all duration-200`}
                            >
                                <action.icon className={`h-5 w-5 mr-3 text-${action.color}`} />
                                <div className="text-left">
                                    <div className="font-semibold text-gentle-slate-gray">
                                        {action.title}
                                    </div>
                                    <div className="text-xs text-muted-tan-600">
                                        {action.description}
                                    </div>
                                </div>
                            </Button>
                        ))}
                    </CardContent>
                </Card>

                {/* Recent Activities */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg text-gentle-slate-gray flex items-center">
                            <Activity className="h-5 w-5 mr-2 text-soft-blue" />
                            Actividad Reciente
                        </CardTitle>
                        <CardDescription>
                            Últimas actualizaciones del sistema
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivities.map((activity) => (
                                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-neutral-off-white hover:bg-warm-peach-25 transition-colors duration-200">
                                    <div className={`w-2 h-2 rounded-full bg-${activity.color} mt-2 animate-pulse`}></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gentle-slate-gray">
                                            {activity.message}
                                        </p>
                                        <p className="text-xs text-muted-tan-600 mt-1">
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" className="w-full mt-4 text-soft-blue border-soft-blue hover:bg-soft-blue hover:text-white">
                                Ver todas las actividades
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
