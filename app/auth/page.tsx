"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Globe } from "lucide-react";
import { Button } from "@/components/(ui)/button";
import { Input } from "@/components/(ui)/input";
import { Label } from "@/components/(ui)/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/(ui)/card";
import { useLanguageStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth-store";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/(ui)/dropdown-menu";

export default function AuthPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { locale, setLocale } = useLanguageStore();
    const { login } = useAuthStore();

    const t = (es: string, en: string) => (locale === "es" ? es : en);

    const toggleMode = () => setIsLogin(!isLogin);

    const handleAuth = () => {
        // Basic validation
        if (!email || !password) {
            return;
        }

        // Simulate auth
        login(email);

        // Redirect to profile completion
        router.push("/profile/complete");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="absolute top-4 right-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-2">
                            <Globe className="h-4 w-4" />
                            {locale.toUpperCase()}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setLocale("es")}>
                            Español
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLocale("en")}>
                            English
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-[#0A2540]">
                        {isLogin ? t("Iniciar Sesión", "Welcome Back") : t("Crear Cuenta", "Create Account")}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {isLogin
                            ? t("Ingresa tus credenciales para continuar", "Enter your credentials to continue")
                            : t("Ingresa tus datos para registrarte", "Enter your details to register")}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">{t("Correo Electrónico", "Email")}</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">{t("Contraseña", "Password")}</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-500" />
                                ) : (
                                    <Eye className="h-4 w-4 text-gray-500" />
                                )}
                            </Button>
                        </div>
                    </div>
                    <AnimatePresence>
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-2 overflow-hidden"
                            >
                                <Label htmlFor="confirm-password">{t("Confirmar Contraseña", "Confirm Password")}</Label>
                                <Input id="confirm-password" type="password" placeholder="••••••••" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button
                        className="w-full bg-[#00C2A8] hover:bg-[#00C2A8]/90 text-white"
                        onClick={handleAuth}
                    >
                        {isLogin ? t("Ingresar", "Sign In") : t("Registrarse", "Sign Up")}
                    </Button>
                    <div className="text-center text-sm text-gray-500">
                        {isLogin ? t("¿No tienes una cuenta?", "Don't have an account?") : t("¿Ya tienes una cuenta?", "Already have an account?")}{" "}
                        <button
                            onClick={toggleMode}
                            className="text-[#00C2A8] hover:underline font-semibold"
                        >
                            {isLogin ? t("Regístrate", "Sign up") : t("Inicia sesión", "Log in")}
                        </button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
