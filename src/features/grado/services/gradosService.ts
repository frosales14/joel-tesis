import { supabase } from '@/lib/supabase'
import type {
    Grado,
    GradoWithAlumnos,
    CreateGradoData,
    UpdateGradoData,
    GradoFilters,
    GradosResponse,
    GradoStats
} from '../types'

class GradosService {
    // Get all grados with optional filters and pagination
    async getGrados(
        filters: GradoFilters = {},
        page: number = 1,
        pageSize: number = 10
    ): Promise<GradosResponse> {
        try {
            // Helper function to apply filters to a query
            const applyFilters = (query: any) => {
                if (filters.searchTerm) {
                    query = query.ilike('nombre_grado', `%${filters.searchTerm}%`)
                }

                return query
            }

            // Get total count with a separate query
            let countQuery = supabase
                .from('grado')
                .select('*', { count: 'exact', head: true })

            countQuery = applyFilters(countQuery)
            const { count, error: countError } = await countQuery

            if (countError) {
                throw new Error(`Error getting count: ${countError.message}`)
            }

            // Get data with pagination and alumnos
            let dataQuery = supabase
                .from('grado')
                .select(`
          *,
          alumnos:alumno (
            id_alumno,
            nombre_alumno,
            edad_alumno,
            situacion_actual
          )
        `)

            dataQuery = applyFilters(dataQuery)

            const { data, error } = await dataQuery
                .range((page - 1) * pageSize, page * pageSize - 1)
                .order('nombre_grado', { ascending: true })

            if (error) {
                throw new Error(`Error fetching grados: ${error.message}`)
            }

            // Transform data to include total_alumnos count
            const gradosWithAlumnos: GradoWithAlumnos[] = data?.map(grado => ({
                ...grado,
                total_alumnos: grado.alumnos?.length || 0
            })) || []

            return {
                grados: gradosWithAlumnos,
                total: count || 0,
                page,
                pageSize
            }
        } catch (error) {
            console.error('Error in getGrados:', error)
            throw error
        }
    }

    // Get a single grado by ID with all related data
    async getGradoById(id: number): Promise<GradoWithAlumnos | null> {
        try {
            const { data, error } = await supabase
                .from('grado')
                .select(`
          *,
          alumnos:alumno (
            id_alumno,
            nombre_alumno,
            edad_alumno,
            situacion_actual
          )
        `)
                .eq('id_grado', id)
                .single()

            if (error) {
                if (error.code === 'PGRST116') {
                    return null // Grado not found
                }
                throw new Error(`Error fetching grado: ${error.message}`)
            }

            return {
                ...data,
                total_alumnos: data.alumnos?.length || 0
            } as GradoWithAlumnos
        } catch (error) {
            console.error('Error in getGradoById:', error)
            throw error
        }
    }

    // Create a new grado
    async createGrado(gradoData: CreateGradoData): Promise<Grado> {
        try {
            const { data, error } = await supabase
                .from('grado')
                .insert([gradoData])
                .select()
                .single()

            if (error) {
                throw new Error(`Error creating grado: ${error.message}`)
            }

            return data as Grado
        } catch (error) {
            console.error('Error in createGrado:', error)
            throw error
        }
    }

    // Update an existing grado
    async updateGrado(gradoData: UpdateGradoData): Promise<Grado> {
        try {
            const { id_grado, ...updateData } = gradoData

            const { data, error } = await supabase
                .from('grado')
                .update(updateData)
                .eq('id_grado', id_grado)
                .select()
                .single()

            if (error) {
                throw new Error(`Error updating grado: ${error.message}`)
            }

            return data as Grado
        } catch (error) {
            console.error('Error in updateGrado:', error)
            throw error
        }
    }

    // Delete a grado
    async deleteGrado(id: number): Promise<void> {
        try {
            // First check if there are any students in this grade
            const { count, error: countError } = await supabase
                .from('alumno')
                .select('id_alumno', { count: 'exact', head: true })
                .eq('id_grado', id)

            if (countError) {
                throw new Error(`Error checking students: ${countError.message}`)
            }

            if (count && count > 0) {
                throw new Error(`No se puede eliminar el grado porque tiene ${count} estudiante(s) asignado(s)`)
            }

            const { error } = await supabase
                .from('grado')
                .delete()
                .eq('id_grado', id)

            if (error) {
                throw new Error(`Error deleting grado: ${error.message}`)
            }
        } catch (error) {
            console.error('Error in deleteGrado:', error)
            throw error
        }
    }

    // Get all grados (for dropdowns and references)
    async getAllGrados(): Promise<Grado[]> {
        try {
            const { data, error } = await supabase
                .from('grado')
                .select('*')
                .order('nombre_grado')

            if (error) {
                throw new Error(`Error fetching grados: ${error.message}`)
            }

            return data as Grado[]
        } catch (error) {
            console.error('Error in getAllGrados:', error)
            throw error
        }
    }

    // Get students by grado
    async getStudentsByGrado(id_grado: number) {
        try {
            const { data, error } = await supabase
                .from('alumno')
                .select('id_alumno, nombre_alumno, edad_alumno, situacion_actual')
                .eq('id_grado', id_grado)
                .order('nombre_alumno')

            if (error) {
                throw new Error(`Error fetching students: ${error.message}`)
            }

            return data
        } catch (error) {
            console.error('Error in getStudentsByGrado:', error)
            throw error
        }
    }

    // Get dashboard statistics for grados
    async getGradoStats(): Promise<GradoStats> {
        try {
            const [
                { count: totalGrados },
                { count: gradosWithStudents },
                { data: gradoStudentCounts },
                { data: recentGrados }
            ] = await Promise.all([
                // Total grados
                supabase
                    .from('grado')
                    .select('id_grado', { count: 'exact', head: true }),

                // Grados with students (count distinct grados that have students)
                supabase
                    .from('alumno')
                    .select('id_grado', { count: 'exact', head: true })
                    .not('id_grado', 'is', null),

                // Get grados with student counts for statistics
                supabase
                    .from('grado')
                    .select(`
            id_grado,
            nombre_grado,
            alumnos:alumno (
              id_alumno
            )
          `),

                // Recent grados (last 10)
                supabase
                    .from('grado')
                    .select('id_grado, nombre_grado')
                    .order('id_grado', { ascending: false })
                    .limit(10)
            ])

            // Process student counts
            const gradosWithStudentCounts = gradoStudentCounts?.map(grado => ({
                ...grado,
                student_count: grado.alumnos?.length || 0
            })) || []

            // Calculate total students in all grados
            const totalStudentsInGrados = gradosWithStudentCounts
                .reduce((sum, grado) => sum + grado.student_count, 0)

            // Calculate average students per grado
            const averageStudentsPerGrado = totalGrados && totalGrados > 0
                ? Math.round(totalStudentsInGrados / totalGrados)
                : 0

            // Find most popular grado
            const mostPopularGrado = gradosWithStudentCounts
                .filter(grado => grado.student_count > 0)
                .sort((a, b) => b.student_count - a.student_count)[0]

            return {
                totalGrados: totalGrados || 0,
                gradosWithStudents: gradosWithStudents || 0,
                totalStudentsInGrados,
                averageStudentsPerGrado,
                mostPopularGrado: mostPopularGrado ? {
                    id_grado: mostPopularGrado.id_grado,
                    nombre_grado: mostPopularGrado.nombre_grado,
                    student_count: mostPopularGrado.student_count
                } : undefined,
                recentGrados: recentGrados || []
            }
        } catch (error) {
            console.error('Error in getGradoStats:', error)
            throw error
        }
    }
}

export const gradosService = new GradosService()
