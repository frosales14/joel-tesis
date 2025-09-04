import { Outlet, useLocation } from 'react-router-dom'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { AppSidebar } from '../components/AppSideBar'

export default function DashboardLayout() {
    const { isLoading, user } = useAuth()
    const location = useLocation()

    const getPageTitle = () => {
        const path = location.pathname
        if (path.includes('alumnos')) return 'Alumnos'
        if (path.includes('familiares')) return 'Familiares'
        if (path.includes('grados')) return 'Grados'
        if (path.includes('settings')) return 'Configuración'
        return 'Dashboard'
    }

    // Show loading while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen bg-neutral-off-white flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <div className="animate-spin h-8 w-8 border-2 border-soft-blue border-t-transparent rounded-full"></div>
                    <span className="text-gentle-slate-gray">Loading dashboard...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen bg-gradient-to-br from-neutral-off-white via-warm-peach-25 to-pale-sky-yellow-50">
            <SidebarProvider>
                <AppSidebar />
                <main className="flex flex-col flex-1 overflow-hidden">
                    {/* Enhanced Header */}
                    <header className="flex h-16 shrink-0 items-center gap-4 px-4 lg:px-6 bg-white/80 backdrop-blur-md border-b border-muted-tan-200 shadow-sm">
                        <SidebarTrigger className="-ml-1 hover:bg-soft-blue-50 hover:text-soft-blue transition-colors rounded-md" />
                        <Separator orientation="vertical" className="mr-2 h-4 bg-muted-tan-300" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink
                                        href="/dashboard"
                                        className="text-gentle-slate-gray hover:text-soft-blue transition-colors font-medium"
                                    >
                                        Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                {location.pathname !== '/dashboard' && (
                                    <>
                                        <BreadcrumbSeparator className="hidden md:block text-muted-tan-400" />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage className="text-soft-blue font-semibold">
                                                {getPageTitle()}
                                            </BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </>
                                )}
                            </BreadcrumbList>
                        </Breadcrumb>

                        {/* Welcome Message */}
                        <div className="ml-auto hidden lg:block">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gentle-slate-gray">
                                    {new Date().toLocaleDateString('es-ES', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long'
                                    })}
                                </p>
                                <p className="text-xs text-muted-tan-600">
                                    Bienvenido, {user?.name || 'Usuario'}
                                </p>
                            </div>
                        </div>
                    </header>

                    {/* Enhanced Main Content */}
                    <div className="flex-1 overflow-auto p-4 lg:p-6 bg-gradient-to-b from-transparent to-neutral-off-white/30">
                        <div className="max-w-7xl mx-auto">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </SidebarProvider>
        </div>
    )
}