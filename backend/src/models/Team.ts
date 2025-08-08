// ... (mantener el código existente y actualizar la sección de contactInfo)

    contactInfo: {
        email: {
            type: String,
            required: [true, 'El email de contacto es obligatorio'],
            match: [
                /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
                'Por favor proporcione un email válido'
            ]
        },
        phone: {
            type: String,
            required: [true, 'El teléfono de contacto es obligatorio'],
            match: [
                /^\d{9}$/,
                'Por favor proporcione un número de teléfono válido (9 dígitos)'
            ]
        },
        bizumPhone: {
            type: String,
            match: [
                /^\d{9}$/,
                'El número de teléfono para Bizum debe tener 9 dígitos'
            ]
        },
        bankAccount: {
            type: String,
            match: [
                /^ES\d{22}$/,
                'Por favor proporcione un IBAN español válido'
            ]
        },
        address: String,
        schedule: String
    },

// ... (resto del código del modelo sin cambios)