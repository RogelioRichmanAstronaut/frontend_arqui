"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { useLanguageStore } from "@/lib/store";
import { Button } from "@/components/(ui)/button";
import { Input } from "@/components/(ui)/input";
import { Label } from "@/components/(ui)/label";
import { Separator } from "@/components/(ui)/separator";
import { toast } from "sonner";

export default function ProfilePage() {
    const { user, updateUser } = useAuthStore();
    const { locale } = useLanguageStore();
    const t = (es: string, en: string) => (locale === "es" ? es : en);

    const [formData, setFormData] = useState({
        names: "",
        email: "",
        country: "",
        phone: "",
        idNumber: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                names: user.names || "",
                email: user.email || "",
                country: user.country || "",
                phone: user.phone || "",
                idNumber: user.idNumber || "",
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser(formData);
        toast.success(t("Perfil actualizado correctamente", "Profile updated successfully"));
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
                    >
                        {t("Guardar Cambios", "Save Changes")}
                    </Button>
                </div>
            </form>
        </div>
    );
}
