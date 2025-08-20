import { supabase } from '@/lib/supabase'
import type {
    Familiar,
    FamiliarWithGasto,
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
                    query = query.or(`nombre_familiar.ilike.%${filters.searchTerm}%,parentesco_familiar.ilike.%${filters.searchTerm}%`)
                }

                if (filters.parentesco) {
                    query = query.eq('parentesco_familiar', filters.parentesco)
                }

                if (filters.ingreso_min !== undefined) {
                    query = query.gte('ingreso_familiar', filters.ingreso_min)
                }

                if (filters.ingreso_max !== undefined) {
                    query = query.lte('ingreso_familiar', filters.ingreso_max)
                }

                if (filters.has_gasto !== undefined) {
                    if (filters.has_gasto) {
                        query = query.not('id_gasto', 'is', null)
                    } else {
                        query = query.is('id_gasto', null)
                    }
                }

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

            // Get data with pagination
            let dataQuery = supabase
                .from('familiar')
                .select(`
          *,
          gasto:id_gasto (
            id_gasto,
            nombre_gasto,
            cantidad_gasto
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
                familiares: data as FamiliarWithGasto[],
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
    async getFamiliarById(id: number): Promise<FamiliarWithGasto | null> {
        try {
            const { data, error } = await supabase
                .from('familiar')
                .select(`
          *,
          gasto:id_gasto (
            id_gasto,
            nombre_gasto,
            cantidad_gasto
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

            return data as FamiliarWithGasto
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
            const { error } = await supabase
                .from('familiar')
                .delete()
                .eq('id_familiar', id)

            if (error) {
                throw new Error(`Error deleting familiar: ${error.message}`)
            }
        } catch (error) {
            console.error('Error in deleteFamiliar:', error)
            throw error
        }
    }

    // Get all gastos
    async getGastos(): Promise<Gasto[]> {
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
            console.error('Error in getGastos:', error)
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
                { data: relationships },
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

                // Familiares with expenses
                supabase
                    .from('familiar')
                    .select('id_familiar', { count: 'exact', head: true })
                    .not('id_gasto', 'is', null),

                // Average income calculation
                supabase
                    .from('familiar')
                    .select('ingreso_familiar')
                    .not('ingreso_familiar', 'is', null)
                    .gt('ingreso_familiar', 0),

                // Unique relationships
                supabase
                    .from('familiar')
                    .select('parentesco_familiar')
                    .not('parentesco_familiar', 'is', null),

                // Recent familiares (last 10)
                supabase
                    .from('familiar')
                    .select('id_familiar, nombre_familiar, parentesco_familiar')
                    .order('id_familiar', { ascending: false })
                    .limit(10)
            ])

            // Calculate average income
            const validIncomes = incomeData?.filter(item => item.ingreso_familiar > 0) || []
            const averageIncome = validIncomes.length > 0
                ? validIncomes.reduce((sum, item) => sum + (item.ingreso_familiar || 0), 0) / validIncomes.length
                : 0

            // Count unique relationships
            const uniqueRelationships = new Set(
                relationships?.map(r => r.parentesco_familiar?.toLowerCase().trim()).filter(Boolean)
            ).size

            return {
                totalFamiliares: totalFamiliares || 0,
                withIncome: withIncome || 0,
                withExpenses: withExpenses || 0,
                averageIncome: Math.round(averageIncome),
                uniqueRelationships,
                recentFamiliares: recentFamiliares || []
            }
        } catch (error) {
            console.error('Error in getFamiliarStats:', error)
            throw error
        }
    }

    // Get relationships for filters/dropdowns
    async getUniqueRelationships(): Promise<string[]> {
        try {
            const { data, error } = await supabase
                .from('familiar')
                .select('parentesco_familiar')
                .not('parentesco_familiar', 'is', null)

            if (error) {
                throw new Error(`Error fetching relationships: ${error.message}`)
            }

            const relationships = [...new Set(
                data?.map(item => item.parentesco_familiar?.trim()).filter(Boolean) || []
            )].sort()

            return relationships
        } catch (error) {
            console.error('Error in getUniqueRelationships:', error)
            throw error
        }
    }
}

export const familiaresService = new FamiliaresService()
