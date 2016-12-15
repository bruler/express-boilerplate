'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

/**
 * Primary app routes.
 */
// router.get('/', homeController.index);
// router.get('/login', userController.getLogin);
// router.post('/login', userController.postLogin);
// router.get('/logout', userController.logout);
// router.get('/forgot', userController.getForgot);
// router.post('/forgot', userController.postForgot);
// router.get('/reset/:token', userController.getReset);
// router.post('/reset/:token', userController.postReset);
// router.get('/signup', userController.getSignup);
// router.post('/signup', userController.postSignup);
// router.get('/contact', contactController.getContact);
// router.post('/contact', contactController.postContact);
// router.get('/account', passportConfig.isAuthenticated, userController.getAccount);
// router.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
// router.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
// router.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
// router.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);

/**
 * API examples routes.
 */
// router.get('/api', apiController.getApi);
// router.get('/api/lastfm', apiController.getLastfm);
// router.get('/api/nyt', apiController.getNewYorkTimes);
// router.get('/api/aviary', apiController.getAviary);
// router.get('/api/steam', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getSteam);
// router.get('/api/stripe', apiController.getStripe);
// router.post('/api/stripe', apiController.postStripe);
// router.get('/api/scraping', apiController.getScraping);
// router.get('/api/twilio', apiController.getTwilio);
// router.post('/api/twilio', apiController.postTwilio);
// router.get('/api/clockwork', apiController.getClockwork);
// router.post('/api/clockwork', apiController.postClockwork);
// router.get('/api/foursquare', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFoursquare);
// router.get('/api/tumblr', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getTumblr);
// router.get('/api/facebook', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);
// router.get('/api/github', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getGithub);
// router.get('/api/twitter', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getTwitter);
// router.post('/api/twitter', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.postTwitter);
// router.get('/api/linkedin', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getLinkedin);
// router.get('/api/instagram', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getInstagram);
// router.get('/api/paypal', apiController.getPayPal);
// router.get('/api/paypal/success', apiController.getPayPalSuccess);
// router.get('/api/paypal/cancel', apiController.getPayPalCancel);
// router.get('/api/lob', apiController.getLob);
// router.get('/api/upload', apiController.getFileUpload);
// router.post('/api/upload', upload.single('myFile'), apiController.postFileUpload);
// router.get('/api/pinterest', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getPinterest);
// router.post('/api/pinterest', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.postPinterest);
// router.get('/api/google-maps', apiController.getGoogleMaps);

/**
 * OAuth authentication routes. (Sign in)
 */
// router.get('/auth/instagram', passport.authenticate('instagram'));
// router.get('/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/login' }), (req, res) => {
//   res.redirect(req.session.returnTo || '/');
// });
// router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
// router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
//   res.redirect(req.session.returnTo || '/');
// });
// router.get('/auth/github', passport.authenticate('github'));
// router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
//   res.redirect(req.session.returnTo || '/');
// });
// router.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
// router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
//   res.redirect(req.session.returnTo || '/');
// });
// router.get('/auth/twitter', passport.authenticate('twitter'));
// router.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), (req, res) => {
//   res.redirect(req.session.returnTo || '/');
// });
// router.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));
// router.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), (req, res) => {
//   res.redirect(req.session.returnTo || '/');
// });
//
/**
 * OAuth authorization routes. (API examples)
 */
// router.get('/auth/foursquare', passport.authorize('foursquare'));
// router.get('/auth/foursquare/callback', passport.authorize('foursquare', { failureRedirect: '/api' }), (req, res) => {
//   res.redirect('/api/foursquare');
// });
// router.get('/auth/tumblr', passport.authorize('tumblr'));
// router.get('/auth/tumblr/callback', passport.authorize('tumblr', { failureRedirect: '/api' }), (req, res) => {
//   res.redirect('/api/tumblr');
// });
// router.get('/auth/steam', passport.authorize('openid', { state: 'SOME STATE' }));
// router.get('/auth/steam/callback', passport.authorize('openid', { failureRedirect: '/login' }), (req, res) => {
//   res.redirect(req.session.returnTo || '/');
// });
// router.get('/auth/pinterest', passport.authorize('pinterest', { scope: 'read_public write_public' }));
// router.get('/auth/pinterest/callback', passport.authorize('pinterest', { failureRedirect: '/login' }), (req, res) => {
//   res.redirect('/api/pinterest');
// });

module.exports = router;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(router, 'router', '/home/cortana/Projects/JSProjects/express-boilerplate/config/routes.js');
}();

;
//# sourceMappingURL=routes.js.map
