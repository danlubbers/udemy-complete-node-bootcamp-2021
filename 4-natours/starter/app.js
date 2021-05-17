const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug'); // setup PUG templating engine

app.set('views', path.join(__dirname, 'views')); // this goes to './views' directory

// Global Middleware

// Serving static files
// app.use(express.static(`${__dirname}/public`)); // without path
app.use(express.static(path.join(__dirname, 'public')));

// Set security for HTTP Headers
app.use(helmet());

// Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limits requests from the same IP to 100 per hour
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

// Body-Parser - reading data from the body into req.body
app.use(
  express.json({
    limit: '10kb',
  })
);

// Data Sanitization against NOSQL query injection
app.use(mongoSanitize());

// Data Sanitization against XSS - cleans malicious html code
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ], // allows for multiple duplicate parameters
  })
);

// app.use((req, res, next) => {
//   // console.log('🔥🔥🔥 MIDDLEWARE 🔥🔥🔥');
//   next();
// });

// Testing Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// Mounting ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// Error handling Middleware for routes that do no exist
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
