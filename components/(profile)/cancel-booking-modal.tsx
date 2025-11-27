"use client";

import { useState } from "react";
import { Button } from "@/components/(ui)/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/(ui)/dialog";
import { Textarea } from "@/components/(ui)/textarea";
import { Label } from "@/components/(ui)/label";
import { Checkbox } from "@/components/(ui)/checkbox";
import { AlertTriangle } from "lucide-react";

interface CancelBookingModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (requestRefund: boolean, reason?: string) => void;
    bookingType: "hotel" | "flight";
    bookingName: string;
}

export function CancelBookingModal({
    open,
    onClose,
    onConfirm,
    bookingType,
    bookingName,
}: CancelBookingModalProps) {
    const [requestRefund, setRequestRefund] = useState(false);
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleConfirm = async () => {
        setIsSubmitting(true);
        await onConfirm(requestRefund, reason || undefined);
        setIsSubmitting(false);
        handleClose();
    };

    const handleClose = () => {
        setRequestRefund(false);
        setReason("");
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        Cancelar Reserva
                    </DialogTitle>
                    <DialogDescription className="text-base pt-2">
                        ¿Estás seguro de que deseas cancelar esta reserva?
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-700">
                            {bookingType === "hotel" ? "Hotel" : "Vuelo"}
                        </p>
                        <p className="text-base font-semibold text-[#0A2540] mt-1">
                            {bookingName}
                        </p>
                    </div>

                    <div className="flex items-start space-x-3 pt-2">
                        <Checkbox
                            id="refund"
                            checked={requestRefund}
                            onCheckedChange={(checked) => setRequestRefund(checked as boolean)}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label
                                htmlFor="refund"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                                Solicitar reembolso
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Se procesará tu solicitud de reembolso según nuestras políticas.
                            </p>
                        </div>
                    </div>

                    {requestRefund && (
                        <div className="space-y-2">
                            <Label htmlFor="reason">Motivo (opcional)</Label>
                            <Textarea
                                id="reason"
                                placeholder="Explica brevemente el motivo de la cancelación..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="min-h-[100px] resize-none"
                            />
                        </div>
                    )}

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-sm text-amber-800">
                            <strong>Nota:</strong> Esta acción no se puede deshacer. Si solicitas un reembolso,
                            será procesado en un plazo de 5-10 días hábiles.
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        Volver
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Cancelando..." : "Confirmar Cancelación"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
