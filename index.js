var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');
var restful = require('node-restful');
var mongoose = restful.mongoose;

var UserModel = require('./models/user');

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(methodOverride());

mongoose.connect('mongodb://localhost:27017/jamb');

var UserResource = restful.model('user', UserModel.schema).methods(['get', 'post', 'put', 'delete']);
UserResource.register(app, '/users');

app.listen(3000);

console.log('listening on ' + 3000);
