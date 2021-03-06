const express = require('express');
const User = require('../models/user');
const router = new express.Router();



router.post('/users', async (req,res) => {
    const user = new User({...req.body})
    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    } catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req,res) => {
    try{
        const {username, password} = req.body
        const user = await User.findByCredentials(username,password)
        const token = await user.generateAuthToken()
        res.send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
})

module.exports = router;