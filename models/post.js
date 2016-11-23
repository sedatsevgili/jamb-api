var mongoose = require('mongoose');
var TagSchema = require('./tag').schema;

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
	},
	tags: [TagSchema]
});

module.exports = mongoose.model('Post', PostSchema);
