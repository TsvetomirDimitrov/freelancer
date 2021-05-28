const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;
const Conversation = require('../models/conversationModel')
const User = require('../models/userModel');
const sainitez = require('mongo-sanitize')

//new conv

router.post('/', async (req, res) => {
	const cleanSender = sanitize(req.body.senderId);
	const cleanReceiverId = sanitize(req.bodyy.receiverId)
	const newConnversation = new Conversation({
		members: [cleanSender, cleanReceiverId]
	})

	try {
		const savedConversation = await newConnversation.save();
		res.status(200).json(savedConversation);
	} catch (err) {
		res.staatus(500).json(err)
	}
})
router.get('/getUser/:id', (req, res) => {
	// console.log('here')
	// console.log(req.params.id)
	const id = new ObjectId(req.params.id);
	const cleanId = sanitize(new ObjectId(req.params.id))
	User.findOne({ _id: cleanId }).exec((err, user) => {
		// console.log(user)
		res.send(user)
	})
})
router.get('/:userId', async (req, res) => {
	// console.log('here but no')
	// console.log(req.params.userId);
	try {
		const conversation = await Conversation.find({
			members: { $in: [req.params.userId] }
		})
		// console.log(conversation)
		res.status(200).json(conversation)
	} catch (err) {
		res.status(500).json(err);
	}
})










module.exports = router;