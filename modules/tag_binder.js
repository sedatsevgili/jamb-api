var Post = require('../models/post');
var Tag = require('../models/tag');

var currentProcessedTagCount = 0;
var sentTagCount = 0;

pushTag = function(postModel, tagModel, callback) {
  postModel.tags.push(tagModel);
  if(currentProcessedTagCount == sentTagCount) {
    return callback(false, postModel);
  }
}

exports.bindTags = function(post, tagNames, callback) {
  currentProcessedTagCount = 0;

  if(!tagNames) {
    return callback(false, post);
  }
  if((typeof tagNames) !== 'object') {
    return callback(false, post)
  }
  sentTagCount = tagNames.length;
  tagNames.forEach(function(tagName) {

    Tag.findOne({'name': tagName, 'userId': post.userId}, function(err, tagModel) {
      if(err) {
        return callback(err);
      }

      if(tagModel) {
        currentProcessedTagCount++;
        pushTag(post, tagModel, callback);
        return;
      }

      // we don't have tag model, so create it.
      tagModel = new Tag();
      tagModel.name = tagName;
      tagModel.userId = post.userId;
      tagModel.save(function(err) {
        if(err) {
          return callback(err);
        }
        currentProcessedTagCount++;
        pushTag(post, tagModel, callback);
      });
    });
  });

}
