import { NextRequest, NextResponse } from "next/server";
import type { PaymentResponse } from "@/lib/payment-store";

// This is a webhook endpoint that the bank will call to notify about payment status
// In production, you should:
// 1. Verify the request signature/authentication from the bank
// 2. Store the notification in your database
// 3. Update the booking status accordingly
// 4. Send notifications to the user

export async function POST(request: NextRequest) {
  try {
    const body: PaymentResponse = await request.json();

    // Validate required fields
    if (
      !body.referencia_transaccion ||
      !body.estado_transaccion ||
      !body.monto_transaccion ||
      !body.fecha_hora_pago ||
      !body.codigo_respuesta ||
      !body.metodo_pago
    ) {
      return NextResponse.json(
        { error: "Invalid payment response format" },
        { status: 400 }
      );
    }

    // TODO: In production, you should:
    // 1. Verify the request is actually from the bank (check signature, IP, etc.)
    // 2. Find the booking associated with this transaction
    // 3. Update the booking status based on estado_transaccion
    // 4. Send notification to user
    // 5. Log the transaction

    console.log("Bank notification received:", body);

    // For now, just acknowledge receipt
    return NextResponse.json(
      { 
        success: true, 
        message: "Notification received",
        referencia: body.referencia_transaccion 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing bank notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Some banks might use GET for notifications (not recommended, but we support it)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const referencia = searchParams.get("referencia_transaccion");
  const estado = searchParams.get("estado_transaccion");
  const monto = searchParams.get("monto_transaccion");
  const fecha = searchParams.get("fecha_hora_pago");
  const codigo = searchParams.get("codigo_respuesta");
  const metodo = searchParams.get("metodo_pago");

  if (!referencia || !estado || !monto || !fecha || !codigo || !metodo) {
    return NextResponse.json(
      { error: "Invalid payment response format" },
      { status: 400 }
    );
  }

  const body: PaymentResponse = {
    referencia_transaccion: referencia,
    estado_transaccion: estado as "APROBADA" | "RECHAZADA" | "PENDIENTE",
    monto_transaccion: parseFloat(monto),
    fecha_hora_pago: fecha,
    codigo_respuesta: codigo,
    metodo_pago: metodo,
  };

  // TODO: Process notification same as POST
  console.log("Bank notification received (GET):", body);

  return NextResponse.json(
    { 
      success: true, 
      message: "Notification received",
      referencia: body.referencia_transaccion 
    },
    { status: 200 }
  );
}

