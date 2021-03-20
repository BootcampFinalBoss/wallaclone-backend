const { validationResult } = require('express-validator');
const { check } = require('express-validator');
const User = require('../models/Users');

exports.validateUser = [
  check('name')
    .trim()
    .toLowerCase()
    .not()
    .isEmpty()
    .withMessage('El nombre es obligatorio.')
    .bail(),
  check('username')
    .trim()
    .escape()
    .not()
    .toLowerCase()
    .isEmpty()
    .withMessage('El nombre de usuario es obligatorio.')
    .bail(),
  check('email')
    .trim()
    .toLowerCase()
    .not()
    .isEmpty()
    .withMessage('El email es obligatorio.')
    .bail(),
  check('password')
    .not()
    .isEmpty()
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .bail(),
  check('username').custom(async (username = '') => {
    const usernameDuplicate = await User.findOne({ username });
    if (usernameDuplicate) {
      throw new Error('El nombre de usuario ya existe');
    }
  }),
  check('email').custom(async (email = '') => {
    const emailDuplicate = await User.findOne({ email });
    if (emailDuplicate) {
      throw new Error('El email existe en la base de datos');
    }
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) res.status(422).json({ errors: errors.array() });
    next();
  },
];


