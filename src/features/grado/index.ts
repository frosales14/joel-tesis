// Export main components
export { default as GradosPage } from './pages/GradosPage'
export { default as CreateGrado } from './pages/CreateGrado'

// Export types
export type {
    Grado,
    GradoWithAlumnos,
    CreateGradoData,
    UpdateGradoData,
    GradoFilters,
    GradosResponse,
    GradoStats
} from './types'

// Export services
export { gradosService } from './services/gradosService'
