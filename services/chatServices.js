import { Message, Chat } from "../models/models.js"
import { getId } from "../models/models.js"

export const chatServices = {
    createMessage: async (userid, type, message, roomid) => {
        const createdMsg = (type === 0) ? new Message({ type, user: userid, message }) : new Message({ type, message })
        await createdMsg.save()

        if(roomid){ 
            await Chat.updateOne({_id: roomid}, {$push: {messages: createdMsg._id}, lastMessage: createdMsg, $set: {visitors: [userid]}})
        }
        return await createdMsg.populate("user")
        
    },
    getPrivateChat: async (originatorUid, anotherUid) => {
        const chat = await Chat.findOneAndUpdate({ $and: [
            {participants: {$all: anotherUid}}, 
            {participants: {$all: originatorUid}}, 
            {type: "private"}
        ]}, {$addToSet: {visitors: originatorUid}}, {new : true}).populate({
            path: "messages",
            options: { sort: { _id: 1 } },
            populate: {
                path: "user",
                model: "User",
                select: {_id: 1, username: 1, imageid: 1}
            }
        }).populate({
            path: "participants",
            select: {_id: 1, username: 1}
          })
          return chat
    },
    createPrivateChat: async (originator, anotherUsername, anotherUid) => {
        const createdMsg = await chatServices.createMessage(originator.id, 1, `${originator.username} és ${anotherUsername} csatlakozott`)
        const chat = new Chat({name: `pm: ${originator.username} és ${anotherUsername}` ,participants: [originator.id, anotherUid], lastMessage: createdMsg, visitors: [originator.id], messages: [createdMsg._id], type: "private"})
        await chat.save()
        await chat.populate({
            path: "messages",
            populate: {
                path: "user",
                model: "User",
                select: {_id: 1, username: 1, imageid: 1}
            }
        })

     
        return await chat.populate({
            path: "participants",
            select: {_id: 1, username: 1, imageid: 1}
          })
    },
    getChatById: async (userdata, id) => {
   
        let chat =  await Chat.findOne({_id: id}).populate({
            path: "lastMessage",
          }).populate({
            path: "messages",
            populate: {
                path: "userdata",
                model: "User",
                select: {_id: 1, username: 1, imageid: 1}
            },
        })
        
        let newParticipant = false
        let createdMsg = false

        if(!chat.participants.includes(userdata.id)){
            chat.participants.push(userdata.id)
            newParticipant = true
            createdMsg = await chatServices.createMessage(false, 1, userdata.username + " csatlakozott")
            chat.messages.push(createdMsg)
            chat.lastMessage = createdMsg
        }

        if(!chat.visitors.includes(userdata.id)){
            chat.visitors.push(userdata.id)
        }
  
        await chat.save()
        

     
        chat = await chat.populate({
            path: "participants",
            select: {_id: 1, username: 1, imageid: 1}
          })

          if(chat.participants.length < 2 && chat.type === "private"){
            chat.participants.push({username: "törölt felhasználó", imageid: "default"})
        }

        chat = chat.toObject()

        chat.messages.map((message) => {
            message.user = message.user = (message.userdata === null) ? 
                {_id: message.user, username: "törölt felhasználó", imageid: "default"} :
                message.userdata
            delete message.userdata;
          
          })

        return {chat, newParticipant, createdMsg}
    },
    getChatList: async (userid) => {


        const ChatList = await Chat.find({ participants: userid }).select({messages: 0, __v: 0, updatedAt: 0, createdAt: 0}).populate({
            path: "lastMessage",
          }).populate({
            path: "participants",
            model: "User",
            select: {_id: 1, username: 1, imageid: 1}
          }).sort( { lastMessage : -1 } )

          ChatList.map((chat) => {

            if(chat.participants.length < 2 && chat.type === "private"){
                chat.participants.push({username: "törölt felhasználó", imageid: "default"})
            }
          })

         return ChatList
        

          
    },
    removeParticipant: async (uid, chatId) => {
        return await Chat.findOneAndUpdate({_id: chatId}, {$pull: {participants: uid}}, {new : true}).populate({
            path: "participants",
            select: {_id: 1, username: 1, imageid: 1}
          })
    },
    getGroupChat: async (req, res) => {
        const rooms = await Chat.find({type: "group"})
        res.send(rooms)
    }

  
}