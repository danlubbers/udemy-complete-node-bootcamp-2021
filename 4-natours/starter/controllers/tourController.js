const Tour = require('../models/tourModel');

// Route handlers
exports.getAllTours = (req, res) => {
  // console.log(req.requestTime);
  // res.status(200).json({
  //   status: 'success',
  //   results: tours.length,
  //   data: {
  //     tours: tours,
  //   },
  // });
};

exports.getTour = (req, res) => {
  // console.log(req.params);
  const id = +req.params.id;
  // const tour = tours.find((el) => el.id === id);
  // console.log(tour);

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour: tour,
  //   },
  // });
};

exports.createTour = async (req, res) => {
  try {
    // console.log(req.body);
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};

// This does not actual Update data. Just a reference to show in Postman
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

// This does not actual Update data. Just a reference to show in Postman 'only status 204 will show'
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
