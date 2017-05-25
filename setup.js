var mongoose = require('mongoose');
var UserModel = require('./models/user');
var PostModel = require('./models/post');
var ClientModel = require('./models/client');

function connectToMongoDb(currentCount, limit, next)
{
    try {
        mongoose.connect(process.env.JAMB_API_MONGODB_URI);
        return next();
    } catch (error) {
        if (currentCount < limit) {
            setTimeout(function() {
                connectToMongoDb(currentCount++, limit, next);
            }, 2000);
        } else {
            return console.error('Could not connect mongodb');
        }
    }
}



function saveUser()
{
    var user = new UserModel();
    user.username = "deneme";
    user.password = "deneme123";
    user.save(function(err, user) {
        if (err) {
            return console.error(err);
        }
        return saveClient(user);
    });
}

function saveClient(user)
{
    var client = new ClientModel();
    client.name = "test client";
    client.id = "123";
    client.secret = "456";
    client.userId = user._id;
    client.save(function(err, client) {
        if (err) {
            return console.error(err);
        }
        return savePosts(user);
    });
}

function savePosts(user)
{
    var post1 = new PostModel();
    post1.content = "Deneme içeriği - 1";
    post1.userId = user._id;

    var post2 = new PostModel();
    post2.content = "Deneme içeriği - 2";
    post2.userId = user._id;

    var post3 = new PostModel();
    post3.content = "Deneme içeriği - 3";
    post3.userId = user._id;

    savePost(post1, 
        savePost(post2, 
            savePost(post3)
        )
    );
}

function savePost(post, next) {
    post.save(function(err, post) {
        if (err) {
            return console.error(err);
        }
        if (next) {
            next();
        } else {
            process.exit(0);
        }
    })
}

connectToMongoDb(0, 10, saveUser);