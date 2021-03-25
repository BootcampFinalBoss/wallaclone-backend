/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable prefer-destructuring */
/* eslint-disable radix */
const { findById } = require('../models/Adverts');
const Adverts = require('../models/Adverts');
const Users = require('../models/Users');

exports.getAdvert = async function (req, res, next) {
  console.log('The logged in user has the _id:', req.apiAuthUserID);

  try {
    const { name } = req.query;
    const { price } = req.query;
    const { type } = req.query;
    const { tags } = req.query;

    // Others
    const limit = parseInt(req.query.limit || 10);
    const skip = parseInt(req.query.skip || 0);
    const sort = req.query.sort || -1;

    // Search filters
    const filter = {};

    if (typeof name !== 'undefined') {
      filter.name = new RegExp(`^${name}`, 'i');
    }

    if (typeof price !== 'undefined' && price !== '-') {
      if (price.indexOf('-') !== -1) {
        filter.price = {};
        const range = price.split('-');
        if (range[0] !== '') {
          filter.price.$gte = range[0];
        }
        if (range[1] !== '') {
          filter.price.$lte = range[1];
        }
      } else {
        filter.price = price;
      }
    }

    if (typeof tags !== 'undefined') {
      filter.tags = tags;
    }

    if (typeof type !== 'undefined') {
      filter.type = type;
    }

    const adverts = await Adverts.list(filter, limit, skip, sort);
    return await Users.populate(
      adverts,
      { path: 'user' },
      function (err, adverts) {
        res.json({ result: adverts });
      },
    );
  } catch (err) {
    next(err);
  }
};

// Get an advert by id
exports.getAdvertById = async (req, res, next) => {
  try {
    const { _id } = req.params;

    const advert = await Adverts.findOne({ _id });

    await Users.populate(advert, { path: 'user' }, function (err, advert) {
      res.json({ result: advert });
    });
  } catch (err) {
    next(err);
  }
};

// Create an advert --> POSt /api/adverts
exports.postAdvert = async (req, res, next) => {
  const cloudinary = require('cloudinary').v2;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  try {
    const { name, price, type, tags, description } = req.body;
    let image = req.file || null;
    let path;

    if (image) {
      image = req.file.filename;
      path = req.file.path;
    }

    if (path && image) {
      await cloudinary.uploader.upload(
        path,
        { public_id: `advert/${image}`, tags: `advert` }, // directory and tags are optional
        function (err, imageUpload) {
          if (err) return res.send(err);
          // remove file from server
          const fs = require('fs');
          fs.unlinkSync(path);
          // return image details
        },
      );
    }

    //const advertData = req.body;

    // We create a document in memory
    const setAdvert = {
      name,
      price,
      type,
      tags: tags.split(','),
      description,
      image,
      user: req.userId,
    };
    const advert = new Adverts(setAdvert);

    const user = await Users.findOneAndUpdate(
      { _id: req.userId },
      { $push: { adverts: [advert] } },
      { new: true },
    );

    // We save the document in the database
    const advertSaved = await advert.save();

    res.json({
      result: advertSaved,
      message: 'Advert created succesfully!',
    });
  } catch (err) {
    next(err);
  }
};

// Update an advert --> /api/adverts/:id
exports.putAdvert = async (req, res, next) => {
  const cloudinary = require('cloudinary').v2;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  try {
    // eslint-disable-next-line no-underscore-dangle
    const _id = req.params._id;
    const advertData = req.body;
    const oldAdvertData = await Adverts.findById(_id);
    let image = req.file || null;
    let path;

    if (image) {
      image = req.file.filename;
      path = req.file.path;
    } else {
      image = oldAdvertData.image;
    }

    if (path && image) {
      await cloudinary.uploader.upload(
        path,
        { public_id: `advert/${image}`, tags: `advert` }, // directory and tags are optional
        function (err, imageUpload) {
          if (err) return res.send(err);
          // remove file from server
          const fs = require('fs');
          fs.unlinkSync(path);
          // return image details
        },
      );
    }

    const advertSaved = await Adverts.findByIdAndUpdate(
      { _id },
      { ...advertData, tags: advertData.tags.split(','), image },
      {
        new: true,
        useFindAndModify: false,
      },
    );
    res.json({ message: 'Advert updated succesfully!', result: advertSaved });
  } catch (err) {
    next(err);
  }
};

// Add favorite to advert --> /api/adverts/favorite/:id
exports.advertAddFavorite = async (req, res, next) => {
  try {
    // eslint-disable-next-line no-underscore-dangle
    const advertId = req.params._id;
    const userId = req.userId;

    const advertModified = await Adverts.findByIdAndUpdate(
      advertId,
      { $push: { favorites: [userId] } },
      { new: true },
    );

    await Users.findByIdAndUpdate(
      userId,
      { $push: { favorites: [advertId] } },
      { new: true },
    );
    res.json({
      message: 'Added favorite!',
      result: advertModified,
    });
  } catch (err) {
    next(err);
  }
};

// Remove favorite from advert --> /api/adverts/favorite/:id
exports.advertRemoveFavorite = async (req, res, next) => {
  try {
    // eslint-disable-next-line no-underscore-dangle
    const advertId = req.params._id;
    const userId = req.userId;

    const advertModified = await Adverts.findByIdAndUpdate(
      advertId,
      { $pullAll: { favorites: [userId] } },
      { new: true },
    );

    await Users.findByIdAndUpdate(
      userId,
      { $pullAll: { favorites: [advertId] } },
      { new: true },
    );
    res.json({
      message: 'Removed favorite!',
      result: advertModified,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteAdvert = async (req, res, next) => {
  try {
    // eslint-disable-next-line no-underscore-dangle
    const _id = req.params._id;
    const userId = req.body.userId;

    const advertDeleted = await Adverts.deleteOne({ _id });

    await Users.findByIdAndUpdate(
      userId,
      { $pullAll: { adverts: [_id], favorites: [_id] } },
      { new: true },
    );

    res.send({ message: 'Advert deleted succesfully!', result: advertDeleted });
  } catch (err) {
    next(err);
  }
};

// Update state of an advert --> /api/adverts/state/:id
exports.updateAdvertState = async (req, res, next) => {
  try {
    // eslint-disable-next-line no-underscore-dangle
    const _id = req.params._id;
    const newState = req.body.newState;

    const advertSaved = await Adverts.findByIdAndUpdate(
      _id,
      { $set: { state: newState } },
      {
        new: true,
        useFindAndModify: false,
      },
    );

    res.json({ message: 'Advert updated succesfully!', result: advertSaved });
  } catch (err) {
    next(err);
  }
};
