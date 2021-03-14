const mongoose = require('mongoose');

const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const usuarioSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    surname: {
      type: String,
    },

    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },

    resetPasswordToken: {
      type: String,
    },

    resetPasswordTokenExpire: {
      type: Date,
    },

    avatar: {
      type: String,
      default: 'avatar.png',
    },

    favorites: [{ type: Schema.ObjectId, ref: 'Adverts' }],
  },

  {
    timestamps: true,
  }
);

// eslint-disable-next-line func-names
usuarioSchema.statics.hashPassword = function (plainTextPass) {
  return bcrypt.hash(plainTextPass, 12);
};

const Users = mongoose.model('Users', usuarioSchema);

module.exports = Users;
