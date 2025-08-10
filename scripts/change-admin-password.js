#!/usr/bin/env node

/**
 * Script para cambiar la contraseña del Super Administrador
 * Uso: node scripts/change-admin-password.js
 */

const readline = require('readline');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🔐 CAMBIO DE CONTRASEÑA - SUPER ADMINISTRADOR');
console.log('==============================================\n');

// Función para validar contraseña
function validatePassword(password) {
    const minLength = 12;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const errors = [];
    
    if (password.length < minLength) {
        errors.push(`- Mínimo ${minLength} caracteres`);
    }
    if (!hasUpperCase) {
        errors.push('- Al menos una mayúscula');
    }
    if (!hasLowerCase) {
        errors.push('- Al menos una minúscula');
    }
    if (!hasNumbers) {
        errors.push('- Al menos un número');
    }
    if (!hasSpecialChar) {
        errors.push('- Al menos un carácter especial');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

// Función para generar contraseña segura
function generateSecurePassword() {
    const length = 16;
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    
    // Asegurar al menos un carácter de cada tipo
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    password += '0123456789'[Math.floor(Math.random() * 10)];
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)];
    
    // Completar el resto
    for (let i = 4; i < length; i++) {
        password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Mezclar la contraseña
    return password.split('').sort(() => Math.random() - 0.5).join('');
}

// Función para actualizar el archivo .env
function updateEnvFile(newPassword) {
    const envPath = path.join(process.cwd(), '.env');
    const envExamplePath = path.join(process.cwd(), 'env.example');
    
    let envContent = '';
    
    // Si existe .env, leerlo
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
    } else if (fs.existsSync(envExamplePath)) {
        // Si no existe .env, usar el ejemplo
        envContent = fs.readFileSync(envExamplePath, 'utf8');
    } else {
        // Crear contenido básico
        envContent = `# Configuración de TURISTEAM
REACT_APP_SUPER_ADMIN_EMAIL=admin@turisteam.com
REACT_APP_SUPER_ADMIN_PASSWORD=${newPassword}
JWT_SECRET=${crypto.randomBytes(32).toString('hex')}
DATABASE_URL=mongodb://localhost:27017/turisteam
PORT=5000
NODE_ENV=development`;
    }
    
    // Actualizar la contraseña
    const updatedContent = envContent.replace(
        /REACT_APP_SUPER_ADMIN_PASSWORD=.*/,
        `REACT_APP_SUPER_ADMIN_PASSWORD=${newPassword}`
    );
    
    // Escribir el archivo
    fs.writeFileSync(envPath, updatedContent);
    
    console.log('✅ Archivo .env actualizado correctamente');
}

// Función principal
async function main() {
    try {
        console.log('Opciones disponibles:');
        console.log('1. Generar contraseña automáticamente');
        console.log('2. Ingresar contraseña manualmente');
        console.log('3. Verificar contraseña actual');
        console.log('4. Salir\n');
        
        rl.question('Selecciona una opción (1-4): ', async (option) => {
            switch (option) {
                case '1':
                    const autoPassword = generateSecurePassword();
                    console.log(`\n🔑 Contraseña generada: ${autoPassword}`);
                    console.log('¿Deseas usar esta contraseña? (s/n): ');
                    
                    rl.question('', (answer) => {
                        if (answer.toLowerCase() === 's' || answer.toLowerCase() === 'si') {
                            updateEnvFile(autoPassword);
                            console.log('\n✅ Contraseña actualizada exitosamente');
                            console.log('🔐 Nueva contraseña:', autoPassword);
                            console.log('\n⚠️  IMPORTANTE: Guarda esta contraseña en un lugar seguro');
                        } else {
                            console.log('❌ Operación cancelada');
                        }
                        rl.close();
                    });
                    break;
                    
                case '2':
                    rl.question('\n🔐 Ingresa la nueva contraseña: ', (password) => {
                        const validation = validatePassword(password);
                        
                        if (!validation.isValid) {
                            console.log('\n❌ La contraseña no cumple con los requisitos de seguridad:');
                            validation.errors.forEach(error => console.log(error));
                            console.log('\n💡 Sugerencia: Usa la opción 1 para generar una contraseña segura');
                            rl.close();
                            return;
                        }
                        
                        rl.question('🔐 Confirma la contraseña: ', (confirmPassword) => {
                            if (password !== confirmPassword) {
                                console.log('❌ Las contraseñas no coinciden');
                                rl.close();
                                return;
                            }
                            
                            updateEnvFile(password);
                            console.log('\n✅ Contraseña actualizada exitosamente');
                            rl.close();
                        });
                    });
                    break;
                    
                case '3':
                    const envPath = path.join(process.cwd(), '.env');
                    if (fs.existsSync(envPath)) {
                        const envContent = fs.readFileSync(envPath, 'utf8');
                        const passwordMatch = envContent.match(/REACT_APP_SUPER_ADMIN_PASSWORD=(.*)/);
                        
                        if (passwordMatch) {
                            const currentPassword = passwordMatch[1];
                            console.log('\n🔍 Contraseña actual configurada:');
                            console.log(`📧 Email: admin@turisteam.com`);
                            console.log(`🔐 Contraseña: ${currentPassword}`);
                            
                            const validation = validatePassword(currentPassword);
                            if (validation.isValid) {
                                console.log('✅ La contraseña cumple con los requisitos de seguridad');
                            } else {
                                console.log('⚠️  La contraseña no cumple con los requisitos de seguridad');
                                validation.errors.forEach(error => console.log(error));
                            }
                        } else {
                            console.log('❌ No se encontró la contraseña en el archivo .env');
                        }
                    } else {
                        console.log('❌ No se encontró el archivo .env');
                    }
                    rl.close();
                    break;
                    
                case '4':
                    console.log('👋 ¡Hasta luego!');
                    rl.close();
                    break;
                    
                default:
                    console.log('❌ Opción inválida');
                    rl.close();
                    break;
            }
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        rl.close();
    }
}

// Manejar cierre del programa
rl.on('close', () => {
    process.exit(0);
});

// Ejecutar el script
main(); 