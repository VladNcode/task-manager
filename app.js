const path = require('path');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const cookieSession = require('cookie-session');
require('./passportSetup');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const viewRouter = require('./routes/viewRoutes');
const authRouter = require('./routes/authRoutes');
const taskRouter = require('./routes/taskRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

app.use(cors());

//* Setting pug as default view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './views'));

//* Serving static files
app.use(express.static(path.join(__dirname, 'public'))); // 3000/public/overview.html === 3000/overview.html

//* Body parser, reading from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

//* Cookie session
app.use(
  cookieSession({
    name: 'task-session',
    //? FIX KEYS BELOW !!!!
    keys: ['key1', 'key2'],
  })
);

//* Passport
app.use(passport.initialize());
app.use(passport.session());

//* Routes
app.use('/', viewRouter);
app.use('/auth/', authRouter);
app.use('/api/v1/users/', userRouter);
app.use('/api/v1/tasks', taskRouter);

//* Error handling
app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
