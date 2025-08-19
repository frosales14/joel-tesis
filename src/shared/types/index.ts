// Shared type definitions

// Base entity interface for all entities
export interface BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

// API response wrapper
export interface ApiResponse<T = any> {
    data: T;
    message: string;
    success: boolean;
    timestamp: Date;
}

// Error response
export interface ApiError {
    message: string;
    code?: string;
    details?: Record<string, any>;
}

// Pagination
export interface PaginationParams {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

// Loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Common form field props
export interface FormFieldProps {
    label: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
}
