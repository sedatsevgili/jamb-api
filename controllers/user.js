var User = require('../models/user');

exports.getMe = function(req, res) {
  return res.json(req.user);
}
