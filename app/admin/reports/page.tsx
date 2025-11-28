"use client";

import { useSalesReport, useReservationsReport } from "@/lib/hooks/useReporting";
import { useAuthStore } from "@/lib/auth-store";
import { useLanguageStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/(ui)/card";
import { Button } from "@/components/(ui)/button";
import { Input } from "@/components/(ui)/input";
import { Skeleton } from "@/components/(ui)/skeleton";
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Ticket, 
  RefreshCw,
  ArrowLeft,
  BarChart3
} from "lucide-react";
import { format, subDays } from "date-fns";

export default function AdminReportsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { locale } = useLanguageStore();
  const t = (es: string, en: string) => (locale === "es" ? es : en);

  // Date range state
  const [startDate, setStartDate] = useState(() => 
    format(subDays(new Date(), 30), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState(() => 
    format(new Date(), 'yyyy-MM-dd')
  );

  // Queries
  const { 
    data: salesData, 
    isLoading: salesLoading, 
    error: salesError,
    refetch: refetchSales 
  } = useSalesReport({ startDate, endDate });

  const { 
    data: reservationsData, 
    isLoading: reservationsLoading, 
    error: reservationsError,
    refetch: refetchReservations 
  } = useReservationsReport();

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth');
    } else if (user?.role !== 'ADMIN') {
      router.replace('/');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton className="h-64 w-96" />
      </div>
    );
  }

  const isLoading = salesLoading || reservationsLoading;
  const hasError = salesError || reservationsError;

  const handleRefresh = () => {
    refetchSales();
    refetchReservations();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("Volver", "Back")}
            </button>
            <h1 className="text-2xl font-bold text-[#0A2540]">
              {t("Panel de Reportes", "Reports Dashboard")}
            </h1>
            <p className="text-gray-600">
              {t("Resumen de ventas y reservaciones del sistema", "System sales and reservations summary")}
            </p>
          </div>
          <Button 
            onClick={handleRefresh} 
            disabled={isLoading}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {t("Actualizar", "Refresh")}
          </Button>
        </div>

        {/* Date Range Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#00C2A8]" />
              {t("Rango de Fechas", "Date Range")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-center flex-wrap">
              <div>
                <label className="text-sm text-gray-600 block mb-1">{t("Desde", "From")}</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-40"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">{t("Hasta", "To")}</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-40"
                />
              </div>
              <Button 
                onClick={handleRefresh} 
                className="mt-6 bg-[#00C2A8] hover:bg-[#00a892]"
              >
                {t("Aplicar", "Apply")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {hasError && (
          <div className="p-4 border border-red-200 bg-red-50 rounded-lg text-red-800">
            {t("Error cargando reportes. Verifica que el backend esté corriendo.",
               "Error loading reports. Check that the backend is running.")}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Sales Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
                {t("Ventas Totales", "Total Sales")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {salesLoading ? (
                <Skeleton className="h-10 w-32" />
              ) : (
                <p className="text-3xl font-bold text-green-600">
                  ${salesData?.totalSales?.toLocaleString('es-CO') || 0} COP
                </p>
              )}
            </CardContent>
          </Card>

          {/* Total Reservations Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Ticket className="h-5 w-5 text-blue-600" />
                {t("Total Reservaciones", "Total Reservations")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reservationsLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <p className="text-3xl font-bold text-blue-600">
                  {reservationsData?.total || 0}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Trend Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-[#00C2A8]" />
                {t("Reservas en el Período", "Reservations in Period")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {salesLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <p className="text-3xl font-bold text-[#00C2A8]">
                  {salesData?.totalReservations || 0}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Reservations by Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#00C2A8]" />
              {t("Reservaciones por Estado", "Reservations by Status")}
            </CardTitle>
            <CardDescription>
              {t("Distribución actual de reservaciones", "Current reservation distribution")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reservationsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : reservationsData?.byStatus ? (
              <div className="space-y-3">
                {Object.entries(reservationsData.byStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium capitalize">{status}</span>
                    <span className="text-lg font-bold">{count as number}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                {t("No hay datos disponibles", "No data available")}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Reservations */}
        <Card>
          <CardHeader>
            <CardTitle>{t("Reservaciones Recientes", "Recent Reservations")}</CardTitle>
            <CardDescription>
              {t("Últimas reservaciones del sistema", "Latest system reservations")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reservationsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : reservationsData?.recent && reservationsData.recent.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">{t("ID", "ID")}</th>
                      <th className="text-left p-2">{t("Cliente", "Client")}</th>
                      <th className="text-left p-2">{t("Monto", "Amount")}</th>
                      <th className="text-left p-2">{t("Estado", "Status")}</th>
                      <th className="text-left p-2">{t("Fecha", "Date")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservationsData.recent.map((res: any) => (
                      <tr key={res.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-mono text-xs">{res.id.slice(0, 8)}...</td>
                        <td className="p-2">{res.clientId}</td>
                        <td className="p-2">${res.totalAmount?.toLocaleString('es-CO')}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            res.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                            res.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            res.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {res.status}
                          </span>
                        </td>
                        <td className="p-2 text-gray-600">
                          {res.createdAt ? format(new Date(res.createdAt), 'dd/MM/yyyy HH:mm') : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                {t("No hay reservaciones recientes", "No recent reservations")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



