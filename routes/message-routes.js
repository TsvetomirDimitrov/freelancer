const express = require('express');
const router = express.Router();
const Message = require('../models/messageModel');
const moment = require('moment');
const axios = require('axios');
// moment.locale('bg')

router.get('/', (req, res)=> {
	res.render('messages', {axios:axios})
})
//add

router.post('/', async(req, res)=> {
	const newMessage = new Message(req.body)


	try{

		const savedMessage = await newMessage.save();
		res.status(200).json(savedMessage);

	}catch(err){
		res.status(500).json(err)
	}
})



//get conversation by id, returns array of messages objects, which include sender id
router.get('/:conversationId', async(req, res)=> {
	// console.log(req.params.conversationId)
	try{

		const messages = await Message.find({
			conversationId:req.params.conversationId
		})
		res.status(200).json(messages);
		// console.log(messages)

	}catch(err){
		res.status(200).json(err)
	}
})


//get










module.exports = router;