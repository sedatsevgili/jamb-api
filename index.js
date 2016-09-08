var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');
var restful = require('node-restful');
var mongoose = restful.mongoose;

var UserModel = require('./models/user');
var PostModel = require('./models/post');

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(methodOverride());

mongoose.connect('mongodb://localhost:27017/jamb');

restful.model('user', UserModel.schema).methods(['get', 'post', 'put', 'delete']).register(app, '/users');
restful.model('post', PostModel.schema).methods(['get', 'post', 'put', 'delete']).register(app, '/posts');

app.listen(3000);

console.log('listening on ' + 3000);
