const db = require('../config/dbConfig');
// Consulta base con JOIN: devuelve también los nombres de las tablas relacionadas
const BASE = `SELECT g.id_gol, g.id_partido, g.id_jugador, j.nombre AS jugador, g.minuto, g.tipo FROM gol g JOIN jugador j ON j.id_jugador = g.id_jugador`;

// Filtros permitidos por parámetros de consulta (?campo=valor)
const FILTROS_IGUAL = { id_partido: 'g.id_partido', id_jugador: 'g.id_jugador', tipo: 'g.tipo' };
const FILTROS_LIKE = {};

module.exports = {

    getGoles: (filtros, callback) => {
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
        db.query(`${BASE}${where} ORDER BY g.id_gol`, valores, callback);
    },

    getGolById: (id, callback) => {
        db.query(`${BASE} WHERE g.id_gol = ?`, [id], callback);
    },

    postGol: (datos, callback) => {
        const sql = 'INSERT INTO gol (id_partido, id_jugador, minuto, tipo) VALUES (?, ?, ?, ?)';
        db.query(sql, [datos.id_partido, datos.id_jugador, datos.minuto, datos.tipo], callback);
    },

    putGol: (id, datos, callback) => {
        const sql = 'UPDATE gol SET id_partido = ?, id_jugador = ?, minuto = ?, tipo = ? WHERE id_gol = ?';
        db.query(sql, [datos.id_partido, datos.id_jugador, datos.minuto, datos.tipo, id], callback);
    },

    deleteGol: (id, callback) => {
        db.query('DELETE FROM gol WHERE id_gol = ?', [id], callback);
    }
};
