var passport = require('passport');
var User = require('../models/user');
var Token = require('../models/token');
var Client = require('../models/client');
var BearerStrategy = require('passport-http-bearer').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;

passport.use(new BasicStrategy(
	function(username, password, callback) {
		User.findOne({username: username}, function(err, user) {
			if(err) {
				return callback(err);
			}

			if(!user) {
				return callback(null, false);
			}

			user.verifyPassword(password, function(err, isMatch) {
				if(err) {
					return callback(err);
				}

				if(!isMatch) {
					return callback(null, false);
				}

				return callback(null, user);
			});
		});
	}
));


passport.use('client-basic', new BasicStrategy(
  function(username, password, callback) {
		Client.findOne({id: username}, function(err, client) {
      if(err) {
        return callback(err);
      }

      if(!client || client.secret !== password) {
        return callback(null, false);
      }

      return callback(null, client);
    });
  }
));

passport.use(new BearerStrategy(
	function(accessToken, callback) {
		Token.findOne({value: accessToken}, function(err, token) {
			if(err) {
				return callback(err);
			}

			if(!token) {
				return callback(null, false);
			}

			if(new Date() > token.expiresAt) {
				return token.remove(function(err) {
					if(err) {
						return callback(err);
					}
					return callback(null, false);
				});
			}

			User.findOne({_id: token.userId}, function(err, user) {
				if(err) {
					return callback(err);
				}

				if(!user) {
					return callback(null, false);
				}

				callback(null, user, { scope: '*'});
			});
		});
	}
));

exports.isUserAuthenticated = passport.authenticate('basic', {session: false});
exports.isClientAuthenticated = passport.authenticate('client-basic', {session: false});
exports.isBearerAuthenticated = passport.authenticate('bearer', {session: false});
