var mongoose = require('mongoose');

var RefreshTokenSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true
  },
  clientId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);
