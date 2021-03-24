const fs = require('fs');
const Adverts = require('../models/Adverts');
const Users = require('../models/Users');
const { validateUser } = require('../middleware/validateUser');

/* Function createUser */

exports.createUser = async (req, res, next) => {
  const { name, surname, email, username } = req.body;
  let avatar = req.file;

  /* Hasheo de password*/
  const passHash = await Users.hashPassword(req.body.password);

  /* Comprueba si viene archivo dentro de la key avatar
  si no viene fichero le asigna la img por defecto */
  if (!avatar) {
    avatar = Users.avatar;
  } else {
    avatar = req.file.filename;
  }
  try {
    /* Creo objetos datos usuario*/
    const userData = {
      name,
      username,
      password: passHash,
      email,
      surname,
      avatar,
    };

    /*Almaceno usuario en DB*/
    const user = new Users(userData);
    const userSave = await user.save();
    res.send({ message: 'Se ha registrado correctamente' });
    next();
  } catch (err) {
    //res.status(404).send({ message: 'Ha ocurrido un error durante el registro '});
    next(err);
  }
};

/* Function getUser */
exports.getUser = async (req, res, next) => {
  const { username } = req.params;
  try {
    const userDetail = await Users.findOne({ username })
      .populate('adverts')
      .populate('favorites');

    const result = {
      name: userDetail.name,
      surname: userDetail.surname,
      username: userDetail.username,
      email: userDetail.email,
      avatar: userDetail.avatar,
      surname: userDetail.surname,
      adverts: userDetail.adverts,
      favorites: userDetail.favorites,
    };

    /* Comprueba que exista algun usuario*/
    if (!result) {
      res.send(404).json({ msg: 'El usuario no existe' });
      next();
    }

    res.json({
      result: result,
    });
  } catch (err) {
    next();
  }
};

/* Function updateUser */

exports.updateUser = async (req, res, next) => {
  const { name, username, surname, email } = req.body;
  const { id } = req.params;
  try {
    const userLogged = await Users.findById(id);

    let fieldToUpdate = {
      name,
      username,
      surname,
      email,
    };

    for (const [key, value] of Object.entries(fieldToUpdate)) {
      if (userLogged.name === value) {
        delete fieldToUpdate[key];
      }

      if (userLogged.username === value) {
        delete fieldToUpdate[key];
      }

      if (userLogged.email === value) {
        delete fieldToUpdate[key];
      }

      if (userLogged.surname === value) {
        delete fieldToUpdate[key];
      }
    }

    const userDataEmail = await Users.findOne({ email: fieldToUpdate.email });
    const userDataUsername = await Users.findOne({
      username: fieldToUpdate.username,
    });

    if (userDataEmail) {
      throw new Error('El email ya existe');
    } else if (userDataUsername) {
      throw new Error('El usuario ya existe');
    }

    const user = await Users.findByIdAndUpdate(
      userLogged,
      { $set: { ...fieldToUpdate } },
      {
        runValidators: true,
        new: true,
      },
    );

    res.send('El usuario se actualizo correctamente');
  } catch (error) {
    res.status(422).send({ message: error.message });
  }
};

/* Function deleteUser */

exports.deleteUser = async (req, res, next) => {
  const userDelete = await Users.findById(req.params.id);
  try {
    /* Comprobamos que exista el usuario */
    if (!userDelete) {
      res
        .status(404)
        .json({ msg: 'No existe el usuario en la base de datos.' });
      next();
    }

    /* Comprobamos si el usuario recibido es el mismo que el que se almacena en el token*/
    if (userDelete._id == req.userId) {
      await Users.deleteMany(userDelete);
      const prueba1 = await Adverts.deleteMany({ user: userDelete });

      /* Borra el usuario y la foto del avatar*/
      res.json({ msg: 'Usuario Borrado Correctamente' });
      //fs.unlinkSync(`./public/images/avatar/${userDelete.avatar}`);
      return;
    }
    res.status(401).json({
      msg: 'No tienes permisos para hacer esto',
    });
    next();
  } catch (err) {
    next(err);
  }
};
