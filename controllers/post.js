var Post = require('../models/post');
var Tag = require('../models/tag');

exports.postPosts = function(req, res) {
  var post = new Post();
  post.content = req.body.content;
  post.userId = req.user._id;
  post.createdAt = new Date();
  post.hidden = req.body.hidden;

  if (req.body.tags && (typeof req.body.tags) == 'object') {
    for(var i = 0; i < req.body.tags.length; i++) {
      var tagName = req.body.tags[i];

      if((typeof tagName) === 'string') {
        var tag = Tag.findOne({'name': tagName}, function(err, tagModel) {
          if(err) {
            return res.send(err);
          }

          // we don't have any tag document. so create it.
          if(!tagModel) {
            var tagModel = new Tag();
            tagModel.name = tagName;
            tagModel.userId = req.user._id;
            tagModel.save(function(err) {
              if(err) {
                return res.send(err);
              }
            });

          }
        });
      }
    }
  }

  post.save(function(err) {
    if(err) {
      return res.send(err);
    }

    res.json(post);
  })
}

exports.getPosts = function(req, res) {
  Post.find({userId: req.user._id}, function(err, posts) {
    if(err) {
      return res.send(err);
    }

    return res.json(posts);
  });
}

exports.getPost = function(req, res) {
  Post.find({_id: req.params.post_id, userId: req.user._id}, function(err, post) {
    if(err) {
      return res.send(err);
    }

    res.json(post);
  });
}

exports.putPost = function(req, res) {
  Post.findOne({_id: req.params.post_id, userId: req.user._id}, function(err, post) {
    if(err) {
      return res.send(err);
    }
    post.content = req.body.content;
    post.hidden = req.body.hidden;
    post.save(function(err) {
      if(err) {
        return res.send(err);
      }

      return res.json(post);
    });
  });
}

exports.deletePost = function(req, res) {
  Post.remove({userId: req.user._id, _id: req.params.post_id}, function(err) {
    if(err) {
      return res.send(err);
    }

    res.status(204);
    return res.json();
  });
}
