import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { AppSidebar } from '../components/AppSideBar'

export default function DashboardLayout() {
    const { isAuthenticated, isLoading } = useAuth()

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
        <SidebarProvider>
            <AppSidebar />
            <main className="flex flex-col flex-1 overflow-hidden">
                {/* Header */}
                <header className="flex h-16 shrink-0 items-center gap-2 px-4 bg-white border-b border-muted-tan-200">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="/dashboard">
                                    Dashboard
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Current Page</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>

                {/* Main Content */}
                <div className="flex-1 overflow-auto p-6 bg-neutral-off-white">
                    <Outlet />
                </div>
            </main>
        </SidebarProvider>
    )
}