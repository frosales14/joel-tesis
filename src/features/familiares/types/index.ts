// Database types matching Supabase schema for familiares

export interface Gasto {
    id_gasto: number;
    nombre_gasto: string;
    cantidad_gasto: number;
    id_familiar: number; // NEW: Foreign key to familiar
}

export interface Familiar {
    id_familiar: number;
    nombre_familiar: string;
    edad_familiar?: number;
    parentesco_familiar?: string;
    ingreso_familiar?: number;
    gastos?: Gasto[]; // NEW: One-to-many relationship with gastos
}

// Extended type for display purposes with joined data
export interface FamiliarWithGastos extends Familiar {
    gastos?: Gasto[]; // Multiple gastos for this familiar
    alumnos?: Array<{
        id_alumno: number;
        nombre_alumno: string;
    }>; // Associated students
}

// Form types for creating/editing
export interface CreateFamiliarData {
    nombre_familiar: string;
    edad_familiar?: number;
    parentesco_familiar?: string;
    ingreso_familiar?: number;
}

export interface UpdateFamiliarData extends Partial<CreateFamiliarData> {
    id_familiar: number;
}

export interface CreateGastoData {
    nombre_gasto: string;
    cantidad_gasto: number;
    id_familiar: number; // NEW: Required familiar reference
}

export interface UpdateGastoData extends Partial<CreateGastoData> {
    id_gasto: number;
}

// Filter and search types
export interface FamiliarFilters {
    searchTerm?: string;
    parentesco?: string;
    ingreso_min?: number;
    ingreso_max?: number;
    has_gasto?: boolean;
}

// API response types
export interface FamiliaresResponse {
    familiares: FamiliarWithGastos[];
    total: number;
    page: number;
    pageSize: number;
}

// Statistics types
export interface FamiliarStats {
    totalFamiliares: number;
    withIncome: number;
    withExpenses: number;
    averageIncome: number;
    uniqueRelationships: number;
    recentFamiliares: Array<{
        id_familiar: number;
        nombre_familiar: string;
        parentesco_familiar?: string;
    }>;
}
