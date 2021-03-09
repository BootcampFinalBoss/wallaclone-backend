const express = require("express");
// const multer = require('multer');
const router = express.Router();
const { upload } = require("../../middleware/multer");
const advertController = require("../../controllers/advertController");
const auth = require("../../middleware/auth");
const Adverts = require("../../models/Adverts");

/**
 *  Get /api/adverts
 */
router.get("/adverts", advertController.getAdvert);

/**
 * GET /api/adverts/<_id>
 */
router.get("/adverts/:_id", advertController.getAdvertById);

/**
 * POST /api/adverts
 */
router.post(
  "/adverts",
  auth,
  upload("advert").single("image"),
  advertController.postAdvert
);

/**
 * PUT /api/adverts/<_id>
 */
router.put("/adverts/:_id", auth, advertController.putAdvert);

/**
 * DELETE /api/adverts/<_id>
 */
router.delete("/adverts/:_id", auth, advertController.deleteAdvert);

/**
 * GET /api/adverts-user/<_id>
 */

router.get("adverts-user/:id", advertController.getUserAdverts);

/**
 * GET /api/tags
 */
router.get("/tags", function (req, res) {
  res.json({ result: Adverts.allowedTags() });
});

module.exports = router;
