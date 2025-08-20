// Database types matching Supabase schema

export interface Gasto {
    id_gasto: number;
    nombre_gasto: string;
    cantidad_gasto: number;
    id_familiar: number; // NEW: Required foreign key to familiar (matching familiares schema)
}

export interface Familiar {
    id_familiar: number;
    nombre_familiar: string;
    edad_familiar?: number;
    parentesco_familiar?: string;
    ingreso_familiar?: number;
    gastos?: Gasto[]; // NEW: One-to-many relationship with gastos
}

export interface Alumno {
    id_alumno: number;
    nombre_alumno: string;
    edad_alumno?: number;
    fecha_nacimiento?: string; // ISO date string
    grado_alumno?: number;
    fecha_ingreso?: string; // ISO date string
    motivo_ingreso?: string;
    situacion_familiar?: string;
    situacion_actual?: string;
    id_familiar?: number;
    familiar?: Familiar; // For joined queries
}

export interface AlumnoXFamiliar {
    id: number;
    id_alumno: number;
    id_familiar?: number;
    alumno?: Alumno; // For joined queries
    familiar?: Familiar; // For joined queries
}

// Extended type for display purposes with joined data
export interface AlumnoWithFamiliar extends Alumno {
    familiar?: Familiar;
    familiares?: Familiar[]; // Multiple family members via AlumnoXFamiliar
}

// Form types for creating/editing
export interface CreateAlumnoData {
    nombre_alumno: string;
    edad_alumno?: number;
    fecha_nacimiento?: string;
    grado_alumno?: number;
    fecha_ingreso?: string;
    motivo_ingreso?: string;
    situacion_familiar?: string;
    situacion_actual?: string;
    id_familiar?: number; // Keep for backwards compatibility (primary familiar)
    familiares_ids?: number[]; // NEW: Array of familiar IDs for many-to-many relationship
}

export interface UpdateAlumnoData extends Partial<CreateAlumnoData> {
    id_alumno: number;
}

export interface CreateFamiliarData {
    nombre_familiar: string;
    edad_familiar?: number;
    parentesco_familiar?: string;
    ingreso_familiar?: number;
    id_gasto?: number;
}

export interface UpdateFamiliarData extends Partial<CreateFamiliarData> {
    id_familiar: number;
}

// Filter and search types
export interface StudentFilters {
    searchTerm?: string;
    grado?: number;
    situacion_actual?: string;
    edad_min?: number;
    edad_max?: number;
    fecha_ingreso_desde?: string;
    fecha_ingreso_hasta?: string;
}

// API response types
export interface StudentsResponse {
    students: AlumnoWithFamiliar[];
    total: number;
    page: number;
    pageSize: number;
}
