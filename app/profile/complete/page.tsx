"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/(ui)/button";
import { Input } from "@/components/(ui)/input";
import { Label } from "@/components/(ui)/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/(ui)/card";
import { useLanguageStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth-store";
import { clients } from "@/lib/api/clients";
import { toast } from "sonner";

export default function CompleteProfilePage() {
    const router = useRouter();
    const { locale } = useLanguageStore();
    const { updateUser, hasCompleteProfile, user, setClientId } = useAuthStore();
    const t = (es: string, en: string) => (locale === "es" ? es : en);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCheckingProfile, setIsCheckingProfile] = useState(true);

    // Check if user already has a complete profile in backend (solo una vez)
    useEffect(() => {
        const checkProfile = async () => {
            try {
                const client = await clients.getMe();
                console.log('✅ Cliente existente encontrado:', client);
                
                // Si el cliente tiene nombre y teléfono, el perfil está completo
                if (client && client.name && client.phone) {
                    console.log('✅ Perfil completo, redirigiendo...');
                    
                    // Guardar clientId en el store
                    if (client.clientId) {
                        setClientId(client.clientId);
                    }
                    
                    // Actualizar el estado local con los datos del backend
                    updateUser({
                        names: client.name,
                        phone: client.phone,
                        idNumber: client.clientId?.replace('CC-', '') || '',
                        country: '', // Agregar country vacío para completar el perfil
                    });
                    router.push('/profile');
                    return;
                }
            } catch (error) {
                console.log('ℹ️ No hay cliente existente, mostrar formulario');
            }
            setIsCheckingProfile(false);
        };
        
        checkProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Solo ejecutar una vez al montar

    const [formData, setFormData] = useState({
        names: "",
        country: "",
        phone: "",
        idNumber: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (!formData.names || !formData.country || !formData.phone || !formData.idNumber) {
            toast.error(t("Por favor completa todos los campos", "Please complete all fields"));
            return;
        }

        setIsSubmitting(true);
        console.log('📝 Enviando formulario:', formData);
        
        try {
            const newClientId = `CC-${formData.idNumber}`;
            
            // Intentar obtener el cliente existente usando /clients/me
            let existingClient = null;
            try {
                existingClient = await clients.getMe();
                console.log('👤 Cliente existente:', existingClient);
            } catch (e) {
                console.log('➕ No hay cliente, se creará uno nuevo');
            }
            
            if (existingClient) {
                // Cliente ya existe, actualizar con el ID del backend
                console.log('🔄 Actualizando cliente:', existingClient.id);
                const updatedClient = await clients.update(existingClient.id, {
                    name: formData.names,
                    phone: formData.phone,
                    clientId: newClientId,
                });
                console.log('✅ Cliente actualizado:', updatedClient);
                setClientId(newClientId);
                toast.success(t("Perfil actualizado exitosamente", "Profile updated successfully"));
            } else {
                // Cliente no existe, intentar crear
                try {
                    console.log('➕ Creando nuevo cliente');
                    const newClient = await clients.create({
                        clientId: newClientId,
                        name: formData.names,
                        email: user?.email || '',
                        phone: formData.phone,
                    });
                    console.log('✅ Cliente creado:', newClient);
                    setClientId(newClientId);
                    toast.success(t("Perfil creado exitosamente", "Profile created successfully"));
                } catch (createError: any) {
                    console.error('❌ Error al crear:', createError);
                    // Si falla (409/400), significa que el cliente ya existe
                    if (createError?.status === 409 || createError?.status === 400) {
                        console.log('🔄 Cliente ya existe, intentando actualizar...');
                        const client = await clients.getMe();
                        if (!client) {
                            throw new Error('No se pudo obtener información del cliente');
                        }
                        const updatedClient = await clients.update(client.id, {
                            name: formData.names,
                            phone: formData.phone,
                            clientId: newClientId,
                        });
                        console.log('✅ Cliente actualizado:', updatedClient);
                        setClientId(newClientId);
                        toast.success(t("Perfil actualizado exitosamente", "Profile updated successfully"));
                    } else {
                        throw createError;
                    }
                }
            }

            // Update local user state - IMPORTANTE para que hasCompleteProfile() funcione
            console.log('💾 Actualizando estado local con:', formData);
            updateUser(formData);
            
            // Pequeña espera para asegurar que el estado se actualice
            await new Promise(resolve => setTimeout(resolve, 100));
            
            console.log('✅ Perfil completado, redirigiendo...');
            router.push("/profile");
        } catch (error: any) {
            console.error('❌ Error en handleSubmit:', error);
            toast.error(error?.message || t("Error al guardar perfil", "Error saving profile"));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isCheckingProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C2A8] mx-auto mb-4"></div>
                    <p className="text-gray-600">{t("Verificando perfil...", "Checking profile...")}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-[#0A2540]">
                        {t("Completa tu perfil", "Complete your profile")}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {t("Necesitamos algunos datos adicionales para continuar", "We need some additional details to continue")}
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="names">{t("Nombres y Apellidos", "Full Name")}</Label>
                            <Input id="names" value={formData.names} onChange={handleChange} placeholder="Juan Pérez" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country">{t("País o Ciudad de Residencia", "Country/City of Residence")}</Label>
                            <Input id="country" value={formData.country} onChange={handleChange} placeholder="Colombia, Bogotá" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">{t("Número de Celular", "Phone Number")}</Label>
                            <Input id="phone" value={formData.phone} onChange={handleChange} placeholder="+57 300 123 4567" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="idNumber">{t("Número de Cédula", "ID Number")}</Label>
                            <Input id="idNumber" value={formData.idNumber} onChange={handleChange} placeholder="1234567890" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button 
                            type="submit" 
                            className="w-full bg-[#00C2A8] hover:bg-[#00C2A8]/90 text-white"
                            disabled={isSubmitting}
                        >
                            {isSubmitting 
                                ? t("Guardando...", "Saving...") 
                                : t("Guardar y Continuar", "Save and Continue")}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
