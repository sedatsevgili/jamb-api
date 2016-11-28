var Post = require('../models/post');
var Tag = require('../models/tag');
var TagBinder = require('../modules/tag_binder');

exports.postPosts = function(req, res) {
  var post = new Post();
  post.content = req.body.content;
  post.userId = req.user._id;
  post.createdAt = new Date();
  if(req.body.hidden) {
    post.hidden = req.body.hidden;
  }

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
  var query = {userId: req.user._id, hidden: false};
  if(req.query.q) {
    query.content = new RegExp(req.query.q, 'i');
  }
  if(req.query.filter) {
    query.tags = {
      $elemMatch: {name: req.query.filter}
    };
  }
  var sortingOptions = {
    skip: 0,
    limit: 10,
    sort: {
      createdAt: -1
    }
  };
  if(req.query.skip) {
    sortingOptions.skip = parseInt(req.query.skip);
  }
  if(req.query.limit) {
    sortingOptions.limit = parseInt(req.query.limit);
  }
  if(req.query.sort && (typeof req.query.sort) == 'object') {
    sortingOptions.sort = {};
    var sortMatcher = {'asc' : '1', 'desc' : '-1'};
    for (var key in req.query.sort) {
      var value = req.query.sort[key];
      if(value in sortMatcher) {
        sortingOptions.sort[key] = sortMatcher[value];
      }
    }
  }
  Post.find(query, null, sortingOptions, function(err, posts) {
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
    post.tags = [];

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
