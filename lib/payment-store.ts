import { create } from "zustand";

export interface PaymentPayload {
  monto_total: number;
  descripcion_pago: string;
  cedula_cliente: string;
  nombre_cliente: string;
  url_respuesta: string;
  url_notificacion: string;
  destinatario: string;
}

export interface PaymentResponse {
  referencia_transaccion: string;
  estado_transaccion: "APROBADA" | "RECHAZADA" | "PENDIENTE";
  monto_transaccion: number;
  fecha_hora_pago: string;
  codigo_respuesta: string;
  metodo_pago: string;
}

interface PaymentState {
  paymentType: "package" | "flight" | null;
  totalAmount: number;
  description: string;
  customerId: string;
  customerName: string;
  paymentResponse: PaymentResponse | null;
  isLoading: boolean;
  error: string | null;
  setPaymentInfo: (info: {
    paymentType: "package" | "flight";
    totalAmount: number;
    description: string;
  }) => void;
  setCustomerInfo: (info: {
    customerId: string;
    customerName: string;
  }) => void;
  setPaymentResponse: (response: PaymentResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  paymentType: null,
  totalAmount: 0,
  description: "",
  customerId: "",
  customerName: "",
  paymentResponse: null,
  isLoading: false,
  error: null,
  setPaymentInfo: ({ paymentType, totalAmount, description }) =>
    set({ paymentType, totalAmount, description }),
  setCustomerInfo: ({ customerId, customerName }) =>
    set({ customerId, customerName }),
  setPaymentResponse: (response) => set({ paymentResponse: response }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      paymentType: null,
      totalAmount: 0,
      description: "",
      customerId: "",
      customerName: "",
      paymentResponse: null,
      isLoading: false,
      error: null,
    }),
}));

