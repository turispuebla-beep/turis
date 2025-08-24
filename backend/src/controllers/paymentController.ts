// ... (código anterior sin cambios hasta completePayment)

import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/async';
import ErrorResponse from '../utils/errorResponse';
import { NotificationService } from '../services/notificationService';
import { uploadFile } from '../services/storageService';
import Payment from '../models/Payment';

// @desc    Marcar pago como completado
// @route   PUT /api/teams/:teamId/payments/:id/complete
// @access  Private (Admin y TeamAdmin)
export const completePayment = asyncHandler(async (req: Request, res: Response) => {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
        throw new ErrorResponse('Pago no encontrado', 404);
    }

    // Verificar permisos
    if (req.user?.role === 'team_admin' && payment.teamId.toString() !== req.user.teamId) {
        throw new ErrorResponse('No autorizado para modificar este pago', 403);
    }

    const { paymentMethod, reference, bizumPhone } = req.body;

    // Validar datos específicos de Bizum
    if (paymentMethod === 'bizum') {
        if (!bizumPhone) {
            throw new ErrorResponse('El número de teléfono es obligatorio para pagos con Bizum', 400);
        }
        if (!/^\d{9}$/.test(bizumPhone)) {
            throw new ErrorResponse('El número de teléfono para Bizum debe tener 9 dígitos', 400);
        }
    }

    await payment.markAsPaid(paymentMethod, reference, bizumPhone);

    // Subir recibo si se proporciona
    if (req.file) {
        payment.receipt = await uploadFile(req.file, 'receipts');
        await payment.save();
    }

    // Personalizar mensaje según método de pago
    let paymentMethodText = '';
    switch (paymentMethod) {
        case 'bizum':
            paymentMethodText = 'mediante Bizum';
            break;
        case 'cash':
            paymentMethodText = 'en efectivo';
            break;
        case 'transfer':
            paymentMethodText = 'por transferencia';
            break;
        case 'card':
            paymentMethodText = 'con tarjeta';
            break;
    }

    // Notificar al socio
    await NotificationService.sendCustomNotification(
        {
            title: 'Pago Confirmado',
            body: `Se ha confirmado el pago de ${payment.amount}€ ${paymentMethodText} por ${payment.concept}`,
            data: {
                type: 'PAYMENT_COMPLETED',
                paymentId: payment._id.toString(),
                teamId: payment.teamId.toString(),
                paymentMethod
            }
        },
        {
            target: 'member',
            memberId: payment.memberId.toString()
        }
    );

    res.status(200).json({
        success: true,
        data: payment
    });
});

// @desc    Obtener instrucciones de pago
// @route   GET /api/teams/:teamId/payments/:id/instructions
// @access  Private
export const getPaymentInstructions = asyncHandler(async (req: Request, res: Response) => {
    const payment = await Payment.findById(req.params.id)
        .populate('teamId', 'name contactInfo');

    if (!payment) {
        throw new ErrorResponse('Pago no encontrado', 404);
    }

    // Verificar permisos
    if (req.user?.role === 'team_admin' && payment.teamId.toString() !== req.user.teamId) {
        throw new ErrorResponse('No autorizado para ver este pago', 403);
    }

    let instructions = '';
    const team = payment.teamId as any;

    switch (payment.paymentMethod) {
        case 'bizum':
            instructions = `
                Instrucciones para pago con Bizum:
                1. Abre tu aplicación de Bizum
                2. Selecciona "Enviar dinero"
                3. Introduce el número: ${team.contactInfo.bizumPhone || payment.bizumPhone}
                4. Importe a enviar: ${payment.amount}€
                5. En el concepto escribe: ${payment.concept}
                
                Una vez realizado el pago, por favor guarda el comprobante.
            `;
            break;
        case 'transfer':
            instructions = `
                Instrucciones para transferencia bancaria:
                Beneficiario: ${team.name}
                IBAN: ${team.contactInfo.bankAccount}
                Importe: ${payment.amount}€
                Concepto: ${payment.concept}
                
                Por favor, guarda el comprobante de la transferencia.
            `;
            break;
        case 'card':
            instructions = `
                El pago con tarjeta se realizará presencialmente en la oficina del club.
                Importe a pagar: ${payment.amount}€
            `;
            break;
        case 'cash':
            instructions = `
                El pago en efectivo se realizará presencialmente en la oficina del club.
                Importe a pagar: ${payment.amount}€
                Por favor, traiga el importe exacto.
            `;
            break;
    }

    res.status(200).json({
        success: true,
        data: {
            payment,
            instructions: instructions.trim()
        }
    });
});

// ... (resto del código del controlador sin cambios)