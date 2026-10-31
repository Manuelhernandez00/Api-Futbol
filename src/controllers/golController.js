const golModel = require('../models/golModel');

// Reglas de validación de los datos de entrada
const REGLAS = [
    { campo: 'id_partido', tipo: 'entero', min: 1 },
    { campo: 'id_jugador', tipo: 'entero', min: 1 },
    { campo: 'minuto', tipo: 'entero', min: 1, max: 130 },
    { campo: 'tipo', tipo: 'lista', valores: ['Normal', 'Penal', 'Autogol'], defecto: 'Normal' }
];

function esVacio(valor) {
    return valor === undefined || valor === null || (typeof valor === 'string' && valor.trim() === '');
}

function esFecha(valor) {
    if (typeof valor !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
        return false;
    }
    const fecha = new Date(valor + 'T00:00:00Z');
    return !isNaN(fecha.getTime()) && fecha.toISOString().slice(0, 10) === valor;
}

function validar(body) {
    body = body || {};
    const errores = [];

    REGLAS.forEach((regla) => {
        const valor = body[regla.campo];

        if (esVacio(valor)) {
            if (!regla.opcional && regla.defecto === undefined) {
                errores.push(`${regla.campo} es obligatorio`);
            }
            return;
        }

        if (regla.tipo === 'texto') {
            if (typeof valor !== 'string') {
                errores.push(`${regla.campo} debe ser texto`);
            } else if (valor.trim().length > regla.max) {
                errores.push(`${regla.campo} no puede superar ${regla.max} caracteres`);
            } else if (regla.patron && !regla.patron.test(valor.trim())) {
                errores.push(`${regla.campo} ${regla.mensajePatron}`);
            }
        } else if (regla.tipo === 'entero') {
            const numero = Number(valor);
            if ((typeof valor !== 'number' && typeof valor !== 'string') || !Number.isInteger(numero)) {
                errores.push(`${regla.campo} debe ser un número entero`);
            } else if (regla.min !== undefined && numero < regla.min) {
                errores.push(`${regla.campo} debe ser mayor o igual a ${regla.min}`);
            } else if (regla.max !== undefined && numero > regla.max) {
                errores.push(`${regla.campo} debe ser menor o igual a ${regla.max}`);
            }
        } else if (regla.tipo === 'fecha') {
            if (!esFecha(valor)) {
                errores.push(`${regla.campo} debe ser una fecha válida con formato AAAA-MM-DD`);
            }
        } else if (regla.tipo === 'lista') {
            if (!regla.valores.includes(valor)) {
                errores.push(`${regla.campo} debe ser uno de: ${regla.valores.join(', ')}`);
            }
        }
    });


    return errores;
}

// Deja los datos listos para guardar: texto sin espacios sobrantes, números como número, vacíos como null
function limpiar(body) {
    body = body || {};
    const datos = {};

    REGLAS.forEach((regla) => {
        let valor = body[regla.campo];

        if (esVacio(valor)) {
            datos[regla.campo] = regla.defecto !== undefined ? regla.defecto : null;
            return;
        }
        if (regla.tipo === 'texto') {
            valor = valor.trim();
        }
        if (regla.tipo === 'entero') {
            valor = Number(valor);
        }
        datos[regla.campo] = valor;
    });

    return datos;
}

function idValido(valor) {
    const id = Number(valor);
    return Number.isInteger(id) && id > 0 ? id : null;
}

function responderError(err, res) {
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            ok: false,
            error: 'Ya existe un registro con un valor único repetido',
            detalle: err.sqlMessage
        });
    }
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({
            ok: false,
            error: 'Una de las referencias (llave foránea) no existe',
            detalle: err.sqlMessage
        });
    }
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({
            ok: false,
            error: 'No se puede eliminar o modificar: otros registros dependen de este',
            detalle: err.sqlMessage
        });
    }
    console.error(err);
    return res.status(500).json({ ok: false, error: 'Error interno del servidor' });
}

module.exports = {

    getGoles: (req, res) => {
        golModel.getGoles(req.query, (err, result) => {
            if (err) {
                return responderError(err, res);
            }
            res.status(200).json({ ok: true, total: result.length, data: result });
        });
    },

    getGolById: (req, res) => {
        const id = idValido(req.params.id);
        if (id === null) {
            return res.status(400).json({ ok: false, error: 'El id debe ser un número entero positivo' });
        }

        golModel.getGolById(id, (err, result) => {
            if (err) {
                return responderError(err, res);
            }
            if (result.length === 0) {
                return res.status(404).json({ ok: false, error: 'Gol no encontrado' });
            }
            res.status(200).json({ ok: true, data: result[0] });
        });
    },

    postGol: (req, res) => {
        const errores = validar(req.body);
        if (errores.length > 0) {
            return res.status(400).json({ ok: false, error: 'Datos inválidos', detalles: errores });
        }

        golModel.postGol(limpiar(req.body), (err, result) => {
            if (err) {
                return responderError(err, res);
            }
            golModel.getGolById(result.insertId, (err2, filas) => {
                if (err2) {
                    return responderError(err2, res);
                }
                res.status(201).json({ ok: true, mensaje: 'Gol creado correctamente', data: filas[0] });
            });
        });
    },

    putGol: (req, res) => {
        const id = idValido(req.params.id);
        if (id === null) {
            return res.status(400).json({ ok: false, error: 'El id debe ser un número entero positivo' });
        }
        const errores = validar(req.body);
        if (errores.length > 0) {
            return res.status(400).json({ ok: false, error: 'Datos inválidos', detalles: errores });
        }

        golModel.putGol(id, limpiar(req.body), (err, result) => {
            if (err) {
                return responderError(err, res);
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ ok: false, error: 'Gol no encontrado' });
            }
            golModel.getGolById(id, (err2, filas) => {
                if (err2) {
                    return responderError(err2, res);
                }
                res.status(200).json({ ok: true, mensaje: 'Gol actualizado correctamente', data: filas[0] });
            });
        });
    },

    deleteGol: (req, res) => {
        const id = idValido(req.params.id);
        if (id === null) {
            return res.status(400).json({ ok: false, error: 'El id debe ser un número entero positivo' });
        }

        golModel.deleteGol(id, (err, result) => {
            if (err) {
                return responderError(err, res);
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ ok: false, error: 'Gol no encontrado' });
            }
            res.status(200).json({ ok: true, mensaje: 'Gol eliminado correctamente' });
        });
    }
};
