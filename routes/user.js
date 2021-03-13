const express = require('express');

const router = express.Router();
const UserController = require('../controllers/UserController');
const AuthController = require('../controllers/authenticateController');
const auth = require('../middleware/auth');
const { upload } = require('../middleware/multer');
const { validateUser } = require('../middleware/validateUser');

module.exports = function () {
  /* Routes CRUD User */

  router.post(
    '/user',
    upload('avatar').single('avatar'),
    validateUser,
    UserController.createUser
  );

  router.get('/user/:id', auth, UserController.getUser);
  router.put('/user/:id', auth, validateUser, UserController.updateUser);
  router.delete('/user/:id', auth, UserController.deleteUser);
  router.post('/user/login', AuthController.login);
  router.post('/user/forgot-password', AuthController.forgotPassword);
  router.get('/reset/:token', AuthController.resetPassword);
  router.put('/reset-password/:token', AuthController.resetPasswordMail);

  return router;
};
