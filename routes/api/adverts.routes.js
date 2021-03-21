const express = require('express');
// const multer = require('multer');
const router = express.Router();
const { upload } = require('../../middleware/multer');
const advertController = require('../../controllers/advertController');
const auth = require('../../middleware/auth');
const Adverts = require('../../models/Adverts');

/**
 *  Get /api/adverts
 */
router.get('/adverts', advertController.getAdvert);

/**
 * GET /api/adverts/<_id>
 */
router.get('/adverts/:_id', advertController.getAdvertById);

/**
 * POST /api/adverts
 */
router.post(
  '/adverts',
  auth,
  upload('advert').single('image'),
  advertController.postAdvert,
);

/**
 * PUT /api/adverts/<_id>
 */
router.put('/adverts/:_id', auth, advertController.putAdvert);

/**
 * DELETE /api/adverts/<_id>
 */
router.delete('/adverts/:_id', auth, advertController.deleteAdvert);

/**
 * POST FAVORITE /api/adverts/favorite/<_id>
 */
router.post('/adverts/favorite/:_id', auth, advertController.advertAddFavorite);

/**
 * DELETE FAVORITE /api/adverts/favorite/<_id>
 */
router.delete(
  '/adverts/favorite/:_id',
  auth,
  advertController.advertRemoveFavorite,
);

/**
 * GET /api/adverts-user/<_id>
 */

/*router.get("/adverts-user/:id", advertController.getUserAdverts);*/

/**
 * PUT /api/advert-reserved/<_id>
 */

router.put("/advert-reserved/:id", auth, advertController.reservedAdvert);

/**
 * PUT /api/advert-sold/<_id>
 */

router.put("/advert-sold/:id", auth, advertController.soldAdvert);

/**
 * GET /api/tags
 */
router.get('/tags', function (req, res) {
  res.json({ result: Adverts.allowedTags() });
});

module.exports = router;
