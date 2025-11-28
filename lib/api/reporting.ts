// File: lib/api/reporting.ts
// Endpoints de reportes
import { apiClient } from './client';

export interface SalesReportQuery {
  startDate?: string;  // YYYY-MM-DD
  endDate?: string;    // YYYY-MM-DD
}

export interface SalesReportResponse {
  totalSales: number;
  totalReservations: number;
  byPeriod: Array<{
    period: string;
    sales: number;
    count: number;
  }>;
}

export interface ReservationsReportResponse {
  total: number;
  byStatus: Record<string, number>;
  recent: Array<{
    id: string;
    clientId: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
}

export const reporting = {
  sales: (query?: SalesReportQuery) => {
    const params = new URLSearchParams();
    if (query?.startDate) params.set('startDate', query.startDate);
    if (query?.endDate) params.set('endDate', query.endDate);
    const qs = params.toString();
    return apiClient<SalesReportResponse>(`/reporting/sales${qs ? `?${qs}` : ''}`, { method: 'GET' });
  },

  reservations: () => 
    apiClient<ReservationsReportResponse>('/reporting/reservations', { method: 'GET' }),
};



