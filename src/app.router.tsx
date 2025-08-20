import { createBrowserRouter, Navigate } from "react-router-dom"
import DashboardLayout from "./layouts/dashboard/DashboardLayout"
import StudentsPage from "./features/student/pages/StudentsPage"
import CreateStudent from "./features/student/pages/CreateStudent"
import { FamiliaresPage, CreateFamiliar } from "./features/familiares"
import { LoginPage } from "./features/auth"
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
                path: 'alumnos',
                element: <StudentsPage />,
            },
            {
                path: 'alumnos/crear',
                element: <CreateStudent />,
            },
            {
                path: 'familiares',
                element: <FamiliaresPage />,
            },
            {
                path: 'familiares/crear',
                element: <CreateFamiliar />,
            },
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