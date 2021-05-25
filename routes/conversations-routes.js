const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;
const Conversation = require('../models/conversationModel')
const User = require('../models/userModel');

//new conv

router.post('/', async (req, res) => {
	const newConnversation = new Conversation({
		members: [req.body.senderId, req.body.receiverId]
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
	User.findOne({ _id: id }).exec((err, user) => {
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