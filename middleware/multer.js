/* eslint-disable indent,object-shorthand */
const multer = require("multer");
const path = require("path");

const storage = (folder) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./public/images/${folder}`);
    },
    filename: function (req, file, cb) {
      const { username } = req.body;
      cb(
        null,
        folder === "avatar"
          ? `${folder}-${username}-${Date.now()}${path.extname(
              file.originalname
            )}`
          : `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
      );
    },
  });

const upload = (folder) => multer({ storage: storage(folder) });

/*const uploadAvatar = upload('avatar').single('avatar');
const uploadAdvert = upload('advert').single('image');*/

module.exports = {
  upload,
};
