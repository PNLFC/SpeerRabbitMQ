const Tweet = require('../models/tweet');

const worker = async (message) => {
    let _id = null
    let likes_id = null
    let retweet_id = null
    let chat = null
    try{
        switch(message.type){
            case 'ADD_TWEET':
                await message.payload.save()
            case 'UPDATE_TWEET':
                const {updates, tweet} = message.payload
                updates.forEach((update) => tweet[update] = req.body[update])
                await tweet.save()
            case 'DELETE_TWEET':
                await Tweet.deleteOne(message.payload)
            case 'LIKE_TWEET':
                ;({_id, likes_id} = message.payload)
                await Tweet.findOneAndUpdate(
                    {_id: _id},
                    {$push: {likes: likes_id }}
                )
            case 'UNLIKE_TWEET':
                ;({_id, likes_id} = message.payload)
                await Tweet.findOneAndUpdate(
                    {_id},
                    {$pull: {likes: likes_id }}
                )
            case 'RETWEET':
                ;({_id, retweet_id} = message.payload)
                await Tweet.findOneAndUpdate(
                    {_id},
                    {$push: {retweets: retweet_id }},{
                        new: true
                    }
                )
            case 'NEW_CHATROOM':
                const {chats, chatRoom } = message.payload
                await chats.save()
                await chatRoom.save()

            case 'ADD_CHAT':
                ;({chat, _id} = message.payload)
                await chat.save()
                await ChatRoom.findOneAndUpdate(
                    {_id},
                    {$push: {chats: chat}},{
                        new: true
                    }
                )
            default:
                break;
        }
    }catch(e){
        throw new Error(e) 
    }
}

module.exports = worker