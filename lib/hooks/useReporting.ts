// File: lib/hooks/useReporting.ts
// Hooks para reportes
import { useQuery } from '@tanstack/react-query';
import { reporting } from '../api/reporting';
import type { SalesReportQuery, SalesReportResponse, ReservationsReportResponse } from '../api/reporting';

export function useSalesReport(query?: SalesReportQuery) {
  return useQuery<SalesReportResponse, Error>({
    queryKey: ['reporting', 'sales', query],
    queryFn: () => reporting.sales(query),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useReservationsReport() {
  return useQuery<ReservationsReportResponse, Error>({
    queryKey: ['reporting', 'reservations'],
    queryFn: () => reporting.reservations(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}



