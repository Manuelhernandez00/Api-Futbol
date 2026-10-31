const mysql = require('mysql2');

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
    dateStrings: true,
    waitForConnections: true,
    connectionLimit: 2,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('Error de conexion MYSQL:', err.message);
        return;
    }
    console.log('Conexion MYSQL exitosa');
    connection.release();
});

module.exports = db;
