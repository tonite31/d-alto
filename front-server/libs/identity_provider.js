module.exports.facebook = facebook;
module.exports.twitter = twitter;
module.exports.google = google;

var config = require(_path.home + '/config');

function facebook(app)
{
	var FACEBOOK_APP_ID = config.auth.facebook.appId;
	var FACEBOOK_APP_SECRET = config.auth.facebook.secret;
	var FACEBOOK_APP_CALLBACK = config.auth.facebook.callback;
	
	var passport = require('passport');

	app.use(passport.initialize());
//	app.use(passport.session());

	passport.serializeUser(function(user, done)
	{
		done(null, user);
	});
	passport.deserializeUser(function(obj, done)
	{
		done(null, obj);
	});

	var FacebookStrategy = require('passport-facebook').Strategy;
	passport.use(new FacebookStrategy({ clientID : FACEBOOK_APP_ID, clientSecret : FACEBOOK_APP_SECRET, callbackURL : FACEBOOK_APP_CALLBACK }, function(accessToken, refreshToken, profile, done)
	{
				// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				// req.session.passport 정보를 저장하는 단계이다.
				// done 메소드에 전달된 정보가 세션에 저장된다.
				// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				//
		profile.accessToken = accessToken;
		
		return done(null, profile);
	}));

	app.get('/auth/login/facebook', passport.authenticate('facebook'));
	//
	// redirect 실패/성공의 주소를 기입한다.
	//
	app.get('/auth/login/facebook/callback', passport.authenticate('facebook', { successRedirect : '/auth/login/success', failureRedirect : '/auth/login/fail' }));
};

function twitter(app)
{
	var TWITTER_APP_ID = config.auth.twitter.appId;
	var TWITTER_APP_SECRET = config.auth.twitter.secret;
	var TWITTER_APP_CALLBACK = config.auth.twitter.callback;
	
	var passport = require('passport');

	app.use(passport.initialize());
		
	passport.serializeUser(function(user, done)
	{
		done(null, user);
	});
	passport.deserializeUser(function(obj, done)
	{
		done(null, obj);
	});
	
	var TwitterStrategy = require('passport-twitter').Strategy;
	passport.use(new TwitterStrategy({consumerKey: TWITTER_APP_ID, consumerSecret: TWITTER_APP_SECRET, callbackURL: TWITTER_APP_CALLBACK}, function(token, tokenSecret, profile, done)
	{
	    //
	    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	    // req.session.passport 정보를 저장하는 단계이다.
	    // done 메소드에 전달된 정보가 세션에 저장된다.
	    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	    //
		return done(null, profile);
	}));
	
	app.get('/auth/login/twitter', passport.authenticate('twitter'));
	  //
	  // redirect 실패/성공의 주소를 기입한다.
	  //
	app.get('/auth/login/twitter/callback', passport.authenticate('twitter', { successRedirect : '/auth/login/success', failureRedirect : '/auth/login/fail' }));
};

function google(app)
{
	var GOOGLE_APP_ID = config.auth.google.appId;
	var GOOGLE_APP_SECRET = config.auth.google.secret;
	var GOOGLE_APP_CALLBACK = config.auth.google.callback;
	
	var passport = require('passport');

	app.use(passport.initialize());
		
	passport.serializeUser(function(user, done)
	{
		done(null, user);
	});
	passport.deserializeUser(function(obj, done)
	{
		done(null, obj);
	});
	
	var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
	passport.use(new GoogleStrategy({clientID: GOOGLE_APP_ID, clientSecret: GOOGLE_APP_SECRET, callbackURL: GOOGLE_APP_CALLBACK}, function(token, tokenSecret, profile, done)
	{
	    //
	    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	    // req.session.passport 정보를 저장하는 단계이다.
	    // done 메소드에 전달된 정보가 세션에 저장된다.
	    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	    //
		return done(null, profile);
	}));
	
	app.get('/auth/google', passport.authenticate('google', {
	  scope: [
	    'https://www.googleapis.com/auth/userinfo.profile',
	    'https://www.googleapis.com/auth/userinfo.email'
	  ]
	}));
	
	app.get('/auth/login/google/callback', passport.authenticate('google', { successRedirect : '/auth/login/success', failureRedirect : '/auth/login/fail' }));
};