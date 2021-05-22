const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const keys = require('./keys');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');


passport.serializeUser((user, done) => {
	done(null, user.id);
})

passport.deserializeUser((id, done) => {
	User.findById(id).then((user) => {
		done(null, user);
	})
});
passport.use(
	new GoogleStrategy({
		//options for google strategy
		callbackURL: '/auth/google/redirect',
		clientID: keys.google.clientID,
		clientSecret: keys.google.clientSecret
	}, (accessToken, refreshToken, profile, done) => {
		//passport callback function when it gets code from profile

		//check if user exists in db
		//googleId: profile.id
		User.findOne({ email: profile.emails[0].value }).then((currentUser) => {
			if (currentUser) {
				if (currentUser.googleId === undefined) {
					currentUser.googleId = profile.id;
				}
				//user exists
				console.log('user is:', currentUser)
				done(null, currentUser);

			} else {
				//create user

				new User({
					email: profile.emails[0].value,
					googleId: profile.id
				}).save().then((newUser) => {
					console.log('new user created: ' + newUser);
					done(null, newUser);
				})
			}
		})




	}
	));


//Local strategy

passport.use(new LocalStrategy(({ usernameField: "email", passwordField: "password", passReqToCallback: true }), (req, email, password, done) => {
	//Search for user
	User.findOne({ email: email })
		.then(user => {
			//Create user if none found
			if (!user) {
				
				console.log('user not found');
				const name = req.body.name;
				const surname = req.body.surname;
				const nickname = req.body.nickname;

				const newUser = new User({ name, surname, nickname, email, password });
				//Hash password before saving
				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						// if (err) throw err;
						newUser.password = hash;
						newUser
							.save()
							.then(user => {
								return done(null, user);
							})
							.catch(err => {
								return done(null, false, { message: err });
							});
					});
				});
			} else {
				//if user found, match password
				console.log('user found');
				bcrypt.compare(password, user.password, (err, isMatch) => {
					if (err) {
						console.log('wrong pass')
					}
					if (isMatch) {
						return done(null, user);
					} else {
						console.log('no')
						
						return done(null, false, { message: "Wrong password" })
					}
				});
			}
		})
		.catch(err => {
			return done(null, false, { message: err });
		});

})
);



//Facebook strategy

passport.use(new FacebookStrategy({
	clientID: keys.facebook.clientID,
	clientSecret: keys.facebook.secret,
	callbackURL: '/auth/facebook/redirect',
	profileFields: ['id', 'displayName', 'name', 'email']
}, function (token, refreshToken, profile, done) {
	User.findOne({ email: profile.emails[0].value }).then((currentUser) => {
		if (currentUser) {
			//user exists
			if (currentUser.facebookId === undefined) {
				currentUser.facebookId = profile.id;
			}

			console.log('user is:', currentUser)
			done(null, currentUser);

		} else {
			//create user

			new User({
				name: profile.name.givenName,
				email: profile.emails[0].value,
				facebookId: profile.id
			}).save().then((newUser) => {
				console.log('new user created: ' + newUser);

				done(null, newUser);
			})
		}
	})

}));
