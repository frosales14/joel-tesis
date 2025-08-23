import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, pdf } from '@react-pdf/renderer';
import type { AlumnoWithFamiliar } from '../types';

// Styles for the PDF document
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 30,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        textAlign: 'center',
        borderBottom: 2,
        borderBottomColor: '#2563eb',
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2563eb',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: '#64748b',
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: 10,
        textTransform: 'uppercase',
        borderBottom: 1,
        borderBottomColor: '#e5e7eb',
        paddingBottom: 5,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 8,
        paddingVertical: 4,
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#374151',
        width: '30%',
    },
    value: {
        fontSize: 12,
        color: '#1f2937',
        width: '70%',
    },
    noData: {
        fontSize: 12,
        color: '#9ca3af',
        fontStyle: 'italic',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        fontSize: 10,
        color: '#9ca3af',
        borderTop: 1,
        borderTopColor: '#e5e7eb',
        paddingTop: 10,
    },
    badge: {
        fontSize: 11,
        color: '#059669',
        backgroundColor: '#d1fae5',
        padding: '3 8',
        borderRadius: 4,
    },
    warningBadge: {
        fontSize: 11,
        color: '#dc2626',
        backgroundColor: '#fee2e2',
        padding: '3 8',
        borderRadius: 4,
    },
});

// PDF Document Component
const StudentReportDocument: React.FC<{ student: AlumnoWithFamiliar }> = ({ student }) => {
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'No especificada';
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getGradeText = (grado?: number) => {
        if (!grado) return 'No especificado';
        if (grado <= 5) return `${grado}° Primaria`;
        if (grado <= 11) return `${grado}° Bachillerato`;
        return `Grado ${grado}`;
    };

    const getStatusBadgeStyle = (situacion_actual?: string) => {
        if (!situacion_actual) return styles.noData;
        const status = situacion_actual.toLowerCase();
        if (status.includes('activo') || status.includes('estudiando')) {
            return styles.badge;
        } else if (status.includes('inactivo') || status.includes('retirado')) {
            return styles.warningBadge;
        }
        return styles.value;
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Reporte de Alumno</Text>
                    <Text style={styles.subtitle}>Sistema de Gestión Educativa</Text>
                </View>

                {/* Student Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Información Personal</Text>

                    <View style={styles.row}>
                        <Text style={styles.label}>Nombre Completo:</Text>
                        <Text style={styles.value}>{student.nombre_alumno || 'No especificado'}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Edad:</Text>
                        <Text style={styles.value}>
                            {student.edad_alumno ? `${student.edad_alumno} años` : 'No especificada'}
                        </Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Fecha de Nacimiento:</Text>
                        <Text style={styles.value}>{formatDate(student.fecha_nacimiento)}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>ID del Alumno:</Text>
                        <Text style={styles.value}>{student.id_alumno}</Text>
                    </View>
                </View>

                {/* Academic Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Información Académica</Text>

                    <View style={styles.row}>
                        <Text style={styles.label}>Grado Actual:</Text>
                        <Text style={styles.value}>{getGradeText(student.grado_alumno)}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Fecha de Ingreso:</Text>
                        <Text style={styles.value}>{formatDate(student.fecha_ingreso)}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Motivo de Ingreso:</Text>
                        <Text style={styles.value}>
                            {student.motivo_ingreso || 'No especificado'}
                        </Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Situación Actual:</Text>
                        <Text style={getStatusBadgeStyle(student.situacion_actual)}>
                            {student.situacion_actual || 'Sin información'}
                        </Text>
                    </View>
                </View>

                {/* Family Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Información Familiar</Text>

                    <View style={styles.row}>
                        <Text style={styles.label}>Situación Familiar:</Text>
                        <Text style={styles.value}>
                            {student.situacion_familiar || 'No especificada'}
                        </Text>
                    </View>

                    {student.familiares && student.familiares.length > 0 ? (
                        student.familiares.map((familiarRel, index) => {
                            const familiar = familiarRel.familiar;
                            if (!familiar) return null;

                            return (
                                <View key={familiar.id_familiar} style={styles.section}>
                                    <Text style={{ ...styles.sectionTitle, fontSize: 14, marginBottom: 8 }}>
                                        Familiar {index + 1}
                                    </Text>

                                    <View style={styles.row}>
                                        <Text style={styles.label}>Nombre:</Text>
                                        <Text style={styles.value}>{familiar.nombre_familiar}</Text>
                                    </View>

                                    {familiarRel.parentesco_familiar && (
                                        <View style={styles.row}>
                                            <Text style={styles.label}>Parentesco:</Text>
                                            <Text style={styles.value}>{familiarRel.parentesco_familiar}</Text>
                                        </View>
                                    )}

                                    {familiar.edad_familiar && (
                                        <View style={styles.row}>
                                            <Text style={styles.label}>Edad:</Text>
                                            <Text style={styles.value}>{familiar.edad_familiar} años</Text>
                                        </View>
                                    )}

                                    {familiar.ingreso_familiar && (
                                        <View style={styles.row}>
                                            <Text style={styles.label}>Ingreso Mensual:</Text>
                                            <Text style={styles.value}>
                                                L{familiar.ingreso_familiar.toLocaleString('es-ES')}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            );
                        })
                    ) : (
                        <View style={styles.row}>
                            <Text style={styles.label}>Familiares:</Text>
                            <Text style={styles.noData}>Sin familiares asignados</Text>
                        </View>
                    )}
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>
                        Reporte generado el {new Date().toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </Text>
                    <Text>Sistema de Gestión Educativa - Reporte de Alumno</Text>
                </View>
            </Page>
        </Document>
    );
};

// Function to generate and download PDF
export const generateStudentReport = async (student: AlumnoWithFamiliar) => {
    try {
        const doc = <StudentReportDocument student={student} />;
        const asPdf = pdf(doc);
        const blob = await asPdf.toBlob();

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `reporte_${student.nombre_alumno.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`;

        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up
        URL.revokeObjectURL(url);

        return true;
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Error al generar el reporte PDF');
    }
};

// Component for PDF Download Link (alternative approach)
export const StudentReportDownloadLink: React.FC<{
    student: AlumnoWithFamiliar;
    children: React.ReactNode;
    className?: string;
}> = ({ student, children, className }) => {
    const fileName = `reporte_${student.nombre_alumno.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`;

    return (
        <PDFDownloadLink
            document={<StudentReportDocument student={student} />}
            fileName={fileName}
            className={className}
        >
            {({ loading }) => (loading ? 'Generando PDF...' : children)}
        </PDFDownloadLink>
    );
};

export default StudentReportDocument;
