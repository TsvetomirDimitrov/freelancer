const express = require('express');
const router = express.Router();
const Job = require('../models/jobsModel');
const User = require('../models/userModel');
const methodOverride = require('method-override');
const ObjectId = require('mongodb').ObjectID;
const Offer = require('../models/offersModel');
const sanitize = reqire('mongo-sanitize');
router.use(methodOverride('_method'));

router.use(express.urlencoded({ extended: true }))
//check if user is logged in
const authCheck = (req, res, next) => {
	if (!req.user) {
		//if user is not logged in
		res.redirect('/auth/login');
	} else {
		//if user is logged in

		next();
	}
}





router.get('/jobs/edit/:id', async (req, res) => {


	await Job.findById({ _id: new ObjectId(req.params.id) }).populate('createdBy')
		.exec((err, job) => {

			if (req.user.id == job.createdBy.id) {

				res.render('edit-job', { job: job })
			}

		})
})


router.put('/edit/:id', async (req, res) => {
	const newSkills = req.body.skills.replace(/[ ,]+/g, ",").toLowerCase();
	const skills = newSkills.split(',');
	const cleanSkills = sanitize(newSkills)
	const cleanDescription = sanitize(req.body.description)
	const cleanPhone = sanitize(req.body.phone)
	const cleanCity = sanitize(req.body.city)
	User.findOneAndUpdate({ _id: new ObjectId(req.params.id) }, { $addToSet: { skills: cleanSkills }, description: cleanDescription, phone: cleanPhone, city: cleanCity })
		.exec((err, result) => {
			console.log(result);
		})
	// User.findOneAndUpdate({ _id: new ObjectId(req.params.id) }, { description: req.body.description, phone: req.body.phone, city: req.body.city }, (err, result) => {
	// 	const userId = new ObjectId(req.user.id);

	// const jobs =  Job.find().populate("createdBy")
	// 	.exec((err, result) => {
	// 		const job = result.filter(val => val.createdBy.id == userId);
	// 		res.render('profile', { jobs: job, offers:offers});
	// 		// console.log(msg)

	// 	});
	res.redirect('/profile')

})


// })	

router.put('/jobs/edit/:id', async (req, res) => {
	console.log(req.params.id);
	await Job.findById({ _id: new ObjectId(req.params.id) }).populate("createdBy").exec(async (err, job) => {
		if (req.user) {
			const cleanJobName = sanitize(req.body.jobName)
			const cleanDescription = sanitize(req.body.jobDesc)
			const cleanPrice = sanitize(req.body.jobPrice)
			const cleanDeadline = sanitize(req.body.deadline)
			if (job.createdBy.id === req.user.id) {
				await Job.findByIdAndUpdate({ _id: new ObjectId(req.params.id) }, { name: cleanJobName, description: cleanDescription, price: cleanPrice, deadline: cleanDeadline, category: req.body.jobCategory })
					.exec((err, job) => {
						console.log("this is jobs edit")
						// res.render('edit-job', { job: job })
						res.redirect('/profile')
					})
			} else {
				console.log('no update')
				res.send('no access')
			}
		} else {

			res.send('no access')
		}
	})
})

router.delete('/jobs/delete/:id', async (req, res) => {
	// console.log(req.user.id);

	await Job.findById({ _id: new ObjectId(req.params.id) }).populate("createdBy").exec(async (err, job) => {
		if (req.user) {

			if (job.createdBy.id === req.user.id) {

				await Job.findOneAndDelete({ _id: new ObjectId(req.params.id) })
					.exec((err, result) => {
						console.log('correct id');
						res.redirect('/profile')
					})


			} else {
				console.log('no delete')
				res.send('no access')
			}
		} else {

			res.send('no access')
		}

	})

})


router.get('/', authCheck, async (req, res) => {
	const userId = new ObjectId(req.user.id);

	await Job.find().populate("createdBy")
		.exec(async (err, result) => {
			await Offer.find().populate('createdBy')
				.exec((err, offer) => {

					const offers = offer.filter(offer => offer.createdBy.id == userId);
					const job = result.filter(val => val.createdBy.id == userId);
					res.render('profile', { jobs: job, offers: offers });
				})

		});
})

router.get('/createJob', authCheck, (req, res) => {
	res.render('createJob', { user: req.user })
})

router.get('/createOffer', authCheck, (req, res) => {
	res.render('createOffer', { user: req.user })
})


router.post('/createOffer', authCheck, async (req, res) => {

	// { $push: { comments: { text: commentText, postedBy: postedBy }
	const offerName = req.body.jobName;
	// console.log(req.body.standardPackPrice)
	console.log(offerName)
	let package = {
		packageType: "starter",
		packagePrice: req.body.starterPackPrice,
		packageDescription: req.body.starterPackDescription,
		packageRevisions: req.body.starterPackRevisions,
		packageDeliveryTime: req.body.starterPackDeliveryTime
	}

	let standardPackage = {
		standardPackageType: "standard",
		standardPackagePrice: req.body.standardPackPrice,
		standardPackageDescription: req.body.standardPackDescription,
		standardPackageRevisions: req.body.standardPackRevisions,
		standardPackageDeliveryTime: req.body.standardPackDeliveryTime

	}

	await new Offer({

		name: req.body.jobName,
		description: req.body.jobDesc,
		startingPrice: req.body.jobPrice,
		packages: [package],
		category: req.body.jobCategory,
		createdBy: req.user.id
	}).save().then(
		Offer.findOneAndUpdate({ name: offerName }, { $addToSet: { packages: [standardPackage] } }).exec((err, offer) => {
			console.log(offer)
		}))
	res.redirect('/profile')

})



router.post('/createJob', (req, res) => {
	const tags = req.body.jobTags.replace(/[ ,]+/g, ",").toLowerCase();
	console.log(typeof tags);

	{
		new Job({
			name: req.body.jobName,
			description: req.body.jobDesc,
			deadline: req.body.jobDeadline,
			category: req.body.jobCategory,
			price: req.body.jobPrice,
			createdBy: req.user.id,
			tags: tags

		})
			.save()
			.then(console.log('job created'));
		res.redirect('/profile');

	}
})



module.exports = router;