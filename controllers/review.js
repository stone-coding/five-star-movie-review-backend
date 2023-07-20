const { isValidObjectId } = require("mongoose");
const { sendError, getAverageRatings } = require("../utils/helper");
const Movie = require("../models/movie");
const Review = require("../models/review");

exports.addReview = async (req, res) => {
  const { movieId } = req.params;
  const { content, rating } = req.body;
  const userId = req.user._id;

  if (!req.user.isVerified)
    return sendError(res, "Please verify your email first!");

  if (!isValidObjectId(movieId)) return sendError(res, "Invalid movie!");

  const movie = await Movie.findOne({ _id: movieId, status: "public" });
  if (!movie) return sendError(res, "movie not found!", 404);

  const isAlreadyReviewed = await Review.findOne({
    owner: userId,
    parentMovie: movie._id,
  });
  if (isAlreadyReviewed)
    return sendError(res, "Invalid request, review is already there!");

  // create and update review
  const newReview = new Review({
    owner: userId,
    parentMovie: movie._id,
    content,
    rating,
  });

  // updating review for movie
  movie.reviews.push(newReview._id);
  await movie.save();

  //save new review
  await newReview.save();

  const reviews = await getAverageRatings(movie._id);

  res.json({ message: "Your review has been added.", reviews });
};

exports.updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { content, rating } = req.body;
  const userId = req.user._id;

  if (!isValidObjectId(reviewId)) return sendError(res, "Invalid Review ID!");

  //check review belongs to user id or not
  const review = await Review.findOne({ owner: userId, _id: reviewId });
  if (!review) return sendError(res, "Review not found!", 404);

  review.content = content;
  review.rating = rating;

  // updating review for movie
  await review.save();

  res.json({ message: "Your review has been updated." });
};

exports.removeReview = async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(reviewId)) return sendError(res, "Invalid Review ID!");

  //check review belongs to user id or not
  const review = await Review.findOne({ owner: userId, _id: reviewId });
  if (!review) return sendError(res, "Invalid request, review not found", 404);

  const movie = await Movie.findById(review.parentMovie).select("reviews");

  //rID are reviewId already stored in db return rId not match the target deleted reviewId
  //   movie.reviews = movie.reviews.filter((rId) => {
  //     if (rId.toString() !== reviewId) return rId;
  //   });
  movie.reviews = movie.reviews.filter((rId) => rId.toString() !== reviewId);

  // delete review
  await Review.findByIdAndDelete(reviewId);
  await movie.save();

  res.json({ message: "Review removed successfully." });
};

exports.getReviewsByMovie = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) return sendError(res, "Invalid movie ID!");

  const movie = await Movie.findById(movieId)
    .populate({
      path: "reviews",
      populate: { path: "owner", select: "name" }, // select name is select owner id here
    })
    .select("reviews title");

  const reviews = movie.reviews.map((r) => {
    const { owner, content, rating, _id: reviewId } = r;
    const { name, _id: ownerId } = owner;
    return {
      id: reviewId,
      owner: {
        id: ownerId,
        name: name,
      },
      content,
      rating,
    };
  });

  res.json({ movie: { title: movie.title, reviews } });
};
