import { createBrowserRouter, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/dashboard/DashboardLayout";
import StudentsPage from "./features/student/pages/StudentsPage";
import { LoginPage } from "./features/auth";

export const appRouter = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/dashboard',
        element: <DashboardLayout />,
        children: [
            {
                path: 'alumnos',
                element: <StudentsPage />,
                children: [
                    {
                        path: '*',
                        element: <Navigate to="/dashboard/alumnos" />,
                    }
                ]
            }
        ]
    }
]);