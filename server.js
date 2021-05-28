const express = require('express');
const app = express();
const mongoose = require('mongoose');
const authRouter = require('./routes/auth-routes');
const profileRouter = require('./routes/profile-routes');
const jobListRouter = require('./routes/jobList-routes');
const specialistsRouter = require('./routes/specialists-routes');
const messagesRouter = require('./routes/message-routes');
const conversationRouter = require('./routes/conversations-routes');
const passportSetup = require('./config/passport-setup');
const session = require('express-session')
const rateLimit = require("express-rate-limit");
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');
const expressValidator = require('express-validator');
const methodOverride = require('method-override');
const moment = require('moment');
const _ = require('lodash');
const Job = require('./models/jobsModel');
const flash = require('connect-flash');
const underscore = require('underscore');
var socket = require('socket.io');
require('moment/locale/bg')

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/freelance', { useNewUrlParser: true, useUnifiedTopology: true, ignoreUndefined: true, useFindAndModify: false });



const dateFormat = "YYYYMMDD";
app.locals.moment = moment;
app.locals.dateFormat = dateFormat;
app.locals.underscore = underscore;
app.locals.moment.locale('bg')


app.use(flash());
app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.set('views', 'views');
app.set('view engine', 'ejs');
app.use(cookieSession({
	maxAge: 24 * 60 * 60 * 1000,
	keys: [keys.session.cookieKey]
}));

app.set('trust proxy', 1);

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100 // limit each IP to 100 requests per windowMs
  });
  
  //  apply to all requests
  app.use(limiter);
//initialize passport
app.use(session({ secret: keys.passportSecret }))
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
})



app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/messages', messagesRouter);
app.use('/conversations', conversationRouter);
app.use('/joblist', jobListRouter);
app.use('/specialists', specialistsRouter);

app.get('/', (req, res) => {


	console.log('home');
	if (req.user) {
		const lo = _.omit(JSON.parse(JSON.stringify(req.user)), ['password']);
		res.render('index', { user: lo })
	} else {
		res.render('index');
	}
});



app.get('/why', (req, res) => {
	res.render('why', { user: req.user })
});








app.get('*', (req, res) => {
	res.send('Page not found')
})

var server = app.listen(process.env.PORT || 3000, function () {
	console.log('app running');
});

var io = socket(server)
socketIds = new Map()

io.on('connection', function (socket) {
	console.log('Client connected...');


	socket.on('chat message', (msg) => {
		//msg to mongo
		console.log('server got message')
		// console.log(msg.to)
		io.to(msg.to).emit('sent message', msg)
		// console.log(msg)

	})


	socket.on('user', (msg) => {
		// console.log('xaxax'+ Object.values(map))
		if (!Object.values(socketIds).includes(msg)) {
			socketIds.set(msg, socket.id);
		}
		console.log(socketIds)
		io.emit('ids', Array.from(socketIds));

	})
	socket.on('disconnect', (msg) => {
		console.log('dc')
		// socketIds.delete

	})
});



