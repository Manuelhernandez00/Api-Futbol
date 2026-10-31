const db = require('../config/dbConfig');
// Consulta base con JOIN: devuelve también los nombres de las tablas relacionadas
const BASE = `SELECT m.id_partido, m.fecha, m.id_local, l.nombre AS local, m.id_visitante, v.nombre AS visitante, m.id_estadio, s.nombre AS estadio FROM partido m JOIN equipo l ON l.id_equipo = m.id_local JOIN equipo v ON v.id_equipo = m.id_visitante JOIN estadio s ON s.id_estadio = m.id_estadio`;

// Filtros permitidos por parámetros de consulta (?campo=valor)
const FILTROS_IGUAL = { id_local: 'm.id_local', id_visitante: 'm.id_visitante', id_estadio: 'm.id_estadio', fecha: 'm.fecha' };
const FILTROS_LIKE = {};

module.exports = {

    getPartidos: (filtros, callback) => {
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
        db.query(`${BASE}${where} ORDER BY m.id_partido`, valores, callback);
    },

    getPartidoById: (id, callback) => {
        db.query(`${BASE} WHERE m.id_partido = ?`, [id], callback);
    },

    postPartido: (datos, callback) => {
        const sql = 'INSERT INTO partido (fecha, id_local, id_visitante, id_estadio) VALUES (?, ?, ?, ?)';
        db.query(sql, [datos.fecha, datos.id_local, datos.id_visitante, datos.id_estadio], callback);
    },

    putPartido: (id, datos, callback) => {
        const sql = 'UPDATE partido SET fecha = ?, id_local = ?, id_visitante = ?, id_estadio = ? WHERE id_partido = ?';
        db.query(sql, [datos.fecha, datos.id_local, datos.id_visitante, datos.id_estadio, id], callback);
    },

    deletePartido: (id, callback) => {
        db.query('DELETE FROM partido WHERE id_partido = ?', [id], callback);
    }
};
