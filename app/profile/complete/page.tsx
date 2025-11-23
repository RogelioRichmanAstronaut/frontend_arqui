"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/(ui)/button";
import { Input } from "@/components/(ui)/input";
import { Label } from "@/components/(ui)/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/(ui)/card";
import { useLanguageStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth-store";

export default function CompleteProfilePage() {
    const router = useRouter();
    const { locale } = useLanguageStore();
    const { updateUser } = useAuthStore();
    const t = (es: string, en: string) => (locale === "es" ? es : en);

    const [formData, setFormData] = useState({
        names: "",
        country: "",
        phone: "",
        idNumber: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (!formData.names || !formData.country || !formData.phone || !formData.idNumber) {
            alert(t("Por favor completa todos los campos", "Please complete all fields"));
            return;
        }

        updateUser(formData);
        router.push("/");
    };

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
                        <Button type="submit" className="w-full bg-[#00C2A8] hover:bg-[#00C2A8]/90 text-white">
                            {t("Guardar y Continuar", "Save and Continue")}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
