import { Users, Home, Settings, LogOut } from "lucide-react"
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
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
        isActive: true,
    },
    {
        title: "Alumnos",
        url: "/dashboard/alumnos",
        icon: Users,
    },
]

const settingsItems = [
    {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
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
        <Sidebar className="border-r border-muted-tan-200">
            {/* Header */}
            <SidebarHeader className="p-4 border-b border-muted-tan-200">
                <div className="flex items-center space-x-3">
                    <img
                        src={logoImg}
                        alt="Sociedad Amigos de los Niños"
                        className="h-10 w-auto object-contain"
                    />
                    <div className="flex flex-col">
                        <h2 className="text-lg font-bold text-soft-blue">SAN Dashboard</h2>
                        <p className="text-xs text-gentle-slate-gray">Management System</p>
                    </div>
                </div>
            </SidebarHeader>

            {/* Content */}
            <SidebarContent className="px-2">
                {/* Main Navigation */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-gentle-slate-gray font-semibold">
                        Main Navigation
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
                                                className="flex items-center space-x-2 text-gentle-slate-gray hover:text-soft-blue"
                                            >
                                                <item.icon className="h-4 w-4" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Settings */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-gentle-slate-gray font-semibold">
                        Settings
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {settingsItems.map((item) => {
                                const isActive = location.pathname === item.url

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={isActive}>
                                            <Link
                                                to={item.url}
                                                className="flex items-center space-x-2 text-gentle-slate-gray hover:text-soft-blue"
                                            >
                                                <item.icon className="h-4 w-4" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer */}
            <SidebarFooter className="p-4 border-t border-muted-tan-200">
                <Card className="bg-warm-peach-50 border-warm-peach-200">
                    <CardContent className="p-3">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="h-8 w-8 bg-soft-blue rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-semibold">
                                    {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gentle-slate-gray truncate">
                                    {user?.name || 'User'}
                                </p>
                                <p className="text-xs text-muted-tan-600 truncate">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            size="sm"
                            className="w-full text-xs border-soft-coral text-soft-coral hover:bg-soft-coral hover:text-white"
                        >
                            <LogOut className="h-3 w-3 mr-1" />
                            Sign Out
                        </Button>
                    </CardContent>
                </Card>
            </SidebarFooter>
        </Sidebar>
    )
}