const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// mergeParams merges the tourId route from tourRoutes.js otherwise we do not have access to tourId
const router = express.Router({ mergeParams: true });

// POST /tour/<TOURID>/reviews
// POST /reviews

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

module.exports = router;
