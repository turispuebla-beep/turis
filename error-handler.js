/**
 * Manejador de Errores Centralizado - CDSANABRIACF
 * Sistema para manejar errores de manera consistente en toda la aplicación
 */

class ErrorHandler {
    constructor() {
        this.errorLog = [];
        this.maxLogSize = 100;
        this.init();
    }

    init() {
        // Capturar errores globales
        window.addEventListener('error', (event) => {
            this.handleError(event.error || new Error(event.message), 'Global Error');
        });

        // Capturar promesas rechazadas
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, 'Unhandled Promise Rejection');
        });

        // Capturar errores de recursos
        window.addEventListener('error', (event) => {
            if (event.target && event.target.tagName) {
                this.handleError(new Error(`Error loading resource: ${event.target.src || event.target.href}`), 'Resource Error');
            }
        }, true);
    }

    handleError(error, context = 'Unknown') {
        const errorInfo = {
            message: error.message || 'Error desconocido',
            stack: error.stack,
            context: context,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        // Agregar al log
        this.errorLog.push(errorInfo);
        if (this.errorLog.length > this.maxLogSize) {
            this.errorLog.shift();
        }

        // Log en consola para desarrollo
        if (this.isDevelopment()) {
            console.error(`[${context}]`, error);
        }

        // Mostrar notificación al usuario si es necesario
        this.showUserNotification(errorInfo);
    }

    showUserNotification(errorInfo) {
        // Solo mostrar notificaciones para errores críticos
        const criticalErrors = [
            'Base de datos no inicializada',
            'Error de conexión',
            'Error de autenticación'
        ];

        if (criticalErrors.some(critical => errorInfo.message.includes(critical))) {
            this.showToast('❌ Error del sistema. Por favor, recarga la página.', 'error');
        }
    }

    showToast(message, type = 'info', duration = 5000) {
        // Crear elemento toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getToastColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 400px;
            font-size: 14px;
            line-height: 1.4;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        toast.textContent = message;

        // Agregar al DOM
        document.body.appendChild(toast);

        // Animar entrada
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        // Auto-remover
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    getToastColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || colors.info;
    }

    isDevelopment() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.hostname.includes('dev');
    }

    getErrorLog() {
        return this.errorLog;
    }

    clearErrorLog() {
        this.errorLog = [];
    }

    // Método para validar datos
    validateData(data, schema) {
        const errors = [];
        
        for (const [field, rules] of Object.entries(schema)) {
            const value = data[field];
            
            if (rules.required && (!value || value.trim() === '')) {
                errors.push(`${field} es obligatorio`);
                continue;
            }
            
            if (value && rules.minLength && value.length < rules.minLength) {
                errors.push(`${field} debe tener al menos ${rules.minLength} caracteres`);
            }
            
            if (value && rules.maxLength && value.length > rules.maxLength) {
                errors.push(`${field} debe tener máximo ${rules.maxLength} caracteres`);
            }
            
            if (value && rules.pattern && !rules.pattern.test(value)) {
                errors.push(`${field} tiene un formato inválido`);
            }
            
            if (value && rules.email && !this.isValidEmail(value)) {
                errors.push(`${field} debe ser un email válido`);
            }
        }
        
        return errors;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Método para sanitizar datos
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        return input
            .replace(/[<>]/g, '') // Remover < y >
            .trim();
    }

    // Método para formatear errores de base de datos
    formatDatabaseError(error) {
        if (error.message.includes('ConstraintError')) {
            return 'Ya existe un registro con estos datos';
        }
        if (error.message.includes('QuotaExceededError')) {
            return 'Se ha excedido el límite de almacenamiento';
        }
        if (error.message.includes('InvalidStateError')) {
            return 'Error de estado de la base de datos';
        }
        return 'Error de base de datos. Inténtalo de nuevo.';
    }
}

// Instancia global del manejador de errores
const errorHandler = new ErrorHandler();

// Función global para mostrar notificaciones
function showNotification(message, type = 'info', duration = 5000) {
    errorHandler.showToast(message, type, duration);
}

// Función global para validar formularios
function validateForm(formData, schema) {
    return errorHandler.validateData(formData, schema);
}

// Función global para sanitizar datos
function sanitizeData(data) {
    if (typeof data === 'object') {
        const sanitized = {};
        for (const [key, value] of Object.entries(data)) {
            sanitized[key] = errorHandler.sanitizeInput(value);
        }
        return sanitized;
    }
    return errorHandler.sanitizeInput(data);
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ErrorHandler, errorHandler, showNotification, validateForm, sanitizeData };
}





