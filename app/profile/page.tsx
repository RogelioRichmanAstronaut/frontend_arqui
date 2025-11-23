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
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">{t("Perfil", "Profile")}</h3>
                <p className="text-sm text-muted-foreground">
                    {t(
                        "Actualiza tu información personal.",
                        "Update your personal information."
                    )}
                </p>
            </div>
            <Separator />
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="names">{t("Nombres", "Names")}</Label>
                        <Input
                            id="names"
                            name="names"
                            value={formData.names}
                            onChange={handleChange}
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">{t("Correo Electrónico", "Email")}</Label>
                        <Input
                            id="email"
                            name="email"
                            value={formData.email}
                            disabled
                            className="bg-muted"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="country">{t("País / Ciudad", "Country / City")}</Label>
                        <Input
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="Colombia, Bogotá"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">{t("Teléfono", "Phone")}</Label>
                        <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+57 300 123 4567"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="idNumber">{t("Número de Identificación", "ID Number")}</Label>
                        <Input
                            id="idNumber"
                            name="idNumber"
                            value={formData.idNumber}
                            onChange={handleChange}
                            placeholder="1234567890"
                        />
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button type="submit" className="bg-[#00C2A8] hover:bg-[#00A08A] text-white">
                        {t("Guardar Cambios", "Save Changes")}
                    </Button>
                </div>
            </form>
        </div>
    );
}
