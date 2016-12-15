/**
 * Module dependencies
 */
import express from 'express';
import compression from 'compression';
import session from 'express-session';
import bodyParser from 'body-parser';
import logger from 'morgan';
import chalk from 'chalk';
import errorHandler from 'errorhandler';
import lusca from 'lusca';
import dotenv from 'dotenv';
import connectMongo from 'connect-mongo';
import flash from 'express-flash';
import path from 'path';
import mongoose from 'mongoose';
import passport from 'passport';
import expressValidator from 'express-validator';
import expressStatusMonitor from 'express-status-monitor';
import sass from 'node-sass-middleware';
import multer from 'multer';

const upload = multer({ dest: path.join(__dirname, 'uploads') });
const MongoStore = connectMongo(session);

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env.example' });


/**
 * Controllers (route handlers).
 */
import homeController from '../app/controllers/home';
import userController from '../app/controllers/user';
import apiController from '../app/controllers/api';
import contactController from '../app/controllers/contact';

/**
* API keys and Passport configuration.
*/
import passportConfig from './passport';


/**
 * Create Express server.
 */
const app = express();



/**
 * Connect to MongoDB.
 */
 mongoose.Promise = global.Promise;
 mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
 mongoose.connection.on('error', () => {
   console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
   process.exit();
 });

 /**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'app/views'));

// app.set('view engine', 'ejs');
app.set('view engine', 'jsx');
app.use(expressStatusMonitor());
app.use(compression());
app.use(sass({
  src: path.join(__dirname, 'app/assets'),
  dest: path.join(__dirname, 'app/assets')
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  if(req.path === '/api/upload') {
    next();
  } else {
    lusca.csrf()(req, res, next);
  }
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if(!req.user &&
      req.path !== '/login' &&
      req.path !== '/signup' &&
      !req.path.match(/^\/auth/) &&
      !req.path.match(/\./)) {
      req.session.returnTo = req.path;
    } else if(req.user &&
        req.path == '/account') {
      req.session.returnTo = req.path;
    }
    next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

/**
 * App Routes
 */
app.use(require('./routes'));


/**
 * Error Handler.
 */
app.use(errorHandler());


/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env')); 
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
