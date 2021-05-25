const router = require('express').Router();
const Job = require('../models/jobsModel');
const ObjectId = require('mongodb').ObjectID;
const moment = require('moment');
const _ = require('lodash');
// moment.locale('en');




router.get('/category/:id', (req, res)=>{
	const search = req.params.id;
	Job.find({category:{$in:[search]}}).populate('createdBy').exec((err, job) => {
			
		res.render('all-jobs', { jobs: job})

		console.log(job)
		
	});
})

router.get('/filtered/:id', (req, res)=>{
	const search = req.params.id;
	Job.find({tags:{$in:[search]}}).populate("createdBy").exec((err, job)=>{
		res.send(job)
		
	})
})


router.get('/', async (req, res) => {
	if (Object.keys(req.query).length === 0) {
		await Job.find({}).populate('createdBy').exec((err, job) => {
			
			res.render('all-jobs', { jobs: job, moment: moment })

			console.log(job)
		});
	} else {
		const { jobName, jobPrice } = req.query;
		let query = {};
		if (jobName) {
			query.name = jobName;
		}
		if (jobPrice) {
			query.price = jobPrice;
		}

		const job = await Job.find(query).populate('createdBy').exec((err, job) => {
			res.render('all-jobs', { jobs: job})

		})

	}
})



router.get('/:id', async (req, res) => {
	await Job.findById({ _id: new ObjectId(req.params.id) }).populate('createdBy').exec((err, job) => {
		res.render('single-job', { job: job})
	})
})




module.exports = router;