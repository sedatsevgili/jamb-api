var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var TagBinder = require('../../modules/tag_binder');
var Post = require('../../models/post');

describe('TagBinder', function() {
  it('bindTags must return immediately when there is no tagNames', function() {
    var post = new Post();
    TagBinder.bindTags(post, null, function(err, post) {
      expect(post.tags).to.be.empty;
    });
  });
});
