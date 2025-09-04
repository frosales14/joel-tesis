import { supabase } from '@/lib/supabase'
import type {
    Familiar,
    FamiliarWithGastos,
    CreateFamiliarData,
    UpdateFamiliarData,
    Gasto,
    CreateGastoData,
    UpdateGastoData,
    FamiliarFilters,
    FamiliaresResponse,
    FamiliarStats
} from '../types'

class FamiliaresService {
    // Get all familiares with optional filters and pagination
    async getFamiliares(
        filters: FamiliarFilters = {},
        page: number = 1,
        pageSize: number = 10
    ): Promise<FamiliaresResponse> {
        try {
            // Helper function to apply filters to a query
            const applyFilters = (query: any) => {
                if (filters.searchTerm) {
                    query = query.ilike('nombre_familiar', `%${filters.searchTerm}%`)
                }

                if (filters.ingreso_min !== undefined) {
                    query = query.gte('ingreso_familiar', filters.ingreso_min)
                }

                if (filters.ingreso_max !== undefined) {
                    query = query.lte('ingreso_familiar', filters.ingreso_max)
                }

                // Note: has_gasto filter will be handled differently now
                // since gastos are in a separate table linked by id_familiar

                return query
            }

            // Get total count with a separate query
            let countQuery = supabase
                .from('familiar')
                .select('*', { count: 'exact', head: true })

            countQuery = applyFilters(countQuery)
            const { count, error: countError } = await countQuery

            if (countError) {
                throw new Error(`Error getting count: ${countError.message}`)
            }

            // Get data with pagination and gastos
            let dataQuery = supabase
                .from('familiar')
                .select(`
          *,
          gastos:gasto (
            id_gasto,
            nombre_gasto,
            cantidad_gasto,
            id_familiar
          )
        `)

            dataQuery = applyFilters(dataQuery)

            const { data, error } = await dataQuery
                .range((page - 1) * pageSize, page * pageSize - 1)
                .order('nombre_familiar', { ascending: true })

            if (error) {
                throw new Error(`Error fetching familiares: ${error.message}`)
            }

            return {
                familiares: data as FamiliarWithGastos[],
                total: count || 0,
                page,
                pageSize
            }
        } catch (error) {
            console.error('Error in getFamiliares:', error)
            throw error
        }
    }

    // Get a single familiar by ID with all related data
    async getFamiliarById(id: number): Promise<FamiliarWithGastos | null> {
        try {
            const { data, error } = await supabase
                .from('familiar')
                .select(`
          *,
          gastos:gasto (
            id_gasto,
            nombre_gasto,
            cantidad_gasto,
            id_familiar
          )
        `)
                .eq('id_familiar', id)
                .single()

            if (error) {
                if (error.code === 'PGRST116') {
                    return null // Familiar not found
                }
                throw new Error(`Error fetching familiar: ${error.message}`)
            }

            return data as FamiliarWithGastos
        } catch (error) {
            console.error('Error in getFamiliarById:', error)
            throw error
        }
    }

    // Create a new familiar
    async createFamiliar(familiarData: CreateFamiliarData): Promise<Familiar> {
        try {
            const { data, error } = await supabase
                .from('familiar')
                .insert([familiarData])
                .select()
                .single()

            if (error) {
                throw new Error(`Error creating familiar: ${error.message}`)
            }

            return data as Familiar
        } catch (error) {
            console.error('Error in createFamiliar:', error)
            throw error
        }
    }

    // Update an existing familiar
    async updateFamiliar(familiarData: UpdateFamiliarData): Promise<Familiar> {
        try {
            const { id_familiar, ...updateData } = familiarData

            const { data, error } = await supabase
                .from('familiar')
                .update(updateData)
                .eq('id_familiar', id_familiar)
                .select()
                .single()

            if (error) {
                throw new Error(`Error updating familiar: ${error.message}`)
            }

            return data as Familiar
        } catch (error) {
            console.error('Error in updateFamiliar:', error)
            throw error
        }
    }

    // Delete a familiar
    async deleteFamiliar(id: number): Promise<void> {
        try {
            // First, delete all gastos (expenses) for this familiar
            const { error: gastosError } = await supabase
                .from('gasto')
                .delete()
                .eq('id_familiar', id)

            if (gastosError) {
                throw new Error(`Error deleting familiar expenses: ${gastosError.message}`)
            }

            // Second, delete all student relationships for this familiar
            const { error: relationshipError } = await supabase
                .from('alumnoxfamiliar')
                .delete()
                .eq('id_familiar', id)

            if (relationshipError) {
                throw new Error(`Error deleting familiar relationships: ${relationshipError.message}`)
            }

            // Finally, delete the familiar record
            const { error: familiarError } = await supabase
                .from('familiar')
                .delete()
                .eq('id_familiar', id)

            if (familiarError) {
                throw new Error(`Error deleting familiar: ${familiarError.message}`)
            }
        } catch (error) {
            console.error('Error in deleteFamiliar:', error)
            throw error
        }
    }

    // Get all gastos for a specific familiar
    async getGastosByFamiliar(id_familiar: number): Promise<Gasto[]> {
        try {
            const { data, error } = await supabase
                .from('gasto')
                .select('*')
                .eq('id_familiar', id_familiar)
                .order('nombre_gasto')

            if (error) {
                throw new Error(`Error fetching gastos: ${error.message}`)
            }

            return data as Gasto[]
        } catch (error) {
            console.error('Error in getGastosByFamiliar:', error)
            throw error
        }
    }

    // Get all gastos (for reference, not tied to any familiar)
    async getAllGastos(): Promise<Gasto[]> {
        try {
            const { data, error } = await supabase
                .from('gasto')
                .select('*')
                .order('nombre_gasto')

            if (error) {
                throw new Error(`Error fetching gastos: ${error.message}`)
            }

            return data as Gasto[]
        } catch (error) {
            console.error('Error in getAllGastos:', error)
            throw error
        }
    }

    // Create a new gasto
    async createGasto(gastoData: CreateGastoData): Promise<Gasto> {
        try {
            const { data, error } = await supabase
                .from('gasto')
                .insert([gastoData])
                .select()
                .single()

            if (error) {
                throw new Error(`Error creating gasto: ${error.message}`)
            }

            return data as Gasto
        } catch (error) {
            console.error('Error in createGasto:', error)
            throw error
        }
    }

    // Update an existing gasto
    async updateGasto(gastoData: UpdateGastoData): Promise<Gasto> {
        try {
            const { id_gasto, ...updateData } = gastoData

            const { data, error } = await supabase
                .from('gasto')
                .update(updateData)
                .eq('id_gasto', id_gasto)
                .select()
                .single()

            if (error) {
                throw new Error(`Error updating gasto: ${error.message}`)
            }

            return data as Gasto
        } catch (error) {
            console.error('Error in updateGasto:', error)
            throw error
        }
    }

    // Delete a gasto
    async deleteGasto(id: number): Promise<void> {
        try {
            const { error } = await supabase
                .from('gasto')
                .delete()
                .eq('id_gasto', id)

            if (error) {
                throw new Error(`Error deleting gasto: ${error.message}`)
            }
        } catch (error) {
            console.error('Error in deleteGasto:', error)
            throw error
        }
    }

    // Get students associated with a familiar
    async getStudentsByFamiliar(id_familiar: number) {
        try {
            const { data, error } = await supabase
                .from('alumno')
                .select('id_alumno, nombre_alumno')
                .eq('id_familiar', id_familiar)

            if (error) {
                throw new Error(`Error fetching students: ${error.message}`)
            }

            return data
        } catch (error) {
            console.error('Error in getStudentsByFamiliar:', error)
            throw error
        }
    }

    // Get dashboard statistics for familiares
    async getFamiliarStats(): Promise<FamiliarStats> {
        try {
            const [
                { count: totalFamiliares },
                { count: withIncome },
                { count: withExpenses },
                { data: incomeData },
                { data: recentFamiliares }
            ] = await Promise.all([
                // Total familiares
                supabase
                    .from('familiar')
                    .select('id_familiar', { count: 'exact', head: true }),

                // Familiares with income
                supabase
                    .from('familiar')
                    .select('id_familiar', { count: 'exact', head: true })
                    .not('ingreso_familiar', 'is', null)
                    .gt('ingreso_familiar', 0),

                // Get distinct familiares that have gastos
                supabase
                    .from('gasto')
                    .select('id_familiar', { count: 'exact', head: true }),

                // Average income calculation
                supabase
                    .from('familiar')
                    .select('ingreso_familiar')
                    .not('ingreso_familiar', 'is', null)
                    .gt('ingreso_familiar', 0),

                // Recent familiares (last 10)
                supabase
                    .from('familiar')
                    .select('id_familiar, nombre_familiar')
                    .order('id_familiar', { ascending: false })
                    .limit(10)
            ])

            // Calculate average income
            const validIncomes = incomeData?.filter(item => item.ingreso_familiar > 0) || []
            const averageIncome = validIncomes.length > 0
                ? validIncomes.reduce((sum, item) => sum + (item.ingreso_familiar || 0), 0) / validIncomes.length
                : 0

            return {
                totalFamiliares: totalFamiliares || 0,
                withIncome: withIncome || 0,
                withExpenses: withExpenses || 0,
                averageIncome: Math.round(averageIncome),
                uniqueRelationships: 0, // No longer tracking relationships at familiar level
                recentFamiliares: recentFamiliares || []
            }
        } catch (error) {
            console.error('Error in getFamiliarStats:', error)
            throw error
        }
    }
}

export const familiaresService = new FamiliaresService()
