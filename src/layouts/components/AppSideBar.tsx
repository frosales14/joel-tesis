import { Users, LogOut, UserCheck, GraduationCap } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/features/auth/hooks/useAuth"
import logoImg from "@/assets/san-logo.png"

// Menu items
const menuItems = [
    {
        title: "Alumnos",
        url: "/dashboard/alumnos",
        icon: Users,
    },
    {
        title: "Familiares",
        url: "/dashboard/familiares",
        icon: UserCheck,
    },
    {
        title: "Grados",
        url: "/dashboard/grados",
        icon: GraduationCap,
    },
]



export function AppSidebar() {
    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/login')
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    return (
        <Sidebar className="border-r border-muted-tan-200 bg-gradient-to-b from-white via-warm-peach-25 to-neutral-off-white">
            {/* Enhanced Header */}
            <SidebarHeader className="p-4 border-b border-muted-tan-200 bg-gradient-to-r from-soft-blue-50 to-warm-peach-50">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <div className="absolute inset-0 bg-soft-blue-100 rounded-xl blur-md opacity-50"></div>
                        <img
                            src={logoImg}
                            alt="Sociedad Amigos de los Niños"
                            className="relative w-auto object-contain bg-chart-1/80 rounded-lg p-2 shadow-sm"
                        />
                    </div>

                </div>
            </SidebarHeader>

            {/* Content */}
            <SidebarContent className="px-2">
                {/* Main Navigation */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-gentle-slate-gray font-semibold">
                        Navegación
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.url ||
                                    (item.url === '/dashboard' && location.pathname.startsWith('/dashboard'))

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={isActive}>
                                            <Link
                                                to={item.url}
                                                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group ${isActive
                                                    ? 'bg-gradient-to-r from-soft-blue to-soft-blue-600 text-white shadow-md'
                                                    : 'text-gentle-slate-gray hover:text-soft-blue hover:bg-soft-blue-50'
                                                    }`}
                                            >
                                                <item.icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : ''
                                                    }`} />
                                                <span className="font-medium">{item.title}</span>
                                                {isActive && (
                                                    <div className="ml-auto w-2 h-2 bg-warm-peach rounded-full animate-pulse"></div>
                                                )}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>

            {/* Enhanced Footer */}
            <SidebarFooter className="p-4 border-t border-muted-tan-200">
                <Card className="bg-gradient-to-br from-warm-peach-50 via-warm-peach-25 to-neutral-off-white border-warm-peach-200 shadow-lg">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-soft-blue-300 rounded-full blur-sm opacity-50"></div>
                                <div className="relative h-10 w-10 bg-gradient-to-br from-soft-blue to-soft-blue-600 rounded-full flex items-center justify-center shadow-md">
                                    <span className="text-white text-sm font-bold">
                                        {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gentle-slate-gray truncate">
                                    {user?.name || 'Usuario'}
                                </p>
                                <p className="text-xs text-muted-tan-600 truncate">
                                    {user?.email}
                                </p>
                                <div className="flex items-center mt-1">
                                    <div className="h-2 w-2 bg-muted-sage-green rounded-full mr-1 animate-pulse"></div>
                                    <span className="text-xs text-muted-sage-green font-medium">En línea</span>
                                </div>
                            </div>
                        </div>
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            size="sm"
                            className="w-full text-xs border-soft-coral text-soft-coral hover:bg-gradient-to-r hover:from-soft-coral hover:to-soft-coral-600 hover:text-white hover:border-soft-coral-600 transition-all duration-200 shadow-sm"
                        >
                            <LogOut className="h-3 w-3 mr-2" />
                            Cerrar Sesión
                        </Button>
                    </CardContent>
                </Card>
            </SidebarFooter>
        </Sidebar>
    )
}