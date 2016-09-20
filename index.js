var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var ejs = require('ejs');
var passport = require('passport');

var UserModel = require('./models/user');
var PostModel = require('./models/post');
var ClientModel = require('./models/client');

var OAuth2Controller = require('./controllers/oauth2');
var PostController = require('./controllers/post');
var UserController = require('./controllers/user');

var AuthModule = require('./modules/auth');

var app = express();
var router = express.Router();

app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(methodOverride());
app.use(session({
	secret: 'Super Secret Session Key',
	saveUninitialized: true,
	resave: true
}));
app.use(passport.initialize());

//mongoose.connect('mongodb://localhost:27017/jamb');
mongoose.connect(process.env.MONGODB_URI);

router.route('/oauth2/authorize')
	.get(AuthModule.isUserAuthenticated, OAuth2Controller.authorization)
	.post(AuthModule.isUserAuthenticated, OAuth2Controller.decision);

router.route('/oauth2/token')
	.post(AuthModule.isClientAuthenticated, OAuth2Controller.token);

router.route('/me')
	.get(AuthModule.isBearerAuthenticated, UserController.getMe);

router.route('/posts')
	.get(AuthModule.isBearerAuthenticated, PostController.getPosts)
	.post(AuthModule.isBearerAuthenticated, PostController.postPosts);

router.route('/posts/:post_id')
	.get(AuthModule.isBearerAuthenticated, PostController.getPost)
	.put(AuthModule.isBearerAuthenticated, PostController.putPost)
	.delete(AuthModule.isBearerAuthenticated, PostController.deletePost);

app.use('/', router);

var port = process.env.PORT ? process.env.PORT : 3000;
app.listen(port);

console.log('listening on ' + port);
