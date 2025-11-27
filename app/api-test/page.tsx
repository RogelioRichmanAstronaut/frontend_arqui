"use client";

import { ApiTestingPanel } from "@/components/api-testing-panel";
import { BannerSection } from "@/components/banner-section";

export default function ApiTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <BannerSection imageUrl="/images/banner/pack-banner.jpg">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white z-20 tracking-[0.3em]">
          API TESTING
        </h1>
        <p className="text-xl text-white/90 mt-4 max-w-2xl text-center">
          Panel de pruebas para verificar la conectividad con el backend NestJS
        </p>
      </BannerSection>

      <section className="container mx-auto px-4 lg:px-8 py-12 -mt-8 relative z-30">
        <div className="flex justify-center">
          <ApiTestingPanel />
        </div>
      </section>

      <section className="bg-white py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-[#0A2540] mb-6">📖 Guía de Pruebas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">🚀 Pasos para Probar</h3>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Asegúrate que el backend esté corriendo en <code>localhost:3001</code></li>
                  <li>2. Haz clic en "Login Test" para autenticarte</li>
                  <li>3. Prueba los endpoints uno por uno</li>
                  <li>4. Revisa los resultados en cada sección</li>
                </ol>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">✅ Endpoints Disponibles</h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Health & Ready checks</li>
                  <li>• Autenticación (login)</li>
                  <li>• Catálogo de ciudades</li>
                  <li>• Gestión de clientes</li>
                  <li>• Búsqueda de vuelos</li>
                  <li>• Búsqueda de hoteles</li>
                  <li>• Carrito de compras</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Configuración Requerida</h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Backend NestJS en <code>localhost:3001</code></li>
                  <li>• Variables de entorno configuradas</li>
                  <li>• Usuario de prueba: <code>empleado@turismo.com</code></li>
                  <li>• Contraseña: <code>password123</code></li>
                </ul>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">🔗 Servicios Externos</h3>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Aerolínea: <code>10.43.103.34:8080</code></li>
                  <li>• Hotel: <code>10.43.103.234:8080</code></li>
                  <li>• Banco: <code>localhost:3000</code></li>
                  <li>• Datos de prueba incluidos</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">🛠️ Solución de Problemas</h3>
              <div className="text-sm text-gray-700 space-y-2">
                <p><strong>401 Unauthorized:</strong> El token ha expirado, haz login nuevamente</p>
                <p><strong>404 Not Found:</strong> Verifica que el backend esté corriendo</p>
                <p><strong>500 Server Error:</strong> Revisa los logs del backend</p>
                <p><strong>CORS Error:</strong> Verifica la configuración de CORS en el backend</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
