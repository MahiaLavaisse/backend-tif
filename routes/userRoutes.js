const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const User = require('../models/User');

// Ruta protegida que requiere autenticación
router.get('/me', protect, async (req, res) => {
try {
    const user = await User.findById(req.user).select('-password');
    res.json(user);
} catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
}
});

module.exports = router;