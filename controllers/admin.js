const Movie = require("../models/movie");
const User = require("../models/user");
const Review = require("../models/review");
const { topRatedMoviesPipeline, getAverageRatings } = require("../utils/helper");

exports.getAppInfo = async (req, res) => {
  const movieCount = await Movie.countDocuments();
  const reviewCount = await User.countDocuments();
  const userCount = await Review.countDocuments();

  res.json({ appInfo: { movieCount, reviewCount, userCount } });
};

exports.getMostRated = async (req, res) => {

  const movies = await Movie.aggregate(topRatedMoviesPipeline());

  mapMovies = async (m) => {
    const reviews = await getAverageRatings(m._id);

    return {
      id: m._id,
      title: m.title,
      reviews: { ...reviews },
    };
  };

  const topRateMovies = await Promise.all(movies.map(mapMovies));

  res.json({ movies: topRateMovies });
};
