import { createBrowserRouter, Navigate } from "react-router-dom"
import DashboardLayout from "./layouts/dashboard/DashboardLayout"
import StudentsPage from "./features/student/pages/StudentsPage"
import { LoginPage, RegisterPage } from "./features/auth"
import { NotFound } from "./shared"
import ProtectedRoute from "./components/ProtectedRoute"

export const appRouter = createBrowserRouter([
    // Public Auth Routes
    {
        path: '/',
        element: <LoginPage />,
    },


    // Protected Dashboard Routes
    {
        path: '/dashboard',
        element: (
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="alumnos" replace />,
            },
            {
                path: 'alumnos',
                element: <StudentsPage />,
            },
            // Add more protected routes here as needed
            // {
            //   path: 'settings',
            //   element: <SettingsPage />,
            // },
        ]
    },

    // Legacy auth routes for compatibility
    {
        path: '/auth/login',
        element: <Navigate to="/login" replace />,
    },
    {
        path: '/auth/register',
        element: <Navigate to="/register" replace />,
    },

    // 404 Route
    {
        path: '*',
        element: <NotFound />,
    }
])