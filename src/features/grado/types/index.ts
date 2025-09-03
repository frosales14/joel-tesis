// Database types matching Supabase schema for grados

export interface Grado {
    id_grado: number;
    nombre_grado: string;
}

// Extended type for display purposes with joined data
export interface GradoWithAlumnos extends Grado {
    alumnos?: Array<{
        id_alumno: number;
        nombre_alumno: string;
        edad_alumno?: number;
        situacion_actual?: string;
    }>; // Students in this grade
    total_alumnos?: number; // Count of students in this grade
}

// Form types for creating/editing
export interface CreateGradoData {
    nombre_grado: string;
}

export interface UpdateGradoData extends Partial<CreateGradoData> {
    id_grado: number;
}

// Filter and search types
export interface GradoFilters {
    searchTerm?: string;
    has_students?: boolean;
}

// API response types
export interface GradosResponse {
    grados: GradoWithAlumnos[];
    total: number;
    page: number;
    pageSize: number;
}

// Statistics types
export interface GradoStats {
    totalGrados: number;
    gradosWithStudents: number;
    totalStudentsInGrados: number;
    averageStudentsPerGrado: number;
    mostPopularGrado?: {
        id_grado: number;
        nombre_grado: string;
        student_count: number;
    };
    recentGrados: Array<{
        id_grado: number;
        nombre_grado: string;
    }>;
}
