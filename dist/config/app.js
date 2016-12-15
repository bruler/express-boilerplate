'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _errorhandler = require('errorhandler');

var _errorhandler2 = _interopRequireDefault(_errorhandler);

var _lusca = require('lusca');

var _lusca2 = _interopRequireDefault(_lusca);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _connectMongo = require('connect-mongo');

var _connectMongo2 = _interopRequireDefault(_connectMongo);

var _expressFlash = require('express-flash');

var _expressFlash2 = _interopRequireDefault(_expressFlash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _expressValidator = require('express-validator');

var _expressValidator2 = _interopRequireDefault(_expressValidator);

var _expressStatusMonitor = require('express-status-monitor');

var _expressStatusMonitor2 = _interopRequireDefault(_expressStatusMonitor);

var _nodeSassMiddleware = require('node-sass-middleware');

var _nodeSassMiddleware2 = _interopRequireDefault(_nodeSassMiddleware);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _home = require('../app/controllers/home');

var _home2 = _interopRequireDefault(_home);

var _user = require('../app/controllers/user');

var _user2 = _interopRequireDefault(_user);

var _api = require('../app/controllers/api');

var _api2 = _interopRequireDefault(_api);

var _contact = require('../app/controllers/contact');

var _contact2 = _interopRequireDefault(_contact);

var _passport3 = require('./passport');

var _passport4 = _interopRequireDefault(_passport3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Module dependencies
 */
var upload = (0, _multer2.default)({ dest: _path2.default.join(__dirname, 'uploads') });
var MongoStore = (0, _connectMongo2.default)(_expressSession2.default);

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
_dotenv2.default.load({ path: '.env.example' });

/**
 * Controllers (route handlers).
 */


/**
* API keys and Passport configuration.
*/


/**
 * Create Express server.
 */
var app = (0, _express2.default)();

/**
 * Connect to MongoDB.
 */
_mongoose2.default.Promise = global.Promise;
_mongoose2.default.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
_mongoose2.default.connection.on('error', function () {
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', _chalk2.default.red('✗'));
  process.exit();
});

/**
* Express configuration.
*/
app.set('port', process.env.PORT || 3000);
app.set('views', _path2.default.join(__dirname, 'app/views'));

// app.set('view engine', 'ejs');
app.set('view engine', 'jsx');
app.use((0, _expressStatusMonitor2.default)());
app.use((0, _compression2.default)());
app.use((0, _nodeSassMiddleware2.default)({
  src: _path2.default.join(__dirname, 'app/assets'),
  dest: _path2.default.join(__dirname, 'app/assets')
}));
app.use((0, _morgan2.default)('dev'));
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use((0, _expressSession2.default)({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    autoReconnect: true
  })
}));
app.use(_passport2.default.initialize());
app.use(_passport2.default.session());
app.use((0, _expressFlash2.default)());
app.use(function (req, res, next) {
  if (req.path === '/api/upload') {
    next();
  } else {
    _lusca2.default.csrf()(req, res, next);
  }
});
app.use(_lusca2.default.xframe('SAMEORIGIN'));
app.use(_lusca2.default.xssProtection(true));
app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(function (req, res, next) {
  // After successful login, redirect back to the intended page
  if (!req.user && req.path !== '/login' && req.path !== '/signup' && !req.path.match(/^\/auth/) && !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  } else if (req.user && req.path == '/account') {
    req.session.returnTo = req.path;
  }
  next();
});
app.use(_express2.default.static(_path2.default.join(__dirname, 'public'), { maxAge: 31557600000 }));

/**
 * App Routes
 */
app.use(require('./routes'));

/**
 * Error Handler.
 */
app.use((0, _errorhandler2.default)());

/**
 * Start Express server.
 */
app.listen(app.get('port'), function () {
  console.log('%s App is running at http://localhost:%d in %s mode', _chalk2.default.green('✓'), app.get('port'), app.get('env'));

  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(upload, 'upload', '/home/cortana/Projects/JSProjects/express-boilerplate/config/app.js');

  __REACT_HOT_LOADER__.register(MongoStore, 'MongoStore', '/home/cortana/Projects/JSProjects/express-boilerplate/config/app.js');

  __REACT_HOT_LOADER__.register(app, 'app', '/home/cortana/Projects/JSProjects/express-boilerplate/config/app.js');
}();

;
//# sourceMappingURL=app.js.map
