import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GradosPage() {
    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Grados</h1>
                <p className="text-gray-600 mt-2">Gestión de grados académicos</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lista de Grados</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500">Contenido de grados próximamente...</p>
                </CardContent>
            </Card>
        </div>
    );
}
