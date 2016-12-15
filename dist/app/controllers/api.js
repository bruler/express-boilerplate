'use strict';

var async = require('async');
var request = require('request');
var cheerio = require('cheerio');
var graph = require('fbgraph');
var LastFmNode = require('lastfm').LastFmNode;
var tumblr = require('tumblr.js');
var GitHub = require('github');
var Twit = require('twit');
var stripe = require('stripe')(process.env.STRIPE_SKEY);
var twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
var Linkedin = require('node-linkedin')(process.env.LINKEDIN_ID, process.env.LINKEDIN_SECRET, process.env.LINKEDIN_CALLBACK_URL);
var clockwork = require('clockwork')({ key: process.env.CLOCKWORK_KEY });
var paypal = require('paypal-rest-sdk');
var lob = require('lob')(process.env.LOB_KEY);
var ig = require('instagram-node').instagram();
var foursquare = require('node-foursquare')({
  secrets: {
    clientId: process.env.FOURSQUARE_ID,
    clientSecret: process.env.FOURSQUARE_SECRET,
    redirectUrl: process.env.FOURSQUARE_REDIRECT_URL
  }
});

/**
 * GET /api
 * List of API examples.
 */
exports.getApi = function (req, res) {
  res.render('api/index', {
    title: 'API Examples'
  });
};

/**
 * GET /api/foursquare
 * Foursquare API example.
 */
exports.getFoursquare = function (req, res, next) {
  var token = req.user.tokens.find(function (token) {
    return token.kind === 'foursquare';
  });
  async.parallel({
    trendingVenues: function trendingVenues(callback) {
      foursquare.Venues.getTrending('40.7222756', '-74.0022724', { limit: 50 }, token.accessToken, function (err, results) {
        callback(err, results);
      });
    },
    venueDetail: function venueDetail(callback) {
      foursquare.Venues.getVenue('49da74aef964a5208b5e1fe3', token.accessToken, function (err, results) {
        callback(err, results);
      });
    },
    userCheckins: function userCheckins(callback) {
      foursquare.Users.getCheckins('self', null, token.accessToken, function (err, results) {
        callback(err, results);
      });
    }
  }, function (err, results) {
    if (err) {
      return next(err);
    }
    res.render('api/foursquare', {
      title: 'Foursquare API',
      trendingVenues: results.trendingVenues,
      venueDetail: results.venueDetail,
      userCheckins: results.userCheckins
    });
  });
};

/**
 * GET /api/tumblr
 * Tumblr API example.
 */
exports.getTumblr = function (req, res, next) {
  var token = req.user.tokens.find(function (token) {
    return token.kind === 'tumblr';
  });
  var client = tumblr.createClient({
    consumer_key: process.env.TUMBLR_KEY,
    consumer_secret: process.env.TUMBLR_SECRET,
    token: token.accessToken,
    token_secret: token.tokenSecret
  });
  client.posts('mmosdotcom.tumblr.com', { type: 'photo' }, function (err, data) {
    if (err) {
      return next(err);
    }
    res.render('api/tumblr', {
      title: 'Tumblr API',
      blog: data.blog,
      photoset: data.posts[0].photos
    });
  });
};

/**
 * GET /api/facebook
 * Facebook API example.
 */
exports.getFacebook = function (req, res, next) {
  var token = req.user.tokens.find(function (token) {
    return token.kind === 'facebook';
  });
  graph.setAccessToken(token.accessToken);
  graph.get(req.user.facebook + '?fields=id,name,email,first_name,last_name,gender,link,locale,timezone', function (err, results) {
    if (err) {
      return next(err);
    }
    res.render('api/facebook', {
      title: 'Facebook API',
      profile: results
    });
  });
};

/**
 * GET /api/scraping
 * Web scraping example using Cheerio library.
 */
exports.getScraping = function (req, res, next) {
  request.get('https://news.ycombinator.com/', function (err, request, body) {
    if (err) {
      return next(err);
    }
    var $ = cheerio.load(body);
    var links = [];
    $('.title a[href^="http"], a[href^="https"]').each(function (index, element) {
      links.push($(element));
    });
    res.render('api/scraping', {
      title: 'Web Scraping',
      links: links
    });
  });
};

/**
 * GET /api/github
 * GitHub API Example.
 */
exports.getGithub = function (req, res, next) {
  var github = new GitHub();
  github.repos.get({ user: 'sahat', repo: 'hackathon-starter' }, function (err, repo) {
    if (err) {
      return next(err);
    }
    res.render('api/github', {
      title: 'GitHub API',
      repo: repo
    });
  });
};

/**
 * GET /api/aviary
 * Aviary image processing example.
 */
exports.getAviary = function (req, res) {
  res.render('api/aviary', {
    title: 'Aviary API'
  });
};

/**
 * GET /api/nyt
 * New York Times API example.
 */
exports.getNewYorkTimes = function (req, res, next) {
  var query = {
    'list-name': 'young-adult',
    'api-key': process.env.NYT_KEY
  };
  request.get({ url: 'http://api.nytimes.com/svc/books/v2/lists', qs: query }, function (err, request, body) {
    if (err) {
      return next(err);
    }
    if (request.statusCode === 403) {
      return next(new Error('Invalid New York Times API Key'));
    }
    var books = JSON.parse(body).results;
    res.render('api/nyt', {
      title: 'New York Times API',
      books: books
    });
  });
};

/**
 * GET /api/lastfm
 * Last.fm API example.
 */
exports.getLastfm = function (req, res, next) {
  var lastfm = new LastFmNode({
    api_key: process.env.LASTFM_KEY,
    secret: process.env.LASTFM_SECRET
  });
  async.parallel({
    artistInfo: function artistInfo(done) {
      lastfm.request('artist.getInfo', {
        artist: 'Roniit',
        handlers: {
          success: function success(data) {
            done(null, data);
          },
          error: function error(err) {
            done(err);
          }
        }
      });
    },
    artistTopTracks: function artistTopTracks(done) {
      lastfm.request('artist.getTopTracks', {
        artist: 'Roniit',
        handlers: {
          success: function success(data) {
            done(null, data.toptracks.track.slice(0, 10));
          },
          error: function error(err) {
            done(err);
          }
        }
      });
    },
    artistTopAlbums: function artistTopAlbums(done) {
      lastfm.request('artist.getTopAlbums', {
        artist: 'Roniit',
        handlers: {
          success: function success(data) {
            done(null, data.topalbums.album.slice(0, 3));
          },
          error: function error(err) {
            done(err);
          }
        }
      });
    }
  }, function (err, results) {
    if (err) {
      return next(err);
    }
    var artist = {
      name: results.artistInfo.artist.name,
      image: results.artistInfo.artist.image.slice(-1)[0]['#text'],
      tags: results.artistInfo.artist.tags.tag,
      bio: results.artistInfo.artist.bio.summary,
      stats: results.artistInfo.artist.stats,
      similar: results.artistInfo.artist.similar.artist,
      topAlbums: results.artistTopAlbums,
      topTracks: results.artistTopTracks
    };
    res.render('api/lastfm', {
      title: 'Last.fm API',
      artist: artist
    });
  });
};

/**
 * GET /api/twitter
 * Twitter API example.
 */
exports.getTwitter = function (req, res, next) {
  var token = req.user.tokens.find(function (token) {
    return token.kind === 'twitter';
  });
  var T = new Twit({
    consumer_key: process.env.TWITTER_KEY,
    consumer_secret: process.env.TWITTER_SECRET,
    access_token: token.accessToken,
    access_token_secret: token.tokenSecret
  });
  T.get('search/tweets', { q: 'nodejs since:2013-01-01', geocode: '40.71448,-74.00598,5mi', count: 10 }, function (err, reply) {
    if (err) {
      return next(err);
    }
    res.render('api/twitter', {
      title: 'Twitter API',
      tweets: reply.statuses
    });
  });
};

/**
 * POST /api/twitter
 * Post a tweet.
 */
exports.postTwitter = function (req, res, next) {
  req.assert('tweet', 'Tweet cannot be empty').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/api/twitter');
  }

  var token = req.user.tokens.find(function (token) {
    return token.kind === 'twitter';
  });
  var T = new Twit({
    consumer_key: process.env.TWITTER_KEY,
    consumer_secret: process.env.TWITTER_SECRET,
    access_token: token.accessToken,
    access_token_secret: token.tokenSecret
  });
  T.post('statuses/update', { status: req.body.tweet }, function (err) {
    if (err) {
      return next(err);
    }
    req.flash('success', { msg: 'Your tweet has been posted.' });
    res.redirect('/api/twitter');
  });
};

/**
 * GET /api/steam
 * Steam API example.
 */
exports.getSteam = function (req, res, next) {
  var steamId = '76561197982488301';
  var params = { l: 'english', steamid: steamId, key: process.env.STEAM_KEY };
  async.parallel({
    playerAchievements: function playerAchievements(done) {
      params.appid = '49520';
      request.get({ url: 'http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/', qs: params, json: true }, function (err, request, body) {
        if (request.statusCode === 401) {
          return done(new Error('Invalid Steam API Key'));
        }
        done(err, body);
      });
    },
    playerSummaries: function playerSummaries(done) {
      params.steamids = steamId;
      request.get({ url: 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/', qs: params, json: true }, function (err, request, body) {
        if (request.statusCode === 401) {
          return done(new Error('Missing or Invalid Steam API Key'));
        }
        done(err, body);
      });
    },
    ownedGames: function ownedGames(done) {
      params.include_appinfo = 1;
      params.include_played_free_games = 1;
      request.get({ url: 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/', qs: params, json: true }, function (err, request, body) {
        if (request.statusCode === 401) {
          return done(new Error('Missing or Invalid Steam API Key'));
        }
        done(err, body);
      });
    }
  }, function (err, results) {
    if (err) {
      return next(err);
    }
    res.render('api/steam', {
      title: 'Steam Web API',
      ownedGames: results.ownedGames.response.games,
      playerAchievemments: results.playerAchievements.playerstats,
      playerSummary: results.playerSummaries.response.players[0]
    });
  });
};

/**
 * GET /api/stripe
 * Stripe API example.
 */
exports.getStripe = function (req, res) {
  res.render('api/stripe', {
    title: 'Stripe API',
    publishableKey: process.env.STRIPE_PKEY
  });
};

/**
 * POST /api/stripe
 * Make a payment.
 */
exports.postStripe = function (req, res) {
  var stripeToken = req.body.stripeToken;
  var stripeEmail = req.body.stripeEmail;
  stripe.charges.create({
    amount: 395,
    currency: 'usd',
    source: stripeToken,
    description: stripeEmail
  }, function (err) {
    if (err && err.type === 'StripeCardError') {
      req.flash('errors', { msg: 'Your card has been declined.' });
      return res.redirect('/api/stripe');
    }
    req.flash('success', { msg: 'Your card has been successfully charged.' });
    res.redirect('/api/stripe');
  });
};

/**
 * GET /api/twilio
 * Twilio API example.
 */
exports.getTwilio = function (req, res) {
  res.render('api/twilio', {
    title: 'Twilio API'
  });
};

/**
 * POST /api/twilio
 * Send a text message using Twilio.
 */
exports.postTwilio = function (req, res, next) {
  req.assert('number', 'Phone number is required.').notEmpty();
  req.assert('message', 'Message cannot be blank.').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/api/twilio');
  }

  var message = {
    to: req.body.number,
    from: '+13472235148',
    body: req.body.message
  };
  twilio.sendMessage(message, function (err, responseData) {
    if (err) {
      return next(err.message);
    }
    req.flash('success', { msg: 'Text sent to ' + responseData.to + '.' });
    res.redirect('/api/twilio');
  });
};

/**
 * GET /api/clockwork
 * Clockwork SMS API example.
 */
exports.getClockwork = function (req, res) {
  res.render('api/clockwork', {
    title: 'Clockwork SMS API'
  });
};

/**
 * POST /api/clockwork
 * Send a text message using Clockwork SMS
 */
exports.postClockwork = function (req, res, next) {
  var message = {
    To: req.body.telephone,
    From: 'Hackathon',
    Content: 'Hello from the Hackathon Starter'
  };
  clockwork.sendSms(message, function (err, responseData) {
    if (err) {
      return next(err.errDesc);
    }
    req.flash('success', { msg: 'Text sent to ' + responseData.responses[0].to });
    res.redirect('/api/clockwork');
  });
};

/**
 * GET /api/linkedin
 * LinkedIn API example.
 */
exports.getLinkedin = function (req, res, next) {
  var token = req.user.tokens.find(function (token) {
    return token.kind === 'linkedin';
  });
  var linkedin = Linkedin.init(token.accessToken);
  linkedin.people.me(function (err, $in) {
    if (err) {
      return next(err);
    }
    res.render('api/linkedin', {
      title: 'LinkedIn API',
      profile: $in
    });
  });
};

/**
 * GET /api/instagram
 * Instagram API example.
 */
exports.getInstagram = function (req, res, next) {
  var token = req.user.tokens.find(function (token) {
    return token.kind === 'instagram';
  });
  ig.use({ client_id: process.env.INSTAGRAM_ID, client_secret: process.env.INSTAGRAM_SECRET });
  ig.use({ access_token: token.accessToken });
  async.parallel({
    searchByUsername: function searchByUsername(done) {
      ig.user_search('richellemead', function (err, users) {
        done(err, users);
      });
    },
    searchByUserId: function searchByUserId(done) {
      ig.user('175948269', function (err, user) {
        done(err, user);
      });
    },
    popularImages: function popularImages(done) {
      ig.media_popular(function (err, medias) {
        done(err, medias);
      });
    },
    myRecentMedia: function myRecentMedia(done) {
      ig.user_self_media_recent(function (err, medias) {
        done(err, medias);
      });
    }
  }, function (err, results) {
    if (err) {
      return next(err);
    }
    res.render('api/instagram', {
      title: 'Instagram API',
      usernames: results.searchByUsername,
      userById: results.searchByUserId,
      popularImages: results.popularImages,
      myRecentMedia: results.myRecentMedia
    });
  });
};

/**
 * GET /api/paypal
 * PayPal SDK example.
 */
exports.getPayPal = function (req, res, next) {
  paypal.configure({
    mode: 'sandbox',
    client_id: process.env.PAYPAL_ID,
    client_secret: process.env.PAYPAL_SECRET
  });

  var paymentDetails = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal'
    },
    redirect_urls: {
      return_url: process.env.PAYPAL_RETURN_URL,
      cancel_url: process.env.PAYPAL_CANCEL_URL
    },
    transactions: [{
      description: 'Hackathon Starter',
      amount: {
        currency: 'USD',
        total: '1.99'
      }
    }]
  };

  paypal.payment.create(paymentDetails, function (err, payment) {
    if (err) {
      return next(err);
    }
    req.session.paymentId = payment.id;
    var links = payment.links;
    for (var i = 0; i < links.length; i++) {
      if (links[i].rel === 'approval_url') {
        res.render('api/paypal', {
          approvalUrl: links[i].href
        });
      }
    }
  });
};

/**
 * GET /api/paypal/success
 * PayPal SDK example.
 */
exports.getPayPalSuccess = function (req, res) {
  var paymentId = req.session.paymentId;
  var paymentDetails = { payer_id: req.query.PayerID };
  paypal.payment.execute(paymentId, paymentDetails, function (err) {
    res.render('api/paypal', {
      result: true,
      success: !err
    });
  });
};

/**
 * GET /api/paypal/cancel
 * PayPal SDK example.
 */
exports.getPayPalCancel = function (req, res) {
  req.session.paymentId = null;
  res.render('api/paypal', {
    result: true,
    canceled: true
  });
};

/**
 * GET /api/lob
 * Lob API example.
 */
exports.getLob = function (req, res, next) {
  lob.routes.list({ zip_codes: ['10007'] }, function (err, routes) {
    if (err) {
      return next(err);
    }
    res.render('api/lob', {
      title: 'Lob API',
      routes: routes.data[0].routes
    });
  });
};

/**
 * GET /api/upload
 * File Upload API example.
 */

exports.getFileUpload = function (req, res) {
  res.render('api/upload', {
    title: 'File Upload'
  });
};

exports.postFileUpload = function (req, res) {
  req.flash('success', { msg: 'File was uploaded successfully.' });
  res.redirect('/api/upload');
};

/**
 * GET /api/pinterest
 * Pinterest API example.
 */
exports.getPinterest = function (req, res, next) {
  var token = req.user.tokens.find(function (token) {
    return token.kind === 'pinterest';
  });
  request.get({ url: 'https://api.pinterest.com/v1/me/boards/', qs: { access_token: token.accessToken }, json: true }, function (err, request, body) {
    if (err) {
      return next(err);
    }
    res.render('api/pinterest', {
      title: 'Pinterest API',
      boards: body.data
    });
  });
};

/**
 * POST /api/pinterest
 * Create a pin.
 */
exports.postPinterest = function (req, res, next) {
  req.assert('board', 'Board is required.').notEmpty();
  req.assert('note', 'Note cannot be blank.').notEmpty();
  req.assert('image_url', 'Image URL cannot be blank.').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/api/pinterest');
  }

  var token = req.user.tokens.find(function (token) {
    return token.kind === 'pinterest';
  });
  var formData = {
    board: req.body.board,
    note: req.body.note,
    link: req.body.link,
    image_url: req.body.image_url
  };

  request.post('https://api.pinterest.com/v1/pins/', { qs: { access_token: token.accessToken }, form: formData }, function (err, request, body) {
    if (err) {
      return next(err);
    }
    if (request.statusCode !== 201) {
      req.flash('errors', { msg: JSON.parse(body).message });
      return res.redirect('/api/pinterest');
    }
    req.flash('success', { msg: 'Pin created' });
    res.redirect('/api/pinterest');
  });
};

exports.getGoogleMaps = function (req, res) {
  res.render('api/google-maps', {
    title: 'Google Maps API'
  });
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(LastFmNode, 'LastFmNode', '/home/cortana/Projects/JSProjects/express-boilerplate/app/controllers/api.js');

  __REACT_HOT_LOADER__.register(stripe, 'stripe', '/home/cortana/Projects/JSProjects/express-boilerplate/app/controllers/api.js');

  __REACT_HOT_LOADER__.register(twilio, 'twilio', '/home/cortana/Projects/JSProjects/express-boilerplate/app/controllers/api.js');

  __REACT_HOT_LOADER__.register(Linkedin, 'Linkedin', '/home/cortana/Projects/JSProjects/express-boilerplate/app/controllers/api.js');

  __REACT_HOT_LOADER__.register(clockwork, 'clockwork', '/home/cortana/Projects/JSProjects/express-boilerplate/app/controllers/api.js');

  __REACT_HOT_LOADER__.register(lob, 'lob', '/home/cortana/Projects/JSProjects/express-boilerplate/app/controllers/api.js');

  __REACT_HOT_LOADER__.register(ig, 'ig', '/home/cortana/Projects/JSProjects/express-boilerplate/app/controllers/api.js');

  __REACT_HOT_LOADER__.register(foursquare, 'foursquare', '/home/cortana/Projects/JSProjects/express-boilerplate/app/controllers/api.js');
}();

;
//# sourceMappingURL=api.js.map
