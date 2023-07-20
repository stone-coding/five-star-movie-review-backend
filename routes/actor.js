const express = require("express");
const {
  createActor,
  updateActor,
  removeActor,
  searchActor,
  getLatestActor,
  getSingleActor,
  getActors,
} = require("../controllers/actor");
const { uploadImage } = require("../middlewares/multer");
const { validate, actorInfoValidator } = require("../middlewares/validator");
const { isAuth, isAdmin } = require("../middlewares/auth");

const router = express.Router();

router.post(
  "/create",
  isAuth,
  isAdmin,
  uploadImage.single("avatar"),
  actorInfoValidator,
  validate,
  createActor
);

router.post(
  "/update/:actorId",
  isAuth,
  isAdmin,
  uploadImage.single("avatar"),
  actorInfoValidator,
  validate,
  updateActor
);

router.delete("/:actorId", isAuth, isAdmin, removeActor);
router.get("/search", isAuth, isAdmin, searchActor);
router.get("/latest-uploads", isAuth, isAdmin, getLatestActor);
router.get('/actors',isAuth,isAdmin, getActors)
router.get("/single/:id", getSingleActor);
module.exports = router;
