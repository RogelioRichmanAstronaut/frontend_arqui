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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLogin, useRegister } from "@/lib/hooks/useAuth";
import { toast } from "sonner";

const queryClient = new QueryClient();

function AuthForm() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const { locale, setLocale } = useLanguageStore();
    const { login: loginLocal } = useAuthStore();
    const loginMutation = useLogin();
    const registerMutation = useRegister();

    const t = (es: string, en: string) => (locale === "es" ? es : en);

    const toggleMode = () => setIsLogin(!isLogin);

    const handleGoogleAuth = async () => {
        try {
            // Redirigir al endpoint de Google OAuth del backend
            const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/v1';
            const googleAuthUrl = `${BACKEND}/auth/google`;

            // Redirigir a Google OAuth
            window.location.href = googleAuthUrl;
        } catch (error: any) {
            toast.error(error?.message || t("Error al iniciar sesión con Google", "Error signing in with Google"));
        }
    };

    const handleAuth = async () => {
        if (!email || !password) {
            toast.error(t("Por favor completa todos los campos", "Please fill all fields"));
            return;
        }

        if (!isLogin) {
            if (password !== confirmPassword) {
                toast.error(t("Las contraseñas no coinciden", "Passwords do not match"));
                return;
            }
            if (password.length < 6) {
                toast.error(t("La contraseña debe tener al menos 6 caracteres", "Password must be at least 6 characters"));
                return;
            }
        }

        try {
            if (isLogin) {
                try {
                    const result = await loginMutation.mutateAsync({ email, password });
                    // loginLocal se llama automáticamente en useLogin onSuccess
                    toast.success(t("Sesión iniciada", "Logged in successfully"));
                    router.push("/profile");
                } catch (apiError: any) {

                    const DEFAULT_EMAIL = "demo@tripin.com";
                    const DEFAULT_PASSWORD = "demo123";

                    if (email === DEFAULT_EMAIL && password === DEFAULT_PASSWORD) {
                        // Login offline con usuario demo
                        loginLocal(email);
                        toast.success(t("Sesión iniciada (modo offline)", "Logged in (offline mode)"));
                        router.push("/profile");
                    } else {
                        // Si no son las credenciales demo, mostrar el error original
                        throw apiError;
                    }
                }
            } else {
                await registerMutation.mutateAsync({
                    email,
                    password,
                    name: email.split('@')[0],
                    role: 'EMPLOYEE'
                });
                toast.success(t("Cuenta creada exitosamente", "Account created successfully"));

                // Login automático después del registro
                try {
                    await loginMutation.mutateAsync({ email, password });
                    // loginLocal se llama automáticamente en useLogin onSuccess
                    toast.success(t("Sesión iniciada automáticamente", "Automatically logged in"));
                    router.push("/profile");
                } catch (loginError: any) {
                    // Si el login automático falla, solo cambiar a modo login
                    toast.error(t("Cuenta creada, por favor inicia sesión", "Account created, please log in"));
                    setIsLogin(true);
                    setPassword("");
                    setConfirmPassword("");
                }
            }
        } catch (error: any) {
            toast.error(error?.message || t("Error en la autenticación", "Authentication error"));
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster="/images/cards/tripa.jpg"
                >
                    <source src="/videos/authe-video.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-900/60" />
            </div>



            {/* Main Content */}
            <div className="container mx-auto px-4 lg:px-8 z-10 relative w-full h-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">

                {/* Welcome Text */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex-1 text-white max-w-2xl"
                >
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight tracking-wide">
                        {t("ENCANTADOS DE VERTE POR AQUÍ!", "WE ARE DELIGHTED TO SEE YOU HERE!")}
                    </h1>
                </motion.div>

                {/* Right Side - Login Form */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="w-full max-w-md"
                >
                    <Card className="w-full shadow-2xl bg-white border-0 rounded-none">
                        <CardHeader className="space-y-1 text-center pb-2">
                            <CardTitle className="text-2xl font-bold text-[#0A2540]">
                                {isLogin ? t("Iniciar Sesión", "Log In") : t("Crear Cuenta", "Create Account")}
                            </CardTitle>
                            <CardDescription className="text-gray-500">
                                {isLogin
                                    ? t("Ingresa tus credenciales para continuar", "Enter your credentials to continue")
                                    : t("Ingresa tus datos para registrarte", "Enter your details to register")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* Google Button */}
                            <Button
                                variant="outline"
                                className="w-full h-12 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 flex items-center justify-center gap-3"
                                onClick={handleGoogleAuth}
                                disabled={loginMutation.isPending || registerMutation.isPending}
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                {t("Continuar con Google", "Continue with Google")}
                            </Button>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="font-semibold text-gray-700">{t("Correo Electrónico", "Email")}</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="font-semibold text-gray-700">{t("Contraseña", "Password")}</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors pr-10"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-600"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
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
                                            <Label htmlFor="confirm-password" className="font-semibold text-gray-700">{t("Confirmar Contraseña", "Confirm Password")}</Label>
                                            <div className="relative">
                                                <Input
                                                    id="confirm-password"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors pr-10"
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-600"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    type="button"
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-6 pb-8">
                            <Button
                                className="w-full h-12 bg-[#00C2A8] hover:bg-[#00C2A8]/90 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                                onClick={handleAuth}
                                disabled={loginMutation.isPending || registerMutation.isPending}
                            >
                                {(loginMutation.isPending || registerMutation.isPending)
                                    ? t("Procesando...", "Processing...")
                                    : (isLogin ? t("Ingresar", "Sign In") : t("Registrarse", "Sign Up"))}
                            </Button>
                            <div className="text-center text-sm text-gray-500">
                                {isLogin ? t("¿No tienes una cuenta?", "Don't have an account?") : t("¿Ya tienes una cuenta?", "Already have an account?")}{" "}
                                <button
                                    onClick={toggleMode}
                                    className="text-[#00C2A8] hover:text-[#00C2A8]/80 font-bold hover:underline transition-colors"
                                >
                                    {isLogin ? t("Regístrate", "Sign up") : t("Inicia sesión", "Log in")}
                                </button>
                            </div>
                        </CardFooter>

                    </Card>
                </motion.div>
            </div>
        </div>
    );
}

export default function AuthPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthForm />
        </QueryClientProvider>
    );
}
