const mongoose = require('mongoose');
const Users = require('./Users');

const { Schema } = mongoose;

const advertsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: 'no-image.jpg',
    },

    description: {
      type: String,
      maxlength: 150,
    },

    price: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      enum: ['sell', 'buy'],
      required: true,
    },

    tags: {
      type: [String],
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },

    state: {
      type: String,
      enum: ['reserved', 'sold'],
    },

    favorites: [{ type: Schema.ObjectId, ref: 'Adverts' }],
  },
  { timestamps: true },
);

// Methods
advertsSchema.statics.list = function (filter, limit, skip, sort) {
  const query = Adverts.find(filter)
    .sort({ createdAt: sort })
    .limit(limit)
    .skip(skip);
  return query.exec();
};

advertsSchema.statics.allowedTags = function () {
  return [
    'Tech',
    'Audio',
    'Lifestyle',
    'Sports',
    'Games',
    'Gaming',
    'Mobile',
    'Toys',
    'Home',
    'Forniture',
    'Photography',
  ];
};

// Model
const Adverts = mongoose.model('Adverts', advertsSchema);

module.exports = Adverts;
