"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { useCart, useRemoveCartItem, useClearCart } from "@/lib/hooks/useCart";
import { useLanguageStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/(ui)/card";
import { Button } from "@/components/(ui)/button";
import { Skeleton } from "@/components/(ui)/skeleton";
import { 
  ShoppingCart, 
  Trash2, 
  Plane, 
  Hotel, 
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";

export default function CartPage() {
  const router = useRouter();
  const { clientId, isAuthenticated } = useAuthStore();
  const { locale } = useLanguageStore();
  const t = (es: string, en: string) => (locale === "es" ? es : en);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Fetch cart
  const { data: cartData, isLoading, error, refetch } = useCart(clientId || '');
  const removeItem = useRemoveCartItem();
  const clearCart = useClearCart();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth');
    }
  }, [isAuthenticated, router]);

  // Handle checkout - calls /checkout/confirm and redirects to bank
  const handleCheckout = async () => {
    if (!clientId || !cartData?.items?.length) {
      toast.error(t("El carrito está vacío", "Cart is empty"));
      return;
    }

    setIsCheckingOut(true);
    try {
      // Get cart ID from first item or use a generated one
      const cartId = cartData.items[0]?.cartId || `cart-${Date.now()}`;
      
      // Build description from items
      const description = cartData.items.map((item: any) => 
        `${item.kind === 'AIR' ? '✈️' : '🏨'} ${item.description || item.refId}`
      ).join(' + ');

      // Call checkout confirm endpoint
      const response = await apiClient<{
        reservationId: string;
        orderId: string;
        totalAmount: number;
        currency: string;
        paymentAttemptId: string;
        bankPaymentUrl: string;
        initialState: string;
        expiresAt: string;
      }>('/checkout/confirm', {
        method: 'POST',
        body: {
          clientId,
          currency: 'COP',
          cartId,
          description: description || 'Paquete Turístico',
          returnUrl: `${window.location.origin}/bank/response`,
          callbackUrl: `${window.location.origin}/api/bank/notificacion`,
        },
        idempotencyKey: `checkout-${Date.now()}`,
      });

      // Store reservation info for the response page
      if (typeof window !== 'undefined') {
        localStorage.setItem('lastReservationId', response.reservationId);
        localStorage.setItem('lastPaymentAttemptId', response.paymentAttemptId);
      }

      toast.success(t("Reserva creada, redirigiendo al banco...", "Reservation created, redirecting to bank..."));

      // Redirect to bank payment URL
      if (response.bankPaymentUrl) {
        window.location.href = response.bankPaymentUrl;
      } else {
        // Fallback: go to our bank page with the payment info
        router.push(`/bank?reservationId=${response.reservationId}&amount=${response.totalAmount}`);
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      toast.error(err.message || t("Error al procesar el checkout", "Error processing checkout"));
      setIsCheckingOut(false);
    }
  };

  const handleRemoveItem = async (id: string) => {
    if (!clientId) return;
    try {
      await removeItem.mutateAsync({ id, clientId });
      toast.success(t("Item eliminado del carrito", "Item removed from cart"));
      refetch();
    } catch (err: any) {
      toast.error(err.message || t("Error al eliminar", "Error removing"));
    }
  };

  const handleClearCart = async () => {
    if (!clientId) return;
    if (!confirm(t("¿Vaciar todo el carrito?", "Clear entire cart?"))) return;
    try {
      await clearCart.mutateAsync(clientId);
      toast.success(t("Carrito vaciado", "Cart cleared"));
      refetch();
    } catch (err: any) {
      toast.error(err.message || t("Error al vaciar", "Error clearing"));
    }
  };

  const getItemIcon = (kind: string) => {
    switch (kind) {
      case 'AIR': return <Plane className="h-5 w-5 text-blue-500" />;
      case 'HOTEL': return <Hotel className="h-5 w-5 text-green-500" />;
      default: return <ShoppingCart className="h-5 w-5 text-gray-500" />;
    }
  };

  const getItemLabel = (kind: string) => {
    switch (kind) {
      case 'AIR': return t('Vuelo', 'Flight');
      case 'HOTEL': return t('Hotel', 'Hotel');
      default: return kind;
    }
  };

  const items = cartData?.items || [];
  const totalAmount = items.reduce((sum: number, item: any) => sum + Number(item.price || 0), 0);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("Volver", "Back")}
            </Link>
            <h1 className="text-2xl font-bold text-[#0A2540] flex items-center gap-3">
              <ShoppingCart className="h-7 w-7 text-[#00C2A8]" />
              {t("Mi Carrito", "My Cart")}
            </h1>
          </div>
          {items.length > 0 && (
            <Button 
              variant="outline" 
              onClick={handleClearCart}
              disabled={clearCart.isPending}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t("Vaciar carrito", "Clear cart")}
            </Button>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 border border-red-200 bg-red-50 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-800">
              {t("Error cargando el carrito. Verifica tu conexión.", 
                 "Error loading cart. Check your connection.")}
            </span>
          </div>
        )}

        {/* Empty cart */}
        {!isLoading && !error && items.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <ShoppingCart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg mb-4">
                {t("Tu carrito está vacío", "Your cart is empty")}
              </p>
              <div className="flex justify-center gap-4">
                <Button onClick={() => router.push('/flights')} variant="outline">
                  <Plane className="h-4 w-4 mr-2" />
                  {t("Buscar vuelos", "Search flights")}
                </Button>
                <Button onClick={() => router.push('/packages')} className="bg-[#00C2A8]">
                  <Hotel className="h-4 w-4 mr-2" />
                  {t("Buscar hoteles", "Search hotels")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cart items */}
        {!isLoading && items.length > 0 && (
          <>
            <div className="space-y-4">
              {items.map((item: any) => (
                <Card key={item.id}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-100 rounded-lg">
                          {getItemIcon(item.kind)}
                        </div>
                        <div>
                          <p className="font-medium text-[#0A2540]">
                            {getItemLabel(item.kind)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.metadata?.airline || item.metadata?.hotelName || item.refId}
                          </p>
                          {item.metadata?.originCityId && item.metadata?.destinationCityId && (
                            <p className="text-xs text-gray-400">
                              {item.metadata.originCityId} → {item.metadata.destinationCityId}
                            </p>
                          )}
                          {item.metadata?.checkIn && item.metadata?.checkOut && (
                            <p className="text-xs text-gray-400">
                              {item.metadata.checkIn} - {item.metadata.checkOut}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-lg text-[#0A2540]">
                            ${Number(item.price).toLocaleString('es-CO')}
                          </p>
                          <p className="text-xs text-gray-500">{item.currency}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={removeItem.isPending}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Total and checkout */}
            <Card className="border-[#00C2A8]">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{t("Total", "Total")}</span>
                  <span className="text-2xl text-[#00C2A8]">
                    ${totalAmount.toLocaleString('es-CO')} COP
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-[#00C2A8] hover:bg-[#00a892] text-lg py-6 disabled:opacity-50"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      {t("Procesando...", "Processing...")}
                    </>
                  ) : (
                    <>
                      {t("Proceder al pago", "Proceed to payment")}
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

