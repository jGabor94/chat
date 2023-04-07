import { Message, Chat } from "../models/models.js"
import { getId } from "../models/models.js"

export const chatServices = {
    createMessage: async ({userid}, type, message, roomid) => {
        const createdMsg = new Message({ type, user: userid, message })
        await createdMsg.save()

        if(type === 0){
            await Chat.updateOne({_id: roomid}, {$push: {messages: createdMsg._id}, $set: {visitors: [userid]}, $currentDate: {lastMessage: (type === 0) ? true : false}})
        }else{
            await Chat.updateOne({_id: roomid}, {$push: {messages: createdMsg._id}})
        }
       
        return await createdMsg.populate("user")
    },
    getPrivateChat: async (socket, userid, username) => {
        return await Chat.findOneAndUpdate({ $and: [
            {participants: {$all: userid}}, 
            {participants: {$all: socket.userid}}, 
            {type: "private"}
        ]}, {$addToSet: {visitors: socket.userid}}, {new : true}).populate({
            path: "messages",
            options: { sort: { _id: -1 } },
            populate: {
                path: "user",
                model: "User",
                select: 'username'
            }
        }).populate({
            path: "participants",
            select: {_id: 1, username: 1}
          })
    },
    createPrivateChat: async (socket, username, userid) => {
        const chat = new Chat({name: `pm: ${socket.username} és ${username}` ,participants: [socket.userid, userid], visitors: [socket.userid], messages: [], type: "private"})
        await chat.save()
        return await chat.populate({
            path: "participants",
            select: {_id: 1, username: 1}
          })
    },
    getChatById: async (socket, id) => {
        let chat =  await Chat.findOneAndUpdate({_id: id}, {$addToSet: {visitors: socket.userid}}, {new : true}).populate({
            path: "messages",
            options: { sort: { _id: -1 } },
            populate: {
                path: "user",
                model: "User",
                select: 'username'
            }
        })

        let newParticipant = false

        if(!chat.participants.includes(socket.userid)){
            chat.participants.push(socket.userid)
            await chat.save()
            newParticipant = true
        }

        chat = await chat.populate({
            path: "participants",
            select: {_id: 1, username: 1}
          })

        return {chat, newParticipant}
    },
    getChatList: async (userid) => {
        return await Chat.find({ participants: userid }).select({messages: 0}).populate({
            path: "participants",
            select: {_id: 1, username: 1}
          }).sort( { lastMessage : -1 } ).lean()
    },
    removeParticipant: async (socket, id) => {
        return await Chat.findOneAndUpdate({_id: id}, {$pull: {participants: socket.userid}}, {new : true}).populate({
            path: "participants",
            select: {_id: 1, username: 1}
          })
    }

  
}