const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const gameRoutes = require('./routes/gameRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// security middleware
app.use(helmet());
app.use(cors());

// rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

// body parsing
app.use(express.json());

// routes
app.use('/api', gameRoutes);

// global error handler middleware
app.use(errorHandler);

module.exports = app;
