var oauth2orize = require('oauth2orize');
var User = require('../models/user');
var Client = require('../models/client');
var Token = require('../models/token');
var RefreshToken = require('../models/refresh_token');
var Code = require('../models/code');
var bcrypt = require('bcrypt-nodejs');
var server = oauth2orize.createServer();

server.serializeClient(function(client, callback) {
	return callback(null, client._id);
});

server.deserializeClient(function(id, callback) {
	Client.findOne({ _id: id }, function(err, client) {
		if(err) {
			return callback(err);
		}
		return callback(null, client);
	});
});

server.grant(oauth2orize.grant.code(function(client, redirectUri, user, ares, callback) {
	var code = new Code({
		value: uid(16),
		clientId: client._id,
		redirectUri: redirectUri,
		userId: user._id
	});

	code.save(function(err) {
		if(err) {
			return callback(err);
		}
		callback(null, code.value);
	});
}));

server.exchange(oauth2orize.exchange.code(function(client, code, redirectUri, callback) {
	Code.findOne({value: code}, function(err, authCode) {
		if(err) {
			return callback(err);
		}

		if(!authCode) {
			return callback(null, false);
		}

		if(client._id.toString() !== authCode.clientId) {
			return callback(null, false);
		}

		if(redirectUri !== authCode.redirectUri) {
			return callback(null, false);
		}

		authCode.remove(function(err) {
			if(err) {
				return callback(err);
			}

			var expirationDate = new Date(new Date().getTime() + 3600 * 1000);
			var token = new Token({
				value: uid(256),
				clientId: authCode.clientId,
				userId: authCode.userId,
				expiresAt: expirationDate
			});

			token.save(function(err) {
				if(err) {
					return callback(err);
				}

				var refreshToken = new RefreshToken({
					value: uid(256),
					clientId: authCode.clientId,
					userId: authCode.userId
				});
				refreshToken.save(function(err) {
					if(err) {
						return callback(err);
					}

					callback(null, token.value, refreshToken.value, {expires_in: expirationDate});
				})
			});
		});
	});
}));

server.exchange(oauth2orize.exchange.refreshToken(function(client, refreshTokenValue, scope, callback) {
	RefreshToken.findOne({value: refreshTokenValue, clientId: client._id}, function(err, refreshToken) {
		if(err) {
			return callback(err);
		}

		if(!refreshToken) {
			return callback(null, false);
		}

		refreshToken.remove(function(err) {
			if(err) {
				return callback(err);
			}

			var expirationDate = new Date(new Date().getTime() + 3600 * 1000);
			var token = new Token({
				value: uid(256),
				clientId: refreshToken.clientId,
				userId: refreshToken.userId,
				expiresAt: expirationDate
			});
			token.save(function(err) {
				if(err) {
					return callback(err);
				}

				var refreshToken = new RefreshToken({
					value: uid(256),
					clientId: token.clientId,
					userId: token.userId
				});
				refreshToken.save(function(err) {
					if(err) {
						return callback(err);
					}

					callback(null, token.value, refreshToken.value, {expires_in: expirationDate});
				})
			});
		});
	})
}));

server.exchange(oauth2orize.exchange.password(function(client, username, password, scope, callback) {
	User.findOne({username: username}, function(err, user) {
		if(err) {
			return callback(err);
		}
		if(!user) {
			return callback(err, false);
		}
		bcrypt.compare(password, user.password, function (err, res) {
			if(err) {
				return callback(err);
			}
			var expirationDate = new Date(new Date().getTime() + 3600 * 1000);
			var token = new Token({
				value: uid(256),
				clientId: client.id,
				userId: user._id,
				expiresAt: expirationDate
			});
			token.save(function(err) {
				if(err) {
					return callback(err);
				}

				var refreshToken = new RefreshToken({
					value: uid(256),
					clientId: token.clientId,
					userId: token.userId
				});
				refreshToken.save(function(err) {
					if(err) {
						return callback(err);
					}

					callback(null, token.value, refreshToken.value, {expires_in: expirationDate});
				})
			});
		});
	});
}));

exports.authorization = [
	server.authorization(function(clientId, redirectUri, callback) {
		Client.findOne({id: clientId}, function(err, client) {
			if(err) {
				return callback(err);
			}

			return callback(null, client, redirectUri);
		});
	}),
	function(req, res) {
		res.render('dialog', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client});
	}
];

exports.decision = [
	server.decision()
];

exports.token = [
	server.token(),
	server.errorHandler()
];

function uid(len) {
	var buf = [];
	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charlen = chars.length;

	for(var i = 0; i < len; i++) {
		buf.push(chars[getRandomInt(0, charlen - 1)]);
	}

	return buf.join('');
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
