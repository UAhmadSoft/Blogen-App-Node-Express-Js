const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const socket = require('socket.io');

dotenv.config({
  path: './config.env',
});
const server = require('./server');
// console.log('fuck', fuck);

const DB = process.env.DATABASE;
// const DB = process.env.DATABASE_LOCAL;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    // console.log(con);
    console.log('Database Connected Sccessfully');
  });

// Routers
var index = require('./routes/indexRoutes');
var users = require('./routes/userRoutes');
var posts = require('./routes/postRoutes');
var categories = require('./routes/categoryRoutes');

const errorController = require('./controllers/errorController');
const AppError = require('./utils/appError');

var app = express();

// error handler

app.use(logger('dev'));

app.use(express.json());
app.use(cookieParser());
// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// app.set('views', `${__dirname}/views`);

// initialise session middleware - flash-express depends on it
app.use(
  session({
    secret: 'MySecret 344j ff ',
    cookie: { maxAge: 600000 },
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

app.use(express.static(`${__dirname}/public`));

// Routes
app.use(function (req, res, next) {
  if (req.originalUrl && req.originalUrl.split('/').pop() === 'favicon.ico') {
    return res.sendStatus(204);
  }

  return next();
});

// Routes
app.use('/dashboard', index);
app.use('/posts', posts);
app.use('/categories', categories);
app.use('/users', users);
app.get('/test', (req, res) => {
  res.json({
    success: 'true',
  });
});
app.use('/', index);

// HANDLING UNHANDLED ROUTES
app.all('*', (req, res, next) => {
  console.log('404');
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorController);

server.appListen(app);
let socketServer = server.getServer();

// Socket.io Connection
io = socket(socketServer);

io.on('connection', (socket) => {
  mySocket = socket;

  // I want to sent this socket to every route Controller
  console.log('connection made');
});
// console.log(s);
module.exports = { io };
