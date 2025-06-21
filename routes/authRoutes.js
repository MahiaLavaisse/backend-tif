const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { check } = require('express-validator');
const validate = require('../middlewares/validationMiddleware');

const registerValidation = [
check('name')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 3 }).withMessage('Mínimo 3 caracteres'),

check('email')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),

check('password')
    .isLength({ min: 6 }).withMessage('Mínimo 6 caracteres')
    .matches(/\d/).withMessage('Debe contener al menos un número')
];

const loginValidation = [
check('email')
    .isEmail().withMessage('Email inválido'),

check('password')
    .notEmpty().withMessage('Contraseña requerida')
];

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);

module.exports = router;

const { forgotPassword } = require('../controllers/authController');

// ...

router.post('/forgot-password', [
check('email').isEmail().withMessage('Email inválido')
], validate, forgotPassword);