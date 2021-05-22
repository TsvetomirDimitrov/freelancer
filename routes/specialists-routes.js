const router = require('express').Router();
const User = require('../models/userModel');
const Job = require('../models/jobsModel');
const Offer = require('../models/offersModel');
const ObjectId = require('mongodb').ObjectID;
const moment = require('moment');
const _ = require('lodash');
moment.locale('bg');



router.get('/filtered/:id', (req, res) => {

	console.log(req.params.id);
	const search = req.params.id;
	User.find({ skills: { $in: [search] } }).exec((err, users) => {
		console.log(users)
		res.json(users.map(user => {
			const lo = _.omit(JSON.parse(JSON.stringify(user)), ['password']);
			console.log(lo);
			return lo;
		}));


	})
})

router.get('/', (req, res) => {
	User.find({}).exec((err, user) => {
		res.render('specialists', { user: user })
	})
})

router.get('/:id', async (req, res) => {
	const nick = req.params.id;
	await User.findOne({ nickname: nick }).populate('comments.postedBy')
		.exec((err, user) => {

			const id = new ObjectId(user._id);

			Job.find({ createdBy: id }).exec((err, jobs) => {

				Offer.find({ createdBy: id }).exec((err, offers) => {


					res.render('single-specialist', { user: user, jobs: jobs, offers: offers })
				})
			})

		})
})

router.get('/fetch/:id', async (req, res) => {
	const search = req.params.id;
	await User.findOne({ nickname: search }).populate('comments.postedBy').exec((err, result) => {
		res.send(JSON.stringify(result))
	})

})

router.post('/:id/newComment', async (req, res) => {
	console.log(req.user.id);
	console.log(req.body)
	const sendTo = req.body.sendTo;
	const commentText = req.body.commentText;
	const postedBy = new ObjectId(req.user.id);

	await User.findOneAndUpdate({ nickname: sendTo }, { $push: { comments: { text: commentText, postedBy: postedBy } } }).exec(async (err, result) => {
		await User.find({ nickname: sendTo }).exec((err, user) => {
			res.send(user);
		})
	})


	// const id = req.params.id;
	// const commentText = req.body.commentText;
	// const postedBy = new ObjectId(req.user.id);

	// await User.findOneAndUpdate({nickname:id},{$push:{comments: {text: commentText, postedBy: postedBy}}}).exec((err, comment)=> {

	// 	console.log(commentText)
	// 	console.log(req.params.id);
	// 	res.render('/specialists/'+id)
	// })
})




module.exports = router;