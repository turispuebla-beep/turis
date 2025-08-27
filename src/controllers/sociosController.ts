import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { Member } from '../models/Member';

// @desc    Obtener todos los socios (para admin)
// @route   GET /api/socios
// @access  Private (Admin)
export const getAllSocios = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const socios = await Member.find({ isActive: true }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: socios.length,
        data: socios
    });
});

// @desc    Crear nuevo socio
// @route   POST /api/socios
// @access  Private (Admin)
export const createSocio = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { nombre, apellidos, dni, telefono, email, direccion, fechaNacimiento, estado } = req.body;

    // Validaciones
    if (!nombre || !apellidos || !telefono) {
        return res.status(400).json({
            success: false,
            error: 'Nombre, apellidos y teléfono son obligatorios'
        });
    }

    // Verificar DNI único si se proporciona
    if (dni) {
        const existingSocio = await Member.findOne({ dni });
        if (existingSocio) {
            return res.status(400).json({
                success: false,
                error: 'El DNI ya está registrado'
            });
        }
    }

    // Verificar teléfono único
    const existingTelefono = await Member.findOne({ telefono });
    if (existingTelefono) {
        return res.status(400).json({
            success: false,
            error: 'El teléfono ya está registrado'
        });
    }

    const socioData = {
        nombre,
        apellidos,
        dni: dni || '',
        telefono,
        email: email || '',
        direccion: direccion || '',
        fechaNacimiento: fechaNacimiento || null,
        estado: estado || 'pendiente',
        pagado: estado === 'activo',
        fechaRegistro: new Date(),
        isActive: true
    };

    const socio = await Member.create(socioData);

    res.status(201).json({
        success: true,
        data: socio
    });
});

// @desc    Actualizar socio
// @route   PUT /api/socios/:id
// @access  Private (Admin)
export const updateSocio = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { nombre, apellidos, dni, telefono, email, direccion, fechaNacimiento, estado } = req.body;

    let socio = await Member.findById(req.params.id);

    if (!socio) {
        return res.status(404).json({
            success: false,
            error: 'Socio no encontrado'
        });
    }

    // Verificar DNI único si se está cambiando
    if (dni && dni !== socio.dni) {
        const existingSocio = await Member.findOne({ dni });
        if (existingSocio) {
            return res.status(400).json({
                success: false,
                error: 'El DNI ya está registrado'
            });
        }
    }

    // Verificar teléfono único si se está cambiando
    if (telefono && telefono !== socio.telefono) {
        const existingTelefono = await Member.findOne({ telefono });
        if (existingTelefono) {
            return res.status(400).json({
                success: false,
                error: 'El teléfono ya está registrado'
            });
        }
    }

    const updateData = {
        nombre,
        apellidos,
        dni: dni || '',
        telefono,
        email: email || '',
        direccion: direccion || '',
        fechaNacimiento: fechaNacimiento || null,
        estado: estado || 'pendiente',
        pagado: estado === 'activo'
    };

    socio = await Member.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: socio
    });
});

// @desc    Eliminar socio
// @route   DELETE /api/socios/:id
// @access  Private (Admin)
export const deleteSocio = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const socio = await Member.findById(req.params.id);

    if (!socio) {
        return res.status(404).json({
            success: false,
            error: 'Socio no encontrado'
        });
    }

    await socio.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Cambiar estado de socio
// @route   PATCH /api/socios/:id/estado
// @access  Private (Admin)
export const changeSocioStatus = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { estado } = req.body;

    const estadosValidos = ['pendiente', 'activo', 'inactivo'];
    if (!estadosValidos.includes(estado)) {
        return res.status(400).json({
            success: false,
            error: 'Estado no válido'
        });
    }

    const socio = await Member.findById(req.params.id);

    if (!socio) {
        return res.status(404).json({
            success: false,
            error: 'Socio no encontrado'
        });
    }

    socio.estado = estado;
    socio.pagado = estado === 'activo';

    if (estado === 'activo') {
        socio.fechaConfirmacion = new Date();
    }

    await socio.save();

    res.status(200).json({
        success: true,
        data: socio
    });
});

// @desc    Obtener estadísticas de socios
// @route   GET /api/socios/stats
// @access  Private (Admin)
export const getSociosStats = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const total = await Member.countDocuments({ isActive: true });
    const activos = await Member.countDocuments({ estado: 'activo', isActive: true });
    const pendientes = await Member.countDocuments({ estado: 'pendiente', isActive: true });
    const inactivos = await Member.countDocuments({ estado: 'inactivo', isActive: true });

    res.status(200).json({
        success: true,
        data: {
            total,
            activos,
            pendientes,
            inactivos
        }
    });
});

// @desc    Importar socios desde CSV
// @route   POST /api/socios/import
// @access  Private (Admin)
export const importSocios = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { socios, overwrite } = req.body;

    if (!Array.isArray(socios)) {
        return res.status(400).json({
            success: false,
            error: 'Datos de socios inválidos'
        });
    }

    const results = {
        imported: 0,
        updated: 0,
        errors: []
    };

    for (const socioData of socios) {
        try {
            const { nombre, apellidos, dni, telefono, email, direccion, fechaNacimiento } = socioData;

            if (!nombre || !apellidos || !telefono) {
                results.errors.push(`Socio ${nombre || 'N/A'}: Faltan campos obligatorios`);
                continue;
            }

            // Buscar socio existente
            let existingSocio = null;
            if (dni) {
                existingSocio = await Member.findOne({ dni });
            }
            if (!existingSocio && telefono) {
                existingSocio = await Member.findOne({ telefono });
            }

            if (existingSocio) {
                if (overwrite) {
                    // Actualizar socio existente
                    Object.assign(existingSocio, {
                        nombre,
                        apellidos,
                        dni: dni || existingSocio.dni,
                        telefono,
                        email: email || existingSocio.email,
                        direccion: direccion || existingSocio.direccion,
                        fechaNacimiento: fechaNacimiento || existingSocio.fechaNacimiento
                    });
                    await existingSocio.save();
                    results.updated++;
                } else {
                    results.errors.push(`Socio ${nombre} ${apellidos}: Ya existe`);
                }
            } else {
                // Crear nuevo socio
                await Member.create({
                    nombre,
                    apellidos,
                    dni: dni || '',
                    telefono,
                    email: email || '',
                    direccion: direccion || '',
                    fechaNacimiento: fechaNacimiento || null,
                    estado: 'pendiente',
                    pagado: false,
                    fechaRegistro: new Date(),
                    isActive: true
                });
                results.imported++;
            }
        } catch (error) {
            results.errors.push(`Error procesando socio: ${error.message}`);
        }
    }

    res.status(200).json({
        success: true,
        data: results
    });
});

// @desc    Exportar socios a CSV
// @route   GET /api/socios/export
// @access  Private (Admin)
export const exportSocios = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const socios = await Member.find({ isActive: true }).sort({ createdAt: -1 });

    const csvData = socios.map(socio => ({
        numeroSocio: socio.numeroSocio,
        nombre: socio.nombre,
        apellidos: socio.apellidos,
        dni: socio.dni,
        telefono: socio.telefono,
        email: socio.email,
        direccion: socio.direccion,
        fechaNacimiento: socio.fechaNacimiento,
        estado: socio.estado,
        fechaRegistro: socio.fechaRegistro
    }));

    res.status(200).json({
        success: true,
        data: csvData
    });
});

