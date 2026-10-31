const db = require('../config/dbConfig');
// Consulta base con JOIN: devuelve también los nombres de las tablas relacionadas
const BASE = `SELECT p.id_pais, p.nombre, p.codigo_iso FROM pais p`;

// Filtros permitidos por parámetros de consulta (?campo=valor)
const FILTROS_IGUAL = { codigo_iso: 'p.codigo_iso' };
const FILTROS_LIKE = { nombre: 'p.nombre' };

module.exports = {

    getPaises: (filtros, callback) => {
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
        db.query(`${BASE}${where} ORDER BY p.id_pais`, valores, callback);
    },

    getPaisById: (id, callback) => {
        db.query(`${BASE} WHERE p.id_pais = ?`, [id], callback);
    },

    postPais: (datos, callback) => {
        const sql = 'INSERT INTO pais (nombre, codigo_iso) VALUES (?, ?)';
        db.query(sql, [datos.nombre, datos.codigo_iso], callback);
    },

    putPais: (id, datos, callback) => {
        const sql = 'UPDATE pais SET nombre = ?, codigo_iso = ? WHERE id_pais = ?';
        db.query(sql, [datos.nombre, datos.codigo_iso, id], callback);
    },

    deletePais: (id, callback) => {
        db.query('DELETE FROM pais WHERE id_pais = ?', [id], callback);
    }
};
