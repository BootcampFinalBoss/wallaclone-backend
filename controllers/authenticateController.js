const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Users = require("../models/Users");

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await Users.findOne({ username });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    res
      .status(404)
      .send({ message: "El nombre de usuario o la contraseña es incorrecto" });
  } else {
    const token = jwt.sign(
      {
        email: user.email,
        username: user.username,
        id: user._id,
      },
      process.env.KEY_SECRET,
      { expiresIn: "2d" }
    );

    res.json({ token });
  }
};
/* await res.status(401).json({ msg: "No existe el usuario." });
      next();
    } else if (!bcrypt.compareSync(password, user.password)) {
      await res.status(404).send({ message: "La Contraseña no es correcta." });
      next();
    } else {*/

/* Función Reset Password */

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (email === "") {
    res.json({ msg: "El email no puede estar vacio" });
  }
  const user = await Users.findOne({ email });

  try {
    if (!user) {
      res.status(404).json({ msg: "El usuario no existe en la BD" });
      next();
    }

    const token = crypto.randomBytes(20).toString("hex");

    const update = {
      resetPasswordToken: token,
      resetPasswordTokenExpire: Date.now() + 250000,
    };

    await Users.findByIdAndUpdate(user, update, {
      new: true,
    });

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "<bcfinalboss@gmail.com>",
      to: "bcfinalboss@gmail.com",
      subject: "Reset Password",
      html: `<p>Hola ${user.name},</p> 
    <p>Ha solicitado el cambio de contraseña</p>
    <p>Pulse el siguiente link: http://localhost:3000/reset/${token}</p>
    <p>Saludos.</p>
`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        res.send(500, err.message);
      } else {
        res.status(200).send({ msg: "El correo se ha enviado correctamente" });
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const tokenValid = await Users.findOne({
    resetPasswordToken: token,
    resetPasswordTokenExpire: { $gt: Date.now() },
  });
  try {
    if (tokenValid !== null) {
      res.json({ msg: "Introduzca la nueva contraseña" });
      next();
    }
  } catch (err) {
    res.json({
      msg: "El token no es válido o ha expirado solicite un nuevo link",
    });
  }
};

exports.resetPasswordMail = async (req, res, next) => {
  const { password } = req.body;
  const { token } = req.params;

  const user = await Users.findOne({
    resetPasswordToken: token,
    resetPasswordTokenExpire: { $gt: Date.now() },
  });

  try {
    if (user) {
      const newPassword = await Users.hashPassword(password);

      await Users.findOneAndUpdate(
        { resetPasswordToken: token },
        {
          $set: {
            password: newPassword,
            resetPasswordToken: null,
            resetPasswordTokenExpire: null,
          },
        },
        { new: true },
        (err, resetPassword) => {
          res.json({
            msg: "Contraseña actualizada correctamente",
            resetPassword,
          });
        }
      );
    } else {
      res.status(404).json({
        msg: "El link no es valido o ha expirado.",
      });
    }
  } catch (err) {
    next();
  }
};
