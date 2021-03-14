const fs = require("fs");
const Users = require("../models/Users");

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
    res.send({ message: 'Se ha registrado correctamente'});
    console.log(userSave);
    next();
  } catch (err) {
    //res.status(404).send({ message: 'Ha ocurrido un error durante el registro '});
    next(err);
  }
};

/* Function getUser */
exports.getUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (id === req.userId) {
      const userDetail = await Users.findById(id);

      /* Comprueba que exista algun usuario*/
      if (!userDetail) {
        res.send(404).json({ msg: "El usuario no existe" });
        next();
      }

      res.json({result:{
          name: userDetail.name,
          username: userDetail.username,
          email: userDetail.email,
          avatar: userDetail.avatar,
        }
        });
    } else {
      res.json({ msg: "no tienes permisos" });
    }
  } catch (err) {
    next();
  }
};

/* Function updateUser */

exports.updateUser = async (req, res, next) => {
  const { password } = req.body;

  try {
    if (req.params.id === req.userId) {
      const updatePassword = await Users.hashPassword(password);
      await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            name: req.body.name,
            username: req.body.username,
            surname: req.body.surname,
            email: req.body.email,
            password: updatePassword,
          },
        },

        { new: true },
        async (err, userUpdated) => {
          res.json(userUpdated);
        }
      );
    }

    res.json({ msg: "No tienes permiso" });
  } catch (err) {
    next();
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
        .json({ msg: "No existe el usuario en la base de datos." });
      next();
    }

    /* Comprobamos si el usuario recibido es el mismo que el que se almacena en el token*/
    if (userDelete._id == req.userId) {
      await Users.findByIdAndRemove(userDelete);

      /* Borra el usuario y la foto del avatar*/
      res.json({ msg: "Usuario Borrado Correctamente", del: userDelete });
      fs.unlinkSync(`./public/images/avatar/${userDelete.avatar}`);
      return;
    }
    res.status(401).json({
      msg: "No tienes permisos para hacer esto",
    });
    next();
  } catch (err) {
    next();
  }
};
