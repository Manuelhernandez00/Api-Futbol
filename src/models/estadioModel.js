const db = require('../config/dbConfig');
// Consulta base con JOIN: devuelve también los nombres de las tablas relacionadas
const BASE = `SELECT s.id_estadio, s.nombre, s.ciudad, s.capacidad FROM estadio s`;

// Filtros permitidos por parámetros de consulta (?campo=valor)
const FILTROS_IGUAL = { ciudad: 's.ciudad' };
const FILTROS_LIKE = { nombre: 's.nombre' };

module.exports = {

    getEstadios: (filtros, callback) => {
        const condiciones = [];
        const valores = [];

        Object.keys(FILTROS_IGUAL).forEach((campo) => {
            if (filtros[campo] !== undefined && filtros[campo] !== '') {
                condiciones.push(`${FILTROS_IGUAL[campo]} = ?`);
                valores.push(String(filtros[campo]));
            }
        });

        Object.keys(FILTROS_LIKE).forEach((campo) => {
            if (filtros[campo] !== undefined && filtros[campo] !== '') {
                condiciones.push(`${FILTROS_LIKE[campo]} LIKE ?`);
                valores.push(`%${String(filtros[campo])}%`);
            }
        });

        const where = condiciones.length > 0 ? ' WHERE ' + condiciones.join(' AND ') : '';
        db.query(`${BASE}${where} ORDER BY s.id_estadio`, valores, callback);
    },

    getEstadioById: (id, callback) => {
        db.query(`${BASE} WHERE s.id_estadio = ?`, [id], callback);
    },

    postEstadio: (datos, callback) => {
        const sql = 'INSERT INTO estadio (nombre, ciudad, capacidad) VALUES (?, ?, ?)';
        db.query(sql, [datos.nombre, datos.ciudad, datos.capacidad], callback);
    },

    putEstadio: (id, datos, callback) => {
        const sql = 'UPDATE estadio SET nombre = ?, ciudad = ?, capacidad = ? WHERE id_estadio = ?';
        db.query(sql, [datos.nombre, datos.ciudad, datos.capacidad, id], callback);
    },

    deleteEstadio: (id, callback) => {
        db.query('DELETE FROM estadio WHERE id_estadio = ?', [id], callback);
    }
};
