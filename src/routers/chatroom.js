const express = require('express');
const { ChatRoom, Chat } = require('../models/chatroom');
const auth = require('../middleware/auth');
const addEntry = require('../queue/producer');
const router = new express.Router();

router.post('/chatroom',auth, async (req,res) => {
    const {participants, chat} = req.body
    try{
        const chats = new Chat({message: chat, sender: req.user._id})
        const chatRoom = new ChatRoom({
            participants: participants,
            chats: [chats]
        })
        await addEntry({chats, chatRoom})
        res.status(201).send()
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/chatroom/:id', auth, async (req,res) => {
    const { message } = req.body
    try {
      let chat = new Chat({
        message: message,
        sender: req.user._id
      })
      await addEntry({chat, _id: req.params.id})
      res.status(201).send(chatRoom)
    }catch(e){
        res.status(400).send(e)
    }
})

module.exports = router;