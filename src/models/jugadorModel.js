const db = require('../config/dbConfig');
// Consulta base con JOIN: devuelve también los nombres de las tablas relacionadas
const BASE = `SELECT j.id_jugador, j.documento, j.nombre, j.fecha_nac, j.posicion, j.dorsal, j.id_equipo, e.nombre AS equipo FROM jugador j JOIN equipo e ON e.id_equipo = j.id_equipo`;

// Filtros permitidos por parámetros de consulta (?campo=valor)
const FILTROS_IGUAL = { id_equipo: 'j.id_equipo', posicion: 'j.posicion' };
const FILTROS_LIKE = { nombre: 'j.nombre' };

module.exports = {

    getJugadores: (filtros, callback) => {
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
        db.query(`${BASE}${where} ORDER BY j.id_jugador`, valores, callback);
    },

    getJugadorById: (id, callback) => {
        db.query(`${BASE} WHERE j.id_jugador = ?`, [id], callback);
    },

    postJugador: (datos, callback) => {
        const sql = 'INSERT INTO jugador (documento, nombre, fecha_nac, posicion, dorsal, id_equipo) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(sql, [datos.documento, datos.nombre, datos.fecha_nac, datos.posicion, datos.dorsal, datos.id_equipo], callback);
    },

    putJugador: (id, datos, callback) => {
        const sql = 'UPDATE jugador SET documento = ?, nombre = ?, fecha_nac = ?, posicion = ?, dorsal = ?, id_equipo = ? WHERE id_jugador = ?';
        db.query(sql, [datos.documento, datos.nombre, datos.fecha_nac, datos.posicion, datos.dorsal, datos.id_equipo, id], callback);
    },

    deleteJugador: (id, callback) => {
        db.query('DELETE FROM jugador WHERE id_jugador = ?', [id], callback);
    }
};
