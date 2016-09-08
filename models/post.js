var restful = require('node-restful');
var mongoose = restful.mongoose;
var UserModel = require('./user');

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

PostSchema.pre('save', function(callback) {
	var post = this;

	if(!post.isModified('userId')) {
		return callback();
	}
	
	try {
		var userObjectId = mongoose.Types.ObjectId(post.userId);
	} catch (err) {
		return callback(err);
	}

	UserModel.find({_id: userObjectId}, function(err, user) {
		if(err) return callback(err);

		if(!user) {
			return callback(new Error('User not found'));
		}

		return callback();
	});
});

module.exports = mongoose.model('Post', PostSchema);
