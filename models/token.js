var restful = require('node-restful');
var mongoose = restful.mongoose;

var TokenSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  clientId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Token', TokenSchema);
