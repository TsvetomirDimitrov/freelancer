const router = require('express').Router();
const passport = require('passport');
const flash = require('connect-flash');
const User = require('../models/userModel');
//auth login

router.use(flash());

router.get('/login', (req, res) => {
	res.render('login', { user: req.body });
})


//auth logout
router.get('/logout', (req, res) => {
	//handle with passport
	req.logout();
	res.redirect('/');
});

//auth with local strategy

// router.post('/local',
// 	passport.authenticate('local', {
// 		successRedirect: '/profile',
// 		failureRedirect: '/',
// 		failureFlash: true
// 	}));

router.get('/checknickname/:id', async (req, res) => {
	const nickname = req.params.id;
	console.log(nickname)
	await User.findOne({ nickname: new RegExp(`^${nickname}$`, 'i') }).exec((err, result) => {
		if (result) {
			res.send(JSON.stringify({ nick: "taken" }))
		} else {
			res.send(JSON.stringify({ nick: "free" }))
		}
	})

})
router.get('/checkemail/:id', async (req, res) => {
	const email = req.params.id;
	console.log(email)
	console.log('da')
	await User.findOne({ email: new RegExp(`^${email}$`, 'i') }).exec((err, result) => {
		if (result) {
			res.send(JSON.stringify({ nick: "taken" }))
		} else {
			res.send(JSON.stringify({ nick: "free" }))
		}
	})

})
router.post('/local', function (req, res, next) {

	passport.authenticate('local', function (err, user, info) {
		if (err) { return next(err); }
		//if there is no user in the response send the info back to modal
		if (!user) {
			return res.send(info);
		}
		//user was able to login, send true and redirect
		req.logIn(user, function (err) {
			if (err) { return next(err); }
			return res.send({ valid: true });
		});
	})(req, res, next);
})



//   function(req, res) {
//     // If this function gets called, authentication was successful.
//     // `req.user` contains the authenticated user.
//     res.redirect('/profile');
//   });


//auth with google
router.get('/google', passport.authenticate('google', {
	scope: ['profile', 'email']
}))

//callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
	res.redirect('/profile')
})

//auth with facebook
router.get('/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get('/facebook/redirect', passport.authenticate('facebook', {
	successRedirect: '/profile',
	failureRedirect: '/failed'
}))

router.get('/facebook/redirect', passport.authenticate('facebook'), (req, res) => {
	res.redirect('profile');
})




module.exports = router;