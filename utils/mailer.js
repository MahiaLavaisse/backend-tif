const nodemailer = require('nodemailer');

exports.sendWelcomeEmail = async (email, name) => {
    try {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
    from: `"Tu App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '¡Bienvenido a nuestra plataforma!',
    html: `<h1>Hola ${name},</h1>
            <p>Gracias por registrarte en nuestra aplicación.</p>
            <p>¡Esperamos que disfrutes de nuestra plataforma!</p>`
    });

    console.log('Email de bienvenida enviado');
} catch (error) {
    console.error('Error enviando email:', error);
}
};