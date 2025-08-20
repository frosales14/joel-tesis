import { supabase } from '@/lib/supabase'
import type {
    Alumno,
    AlumnoWithFamiliar,
    CreateAlumnoData,
    UpdateAlumnoData,
    Familiar,
    CreateFamiliarData,
    UpdateFamiliarData,
    StudentFilters,
    StudentsResponse
} from '../types'

class StudentService {
    // Get all students with optional filters and pagination
    async getStudents(
        filters: StudentFilters = {},
        page: number = 1,
        pageSize: number = 10
    ): Promise<StudentsResponse> {
        try {
            // Helper function to apply filters to a query
            const applyFilters = (query: any) => {
                if (filters.searchTerm) {
                    query = query.or(`nombre_alumno.ilike.%${filters.searchTerm}%,situacion_actual.ilike.%${filters.searchTerm}%`)
                }

                if (filters.grado) {
                    query = query.eq('grado_alumno', filters.grado)
                }

                if (filters.situacion_actual) {
                    query = query.eq('situacion_actual', filters.situacion_actual)
                }

                if (filters.edad_min) {
                    query = query.gte('edad_alumno', filters.edad_min)
                }

                if (filters.edad_max) {
                    query = query.lte('edad_alumno', filters.edad_max)
                }

                if (filters.fecha_ingreso_desde) {
                    query = query.gte('fecha_ingreso', filters.fecha_ingreso_desde)
                }

                if (filters.fecha_ingreso_hasta) {
                    query = query.lte('fecha_ingreso', filters.fecha_ingreso_hasta)
                }

                return query
            }

            // Get total count with a separate query
            let countQuery = supabase
                .from('alumno')
                .select('*', { count: 'exact', head: true })

            countQuery = applyFilters(countQuery)
            const { count, error: countError } = await countQuery

            if (countError) {
                throw new Error(`Error getting count: ${countError.message}`)
            }

            // Get data with pagination
            let dataQuery = supabase
                .from('alumno')
                .select(`
          *,
          familiar:id_familiar (
            id_familiar,
            nombre_familiar,
            edad_familiar,
            parentesco_familiar,
            ingreso_familiar
          )
        `)

            dataQuery = applyFilters(dataQuery)

            const { data, error } = await dataQuery
                .range((page - 1) * pageSize, page * pageSize - 1)
                .order('fecha_ingreso', { ascending: false })

            if (error) {
                throw new Error(`Error fetching students: ${error.message}`)
            }

            return {
                students: data as AlumnoWithFamiliar[],
                total: count || 0,
                page,
                pageSize
            }
        } catch (error) {
            console.error('Error in getStudents:', error)
            throw error
        }
    }

    // Get a single student by ID with all related familiares
    async getStudentById(id: number): Promise<AlumnoWithFamiliar | null> {
        try {
            // Get the student with primary familiar
            const { data: studentData, error: studentError } = await supabase
                .from('alumno')
                .select(`
                    *,
                    familiar:id_familiar (
                        id_familiar,
                        nombre_familiar,
                        edad_familiar,
                        parentesco_familiar,
                        ingreso_familiar,
                        gastos:gasto (
                            id_gasto,
                            nombre_gasto,
                            cantidad_gasto,
                            id_familiar
                        )
                    )
                `)
                .eq('id_alumno', id)
                .single()

            if (studentError) {
                if (studentError.code === 'PGRST116') {
                    return null // Student not found
                }
                throw new Error(`Error fetching student: ${studentError.message}`)
            }

            // Get all familiares associated with this student through alumnoxfamiliar
            const { data: familiaresData, error: familiaresError } = await supabase
                .from('alumnoxfamiliar')
                .select(`
                    familiar:id_familiar (
                        id_familiar,
                        nombre_familiar,
                        edad_familiar,
                        parentesco_familiar,
                        ingreso_familiar,
                        gastos:gasto (
                            id_gasto,
                            nombre_gasto,
                            cantidad_gasto,
                            id_familiar
                        )
                    )
                `)
                .eq('id_alumno', id)

            if (familiaresError) {
                console.warn('Error fetching familiares for student:', familiaresError.message)
            }

            // Combine the data
            const student = studentData as AlumnoWithFamiliar
            if (familiaresData && familiaresData.length > 0) {
                student.familiares = familiaresData
                    .map((rel: any) => rel.familiar)
                    .filter((f: any) => f !== null && f !== undefined) as Familiar[]
            }

            return student
        } catch (error) {
            console.error('Error in getStudentById:', error)
            throw error
        }
    }

    // Create a new student with multiple familiares
    async createStudent(studentData: CreateAlumnoData): Promise<Alumno> {
        try {
            // Extract familiares_ids from the data
            const { familiares_ids, ...alumnoData } = studentData

            // Create the student first
            const { data: studentResult, error: studentError } = await supabase
                .from('alumno')
                .insert([alumnoData])
                .select()
                .single()

            if (studentError) {
                throw new Error(`Error creating student: ${studentError.message}`)
            }

            const createdStudent = studentResult as Alumno

            // If there are familiares to associate, create the relationships
            if (familiares_ids && familiares_ids.length > 0) {
                await this.associateFamiliaresToStudent(createdStudent.id_alumno, familiares_ids)
            }

            return createdStudent
        } catch (error) {
            console.error('Error in createStudent:', error)
            throw error
        }
    }

    // Associate multiple familiares to a student
    async associateFamiliaresToStudent(id_alumno: number, familiares_ids: number[]): Promise<void> {
        try {
            // Create entries in the alumnoxfamiliar table
            const relationshipData = familiares_ids.map(id_familiar => ({
                id_alumno,
                id_familiar
            }))

            const { error } = await supabase
                .from('alumnoxfamiliar')
                .insert(relationshipData)

            if (error) {
                throw new Error(`Error associating familiares to student: ${error.message}`)
            }
        } catch (error) {
            console.error('Error in associateFamiliaresToStudent:', error)
            throw error
        }
    }

    // Remove familiares from a student
    async removeFamiliaresFromStudent(id_alumno: number, familiares_ids?: number[]): Promise<void> {
        try {
            let query = supabase
                .from('alumnoxfamiliar')
                .delete()
                .eq('id_alumno', id_alumno)

            if (familiares_ids && familiares_ids.length > 0) {
                query = query.in('id_familiar', familiares_ids)
            }

            const { error } = await query

            if (error) {
                throw new Error(`Error removing familiares from student: ${error.message}`)
            }
        } catch (error) {
            console.error('Error in removeFamiliaresFromStudent:', error)
            throw error
        }
    }

    // Update an existing student with familiares
    async updateStudent(studentData: UpdateAlumnoData): Promise<Alumno> {
        try {
            const { id_alumno, familiares_ids, ...updateData } = studentData

            // Update the student basic information
            const { data, error } = await supabase
                .from('alumno')
                .update(updateData)
                .eq('id_alumno', id_alumno)
                .select()
                .single()

            if (error) {
                throw new Error(`Error updating student: ${error.message}`)
            }

            // If familiares_ids are provided, update the relationships
            if (familiares_ids !== undefined) {
                // Remove all existing relationships
                await this.removeFamiliaresFromStudent(id_alumno)

                // Add new relationships
                if (familiares_ids.length > 0) {
                    await this.associateFamiliaresToStudent(id_alumno, familiares_ids)
                }
            }

            return data as Alumno
        } catch (error) {
            console.error('Error in updateStudent:', error)
            throw error
        }
    }

    // Delete a student
    async deleteStudent(id: number): Promise<void> {
        try {
            const { error } = await supabase
                .from('alumno')
                .delete()
                .eq('id_alumno', id)

            if (error) {
                throw new Error(`Error deleting student: ${error.message}`)
            }
        } catch (error) {
            console.error('Error in deleteStudent:', error)
            throw error
        }
    }

    // Get all family members
    async getFamiliares(): Promise<Familiar[]> {
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
                .order('nombre_familiar')

            if (error) {
                throw new Error(`Error fetching familiares: ${error.message}`)
            }

            return data as Familiar[]
        } catch (error) {
            console.error('Error in getFamiliares:', error)
            throw error
        }
    }

    // Create a new family member
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

    // Update an existing family member
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

    // Delete a family member
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

    // Associate a student with multiple family members
    async associateStudentWithFamiliar(id_alumno: number, id_familiar: number): Promise<void> {
        try {
            const { error } = await supabase
                .from('alumnoxfamiliar')
                .insert([{ id_alumno, id_familiar }])

            if (error) {
                throw new Error(`Error associating student with familiar: ${error.message}`)
            }
        } catch (error) {
            console.error('Error in associateStudentWithFamiliar:', error)
            throw error
        }
    }

    // Remove association between student and family member
    async removeStudentFamiliarAssociation(id_alumno: number, id_familiar: number): Promise<void> {
        try {
            const { error } = await supabase
                .from('alumnoxfamiliar')
                .delete()
                .eq('id_alumno', id_alumno)
                .eq('id_familiar', id_familiar)

            if (error) {
                throw new Error(`Error removing student-familiar association: ${error.message}`)
            }
        } catch (error) {
            console.error('Error in removeStudentFamiliarAssociation:', error)
            throw error
        }
    }

    // Get dashboard statistics
    async getStudentStats() {
        try {
            const [
                { count: totalStudents },
                { count: activeStudents },
                { data: recentStudents },
                { data: gradeDistribution }
            ] = await Promise.all([
                // Total students
                supabase
                    .from('alumno')
                    .select('id_alumno', { count: 'exact', head: true }),

                // Active students (assuming 'Activo' means currently enrolled)
                supabase
                    .from('alumno')
                    .select('id_alumno', { count: 'exact', head: true })
                    .eq('situacion_actual', 'Activo'),

                // Recent students (last 30 days)
                supabase
                    .from('alumno')
                    .select('id_alumno, nombre_alumno, fecha_ingreso')
                    .gte('fecha_ingreso', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
                    .order('fecha_ingreso', { ascending: false }),

                // Grade distribution
                supabase
                    .from('alumno')
                    .select('grado_alumno')
                    .not('grado_alumno', 'is', null)
            ])

            // Count unique grades
            const grades = new Set(gradeDistribution?.map(s => s.grado_alumno))

            return {
                totalStudents: totalStudents || 0,
                activeStudents: activeStudents || 0,
                recentStudents: recentStudents?.length || 0,
                uniqueGrades: grades.size || 0,
                recentStudentsList: recentStudents || []
            }
        } catch (error) {
            console.error('Error in getStudentStats:', error)
            throw error
        }
    }

    // Get all familiares for selection in forms
    async getAllFamiliares(): Promise<Familiar[]> {
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
                .order('nombre_familiar')

            if (error) {
                throw new Error(`Error fetching familiares: ${error.message}`)
            }

            return data as Familiar[]
        } catch (error) {
            console.error('Error in getAllFamiliares:', error)
            throw error
        }
    }
}

export const studentService = new StudentService()
