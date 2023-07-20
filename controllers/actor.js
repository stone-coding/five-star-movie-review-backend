const { isValidObjectId } = require("mongoose");
const Actor = require("../models/actor");
const {
  sendError,
  uploadImageToCloud,
  formatActor,
} = require("../utils/helper");
const cloudinary = require("../cloud/index");
const actor = require("../models/actor");
require("dotenv").config();

/**
 * create a new actor with name, about, gender, id, secure_url, and public_id.
 * check file existance and send res to user
 * @param {*} req to create actor
 * @param {*} res indicates if actor creation success or failure
 */
exports.createActor = async (req, res) => {
  const { name, about, gender } = req.body;
  const { file } = req;

  const newActor = new Actor({ name, about, gender });
  if (file) {
    const { url, public_id } = await uploadImageToCloud(file.path);
    newActor.avatar = { url, public_id };
  }
  await newActor.save();
  res.status(201).json({ actor: formatActor(newActor) });
};

// update
// Things to consider while updating
// No.1 - is image file / is avatar also updating
// No.2 - if yes then remove old image before uploading new image / avatar.
exports.updateActor = async (req, res) => {
  const { name, about, gender } = req.body;
  const { file } = req;
  const { actorId } = req.params;

  if (!isValidObjectId(actorId)) return sendError(res, "Invalid request!");
  const actor = await Actor.findById(actorId);
  if (!actor) return sendError(res, "Invalid request, record not found!");

  const public_id = actor.avatar?.public_id;
  //remove old image if there has one!
  if (public_id && file) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    console.log(result);
    if (result !== "ok") {
      return sendError(res, "could not remove image from cloud!");
    }
  }

  //updaload new avatar if there is one!
  if (file) {
    const { url, public_id } = await uploadImageToCloud(file.path);
    actor.avatar = { url, public_id };
  }

  actor.name = name;
  actor.about = about;
  actor.gender = gender;

  await actor.save();
  res.status(201).json({ actor: formatActor(actor) });
};

exports.removeActor = async (req, res) => {
  const { actorId } = req.params;

  if (!isValidObjectId(actorId)) return sendError(res, "Invalid request!");
  const actor = await Actor.findById(actorId);
  if (!actor) return sendError(res, "Invalid request, record not found!");

  const public_id = actor.avatar?.public_id;
  //remove old image if there has one!
  if (public_id) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    console.log(result);
    if (result !== "ok") {
      return sendError(res, "could not remove image from cloud!");
    }
  }

  await Actor.findByIdAndDelete(actorId);

  res.json({ message: "Record Remove Successfully!" });
};

exports.searchActor = async (req, res) => {
  const { name } = req.query;
  // Full name search
  // const result = await Actor.find({ $text: { $search: `"${query.name}"` } });
  // Partial name search
  if (!name.trim()) return sendError(res, "Invalid request!");
  const result = await Actor.find({
    name: { $regex: name, $options: "i" },
  });

  const actors = result.map((actor) => formatActor(actor));
  res.json({ results: actors });
};

exports.getLatestActor = async (req, res) => {
  const result = await Actor.find().sort({ createdAt: "-1" }).limit(12);
  const actors = result.map((actor) => formatActor(actor));
  res.json(actors);
};

exports.getSingleActor = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) return sendError(res, "Invalid request!");
  const actor = await Actor.findById(id);

  if (!actor) return sendError(res, "Invalid request, actor not found!", 404);
  res.json({ actor: formatActor(actor) });
};

/**
 * sort -1 find the latest selected actor on the above. and skip will get
 * number of actors to be skipped(initial 0) each time
 * and limit gets how many actors are selected each time
 * @param {*} req
 * @param {*} res
 */
exports.getActors = async (req, res) => {
  const { pageNo, limit } = req.query;

  const actors = await Actor.find({})
    .sort({ createdAt: -1 })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit));

  const profiles = actors.map((actor) => formatActor(actor));

  res.json({
    profiles: profiles,
  });
};
