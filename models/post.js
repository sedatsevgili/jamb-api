var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
	content: {
		type: String,
		required: true
	},
	userId: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	hidden: {
		type: Boolean,
		default: false
	}
});

module.exports = mongoose.model('Post', PostSchema);
