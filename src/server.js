require('dotenv').config();
const express = require('express');
const connectDB = require('../config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Conectar a DB
connectDB();

// Middleware
app.use(express.json());

// Rutas
app.get('/', (req, res) => {
    res.send('¡Backend funcionando correctamente!');
});

app.get('/api/test', (req, res) => {
    res.send('¡Hola desde el backend! 🚀');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
// ... (código existente)

// Rutas
app.use('/api/auth', require('../routes/authRoutes'));
app.use('/api/users', require('../routes/userRoutes'));

// ... (código existente)

const cors = require('cors');
app.use(cors());