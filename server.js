const express = require('express');
const app = express();
const mongoose = require('mongoose');
const authRouter = require('./routes/auth-routes');
const profileRouter = require('./routes/profile-routes');
const jobListRouter = require('./routes/jobList-routes');
const specialistsRouter = require('./routes/specialists-routes');
const messagesRouter = require('./routes/message-routes');
const passportSetup = require('./config/passport-setup');
const session = require('express-session');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');
const methodOverride = require('method-override');
const moment = require('moment');
const _ = require('lodash');
const Job = require('./models/jobsModel');
const flash = require('connect-flash');
const underscore = require('underscore');

mongoose.connect('mongodb://localhost:27017/freelance', { useNewUrlParser: true, useUnifiedTopology: true, ignoreUndefined: true, useFindAndModify: false });



const dateFormat = "YYYYMMDD";
app.locals.moment = moment;
app.locals.dateFormat = dateFormat;
app.locals.test = "test";
app.locals.underscore = underscore;

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
	res.send('404 greshka')
})


app.listen(3000, () => {
	console.log('listening on 3000');
})