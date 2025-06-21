const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendWelcomeEmail } = require('../utils/mailer');

exports.register = async (req, res) => {
try {
    const { name, email, password } = req.body;
    
    // Verificar si el usuario ya existe
    let user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ error: 'El usuario ya existe' });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear nuevo usuario
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Enviar email de bienvenida
    await sendWelcomeEmail(email, name);

    // Crear y devolver token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h'
    });

    res.json({ token });
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
    }
};

exports.login = async (req, res) => {
    try {
    const { email, password } = req.body;
    
    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    // Crear y devolver token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });

    res.json({ token });
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
    }
};
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    
    try {
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }

      // Crear token con expiración de 10 minutos
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '10m'
    });

      // Enviar email con enlace de recuperación
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        to: email,
        subject: 'Recuperación de Contraseña',
        html: `<p>Hola ${user.name},</p>
            <p>Recibimos una solicitud para restablecer tu contraseña.</p>
            <p>Haz clic en el siguiente enlace para continuar:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>Si no solicitaste este cambio, ignora este mensaje.</p>`
    });

    res.json({ message: 'Instrucciones enviadas a tu email' });
    } catch (error) {
        console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
    }
};