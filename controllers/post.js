var Post = require('../models/post');
var Tag = require('../models/tag');
var TagBinder = require('../modules/tag_binder');

exports.postPosts = function(req, res) {
  var post = new Post();
  post.content = req.body.content;
  post.userId = req.user._id;
  post.createdAt = new Date();
  post.hidden = req.body.hidden;

  TagBinder.bindTags(post, req.body.tags, function(err, post) {
    if(err) {
      return res.send(err);
    }

    post.save(function(err) {
      if(err) {
        return res.send(err);
      }

      res.json(post);
    });
  });
  
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
