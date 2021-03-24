const express = require('express');

const router = express.Router();
const UserController = require('../controllers/UserController');
const AuthController = require('../controllers/authenticateController');
const auth = require('../middleware/auth');
const { upload } = require('../middleware/multer');
const { validateUser } = require('../middleware/validateUser');

module.exports = function () {
  /* Routes CRUD User */
  router.get('/', function (req, res) {
    var path = __dirname + '../readme.md';
    var file = fs.readFileSync(path, 'utf8');
    res.send(marked(file.toString()));
  });

  return router;
};
