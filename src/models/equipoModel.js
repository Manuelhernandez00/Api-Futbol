const db = require('../config/dbConfig');
// Consulta base con JOIN: devuelve también los nombres de las tablas relacionadas
const BASE = `SELECT e.id_equipo, e.nombre, e.fundacion, e.id_pais, p.nombre AS pais, e.id_estadio, s.nombre AS estadio FROM equipo e JOIN pais p ON p.id_pais = e.id_pais LEFT JOIN estadio s ON s.id_estadio = e.id_estadio`;

// Filtros permitidos por parámetros de consulta (?campo=valor)
const FILTROS_IGUAL = { id_pais: 'e.id_pais' };
const FILTROS_LIKE = { nombre: 'e.nombre' };

module.exports = {

    getEquipos: (filtros, callback) => {
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
        db.query(`${BASE}${where} ORDER BY e.id_equipo`, valores, callback);
    },

    getEquipoById: (id, callback) => {
        db.query(`${BASE} WHERE e.id_equipo = ?`, [id], callback);
    },

    postEquipo: (datos, callback) => {
        const sql = 'INSERT INTO equipo (nombre, fundacion, id_pais, id_estadio) VALUES (?, ?, ?, ?)';
        db.query(sql, [datos.nombre, datos.fundacion, datos.id_pais, datos.id_estadio], callback);
    },

    putEquipo: (id, datos, callback) => {
        const sql = 'UPDATE equipo SET nombre = ?, fundacion = ?, id_pais = ?, id_estadio = ? WHERE id_equipo = ?';
        db.query(sql, [datos.nombre, datos.fundacion, datos.id_pais, datos.id_estadio, id], callback);
    },

    deleteEquipo: (id, callback) => {
        db.query('DELETE FROM equipo WHERE id_equipo = ?', [id], callback);
    }
};
