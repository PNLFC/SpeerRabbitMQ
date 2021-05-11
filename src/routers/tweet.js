const express = require('express');
const Tweet = require('../models/tweet');
const auth = require('../middleware/auth');
const addEntry = require('../queue/producer');
const router = new express.Router();


router.post('/tweet',auth, async (req,res) => {
    const tweet = new Tweet({
        ...req.body,
        owner: req.user._id})
    try{
        const message = {action: 'ADD_TWEET', payload: tweet};
        await addEntry(message);
        res.status(201).send(tweet)
    }catch(e){
        res.status(400).send(e)
    }
})

router.patch('/tweet/:id', auth, async (req,res) => {
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every((update) => update === 'tweet')
    if(!isValidOperation){
        return res.status(404).send('error: Invalid update')
    }
    try{
        const tweet = await Tweet.findOne({_id:req.params.id, owner:req.user._id})
        if(!tweet){
            return res.status(404).send()
        }
        const message = {action: 'UPDATE_TWEET', payload: {tweet, updates}};
        await addEntry(message)
        res.status(200).send()
    }catch(e){
        res.status(400).send(e)
    }
})


router.delete('/tweet/:id', auth, async(req,res) => {
    try{
        const query = {_id: req.params.id, owner: req.user._id}
        const tweet = await Tweet.findOne(query)
        if (!tweet){
            return res.status(401).send()
        }
        const message = {action:'DELETE_TWEET', payload: query}
        await addEntry(message)
        res.status(200).send(tweet)
    }catch(e){
        res.status(500).send(e)
    }
})

router.get('/tweet/:id', auth, async (req,res) => {
    const _id = req.params.id
    try{
        const tweet = await Tweet.findOne({_id, owner: req.user._id})
        if (!tweet){
            res.status(404).send()
        }
        res.send(tweet)
    }catch(e){
        res.status(500).send(e)
    }
})

router.post('/tweet/like/:id', auth, async(req, res) => {
    const {likes_id} = req.body
    const _id = req.params.id
    try{
        const message = {action:'LIKE_TWEET', payload: {_id, likes_id}}
        await addEntry(message)
        res.status(200).send()
    }catch(e){
        res.status(404).send(e)
    }
})

router.post('/tweet/unlike/:id', auth, async(req, res) => {
    const {likes_id} = req.body
    const _id = req.params.id
    try{
        const message = {action:'UNLIKE_TWEET', payload: {_id, likes_id}}
        await addEntry(message)
        res.status(200).send()
    }catch(e){
        res.status(404).send(e)
    }
})

router.post('/tweet/retweet/:id', auth, async(req, res) => {
    const {retweet_id} = req.body
    const _id = req.params.id
    try{
        const message = {action:'RETWEET', payload: {_id, retweet_id}}
        await addEntry(message)
        res.status(200).send()
    }catch(e){
        res.status(404).send(e)
    }
})

module.exports = router;