const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
  console.log('🔥🔥🔥 MIDDLEWARE 🔥🔥🔥');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Route handlers

const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

const getTour = (req, res) => {
  console.log(req.params);
  const id = +req.params.id;
  const tour = tours.find((el) => el.id === id);
  // console.log(tour);

  if (!tour) {
    return res.status(404).json({ status: 'failed', message: 'Invalid ID' });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
};

const createTour = (req, res) => {
  // console.log(req.body);
  const newID = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newID }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

// This does not actual Update data. Just a reference to show in Postman
const updateTour = (req, res) => {
  if (+req.params.id > tours.length) {
    return res.status(404).json({ status: 'failed', message: 'Invalid ID' });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

// This does not actual Update data. Just a reference to show in Postman 'only status 204 will show'
const deleteTour = (req, res) => {
  if (+req.params.id > tours.length) {
    return res.status(404).json({ status: 'failed', message: 'Invalid ID' });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// ROUTES

// Combined them below in app.route
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// Start Server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
