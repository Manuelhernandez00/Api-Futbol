require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const paisRoutes = require('./src/routes/paisRoutes');
const estadioRoutes = require('./src/routes/estadioRoutes');
const equipoRoutes = require('./src/routes/equipoRoutes');
const jugadorRoutes = require('./src/routes/jugadorRoutes');
const partidoRoutes = require('./src/routes/partidoRoutes');
const golRoutes = require('./src/routes/golRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.status(200).json({
        ok: true,
        mensaje: 'API de fútbol funcionando',
        recursos: ['/api/paises', '/api/estadios', '/api/equipos', '/api/jugadores', '/api/partidos', '/api/goles']
    });
});

app.use('/api/paises', paisRoutes);
app.use('/api/estadios', estadioRoutes);
app.use('/api/equipos', equipoRoutes);
app.use('/api/jugadores', jugadorRoutes);
app.use('/api/partidos', partidoRoutes);
app.use('/api/goles', golRoutes);

// Ruta que no existe
app.use((req, res) => {
    res.status(404).json({ ok: false, error: 'Ruta no encontrada' });
});

// JSON mal formado u otros errores no controlados
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ ok: false, error: 'El cuerpo de la petición no es un JSON válido' });
    }
    console.error(err);
    res.status(500).json({ ok: false, error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
