"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { useLanguageStore } from "@/lib/store";
import { Button } from "@/components/(ui)/button";
import { Input } from "@/components/(ui)/input";
import { Label } from "@/components/(ui)/label";
import { Separator } from "@/components/(ui)/separator";
import { toast } from "sonner";
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { useMyClient, useUpdateMyClient } from "@/lib/hooks/useProfile";

const queryClient = new QueryClient();

function ProfileContent() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { user, updateUser: updateLocal, hasCompleteProfile, setClientId } = useAuthStore();
    const { locale } = useLanguageStore();
    const t = (es: string, en: string) => (locale === "es" ? es : en);

    // Usar el nuevo endpoint /clients/me
    const { data: clientData, isLoading: loadingClient } = useMyClient();

    // Guardar el clientId cuando se obtiene del backend
    useEffect(() => {
        if (clientData?.clientId) {
            setClientId(clientData.clientId);

            // Actualizar el estado local si el cliente tiene datos
            if (clientData.name && clientData.phone && !hasCompleteProfile()) {
                updateLocal({
                    names: clientData.name,
                    phone: clientData.phone,
                    idNumber: clientData.clientId?.replace('CC-', '') || '',
                });
            }
        }
    }, [clientData, hasCompleteProfile, updateLocal, setClientId]);

    // Redirect to complete profile if incomplete (solo si NO está cargando)
    useEffect(() => {
        if (!loadingClient && user && !hasCompleteProfile() && !clientData) {
            console.log('⚠️ Perfil incompleto, redirigiendo a complete-profile');
            router.push('/profile/complete');
        }
    }, [user, hasCompleteProfile, router, loadingClient, clientData]);

    // Usar el nuevo hook que actualiza el cliente autenticado directamente
    const updateClientMutation = useUpdateMyClient();

    const [formData, setFormData] = useState({
        names: "",
        email: "",
        country: "",
        phone: "",
        idNumber: "",
        documentType: "CC" as 'CC' | 'TI' | 'PASS',
    });

    useEffect(() => {
        if (clientData) {
            setFormData({
                names: clientData.name || "",
                email: clientData.email || "",
                country: "",
                phone: clientData.phone || "",
                idNumber: clientData.clientId || "",
                documentType: clientData.documentType || "CC",
            });
        } else if (user) {
            setFormData({
                names: user.names || "",
                email: user.email || "",
                country: user.country || "",
                phone: user.phone || "",
                idNumber: user.idNumber || "",
                documentType: user.documentType || "CC",
            });
        }
    }, [clientData, user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Actualizar usando el endpoint /clients/me que no requiere ID
            await updateClientMutation.mutateAsync({
                name: formData.names,
                email: formData.email,
                phone: formData.phone,
                address: formData.country,
            } as any);
            updateLocal(formData);
            toast.success(t("Perfil actualizado correctamente", "Profile updated successfully"));
        } catch (error: any) {
            console.error('Error al actualizar perfil:', error);
            toast.error(error?.message || t("Error al actualizar perfil", "Error updating profile"));
        }
    };

    return (
        <div className="space-y-10">
            <div>
                <h3 className="text-2xl font-bold text-[#0A2540]">{t("Perfil", "Profile")}</h3>
                <p className="text-gray-500 mt-2">
                    {t(
                        "Actualiza tu información personal.",
                        "Update your personal information."
                    )}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
                    <div className="space-y-3">
                        <Label htmlFor="names" className="text-base font-medium text-[#0A2540]">{t("Nombres", "Names")}</Label>
                        <Input
                            id="names"
                            name="names"
                            value={formData.names}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="h-12 px-4 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        />
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="email" className="text-base font-medium text-[#0A2540]">{t("Correo Electrónico", "Email")}</Label>
                        <Input
                            id="email"
                            name="email"
                            value={formData.email}
                            disabled
                            className="h-12 px-4 bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
                        />
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="country" className="text-base font-medium text-[#0A2540]">{t("País / Ciudad", "Country / City")}</Label>
                        <Input
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="Colombia, Bogotá"
                            className="h-12 px-4 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        />
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="phone" className="text-base font-medium text-[#0A2540]">{t("Teléfono", "Phone")}</Label>
                        <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+57 300 123 4567"
                            className="h-12 px-4 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        />
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="documentType" className="text-base font-medium text-[#0A2540]">{t("Tipo de Documento", "Document Type")}</Label>
                        <select
                            id="documentType"
                            name="documentType"
                            value={formData.documentType}
                            onChange={(e) => setFormData(prev => ({ ...prev, documentType: e.target.value as 'CC' | 'TI' | 'PASS' }))}
                            className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:border-[#00C2A8] focus:ring-1 focus:ring-[#00C2A8] transition-colors w-full"
                        >
                            <option value="CC">CC - {t("Cédula de Ciudadanía", "Citizenship Card")}</option>
                            <option value="TI">TI - {t("Tarjeta de Identidad", "Identity Card")}</option>
                            <option value="PASS">PASS - {t("Pasaporte", "Passport")}</option>
                        </select>
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="idNumber" className="text-base font-medium text-[#0A2540]">{t("Número de Identificación", "ID Number")}</Label>
                        <Input
                            id="idNumber"
                            name="idNumber"
                            value={formData.idNumber}
                            onChange={handleChange}
                            placeholder="1234567890"
                            className="h-12 px-4 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        className="h-12 px-8 bg-[#00C2A8] hover:bg-[#00C2A8]/90 text-white font-semibold text-lg shadow-md hover:shadow-lg transition-all"
                        disabled={updateClientMutation.isPending || loadingClient}
                    >
                        {updateClientMutation.isPending
                            ? t("Guardando...", "Saving...")
                            : t("Guardar Cambios", "Save Changes")}
                    </Button>
                </div>
            </form>

            {loadingClient && (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00C2A8] mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-500">{t("Cargando perfil...", "Loading profile...")}</p>
                </div>
            )}
        </div>
    );
}

export default function ProfilePage() {
    return (
        <QueryClientProvider client={queryClient}>
            <ProfileContent />
        </QueryClientProvider>
    );
}
