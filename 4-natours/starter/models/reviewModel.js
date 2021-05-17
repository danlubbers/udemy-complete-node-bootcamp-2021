const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    createAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  // Schema options to add Virtual Property to response
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Prevents user from writing multiple reviews under the same tour. A user should only be able to write 1 review per tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// This adds two queries. One to populate tour and other user. Adds additional response time
reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: '-guides name',
  // }).populate({
  //   path: 'user',
  //   select: 'name',
  // });

  // Don't need to populate tour info for reviews so copied from above and got rid of that code
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // this points to the model and we call aggregate() on the model
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.tour); // add this.constructor because we are using Review before it's initialized
});

// findByIdandUpdate
// findByIdandDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.review = await this.findOne(); // this helps to pass this data from pre-middleware to post-middleware below
  // console.log(this.review);
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.review.constructor.calcAverageRatings(this.review.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

// Nested Routes - get which tour and which user for creating review
// POST /<tour>/<USERID>/reviews
// GET /<tour>/<USERID>/reviews
// GET /<tour>/<USERID>/reviews/<REVIEW ID>
