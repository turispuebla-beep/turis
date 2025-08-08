// ... (código anterior sin cambios hasta el paymentMethod)

    paymentMethod: {
        type: String,
        enum: ['cash', 'transfer', 'card', 'bizum'], // Añadimos 'bizum' como método de pago
        validate: {
            validator: function(value: string) {
                // Si es Bizum, verificar que hay un número de teléfono
                if (value === 'bizum' && !this.bizumPhone) {
                    return false;
                }
                return true;
            },
            message: 'Para pagos con Bizum es necesario el número de teléfono'
        }
    },
    bizumPhone: {
        type: String,
        validate: {
            validator: function(value: string) {
                // Validar que el número de teléfono es válido para Bizum (9 dígitos)
                return !value || /^\d{9}$/.test(value);
            },
            message: 'El número de teléfono para Bizum debe tener 9 dígitos'
        }
    },
    bizumReference: {
        type: String,
        trim: true
    },

// ... (resto del código del modelo sin cambios)

// Actualizamos el método markAsPaid para incluir Bizum
PaymentSchema.methods.markAsPaid = async function(
    paymentMethod: 'cash' | 'transfer' | 'card' | 'bizum',
    reference?: string,
    bizumPhone?: string
): Promise<void> {
    this.status = 'completed';
    this.paidDate = new Date();
    this.paymentMethod = paymentMethod;
    
    if (paymentMethod === 'bizum') {
        if (!bizumPhone) {
            throw new Error('El número de teléfono es obligatorio para pagos con Bizum');
        }
        this.bizumPhone = bizumPhone;
        this.bizumReference = reference || `BIZ${Date.now().toString().slice(-6)}`;
    } else if (reference) {
        this.reference = reference;
    }
    
    await this.save();
};