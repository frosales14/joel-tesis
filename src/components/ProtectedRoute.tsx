import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'

interface ProtectedRouteProps {
    children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuth()
    const location = useLocation()

    // Show loading while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen bg-neutral-off-white flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <div className="animate-spin h-8 w-8 border-2 border-soft-blue border-t-transparent rounded-full"></div>
                    <span className="text-gentle-slate-gray">Checking authentication...</span>
                </div>
            </div>
        )
    }

    // Redirect to login if not authenticated, preserving the intended destination
    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />
    }

    return <>{children}</>
}