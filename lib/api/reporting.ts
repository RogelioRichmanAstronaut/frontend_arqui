// File: lib/api/reporting.ts
import { apiClient } from './client';

export type SalesReportQuery = {
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  currency?: string;
  groupBy?: 'day' | 'month' | 'year';
};

export type SalesReportDto = {
  period: string;
  totalAmount: number;
  currency: string;
  transactionCount: number;
  averageTicket: number;
  breakdown?: {
    flights: number;
    hotels: number;
    other: number;
  };
};

export type ReservationsReportDto = {
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  byType: {
    flights: number;
    hotels: number;
    packages: number;
  };
};

export const reporting = {
  /**
   * Get sales summary report
   * Connects to: GET /reporting/sales
   */
  sales: (query: SalesReportQuery = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => { 
      if (v) params.set(k, String(v)); 
    });
    const queryString = params.toString();
    return apiClient<SalesReportDto[]>(`/reporting/sales${queryString ? `?${queryString}` : ''}`, { method: 'GET' });
  },

  /**
   * Get reservations summary report
   * Connects to: GET /reporting/reservations
   */
  reservations: () => 
    apiClient<ReservationsReportDto>('/reporting/reservations', { method: 'GET' }),
};