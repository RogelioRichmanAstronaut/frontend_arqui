"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { useAuth } from "@/lib/context/AuthProvider";
import { toast } from "sonner";

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setToken } = useAuth();
    const { login: loginStore } = useAuthStore();

    useEffect(() => {
        const token = searchParams.get('token');
        const email = searchParams.get('email');

        if (token && email) {
            // Guardar token
            setToken(token);
            if (typeof window !== 'undefined') {
                localStorage.setItem('auth_token', token);
            }
            
            // Guardar usuario en el store
            loginStore(email);
            
            toast.success("Sesión iniciada con Google");
            router.push("/profile");
        } else {
            toast.error("Error al iniciar sesión con Google");
            router.push("/auth");
        }
    }, [searchParams, setToken, loginStore, router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C2A8] mx-auto"></div>
                <p className="mt-4 text-gray-600">Procesando autenticación...</p>
            </div>
        </div>
    );
}

