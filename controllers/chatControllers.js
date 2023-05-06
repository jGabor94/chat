import { socketServices } from "../services/socketServices.js"
import { chatServices } from "../services/chatServices.js"
import { io } from "../index.js";
import { Chat } from "../models/models.js";


const chatController = {
    message: async (req, res) => {  
        const createdMsg = await chatServices.createMessage(req.userdata.id, 0, req.body.message, req.body.chatId)
        req.socket.to(req.body.chatId).emit('message', createdMsg, req.body.chatId)
        res.end()
    },
    getById: async (req, res) => {  
        const {chat, newParticipant, createdMsg} = await chatServices.getChatById(req.userdata, req.params.id)
            if(newParticipant){
                req.socket.join(chat._id)
                io.in(chat._id.toString()).emit('message', createdMsg, chat._id) 
                io.in(chat._id.toString()).emit('update participants', chat.participants, chat._id)
                res.send({chat, new: true})
            }else{
                res.send({chat, new: false})
            }    
    },
    new: async (req, res) => {  
        if(req.userdata.id !== req.body.userid){
            let pmChat = await chatServices.getPrivateChat(req.userdata.id, req.body.userid)
            if(!pmChat){
                pmChat = await chatServices.createPrivateChat(req.userdata, req.body.username, req.body.userid)
                const anotherSocket = await socketServices.getSocketByUserid(req.body.userid)
                req.socket.join(pmChat._id)
                anotherSocket && anotherSocket.join(pmChat._id)
                io.to(req.body.userid).emit("newPm", pmChat)
                res.send({chat: pmChat, new: true})
            }else{
                res.send({chat: pmChat, new: false})
            }
        }else{
            res.sendStatus(409)
        }     
    },
    close: async (req, res) => {
        req.socket.leave(req.body.chatId)
        const chat = await chatServices.removeParticipant(req.userdata.id, req.body.chatId)
        const createdMsg = await chatServices.createMessage(req.userdata.id, 1, req.userdata.username + " elhagyta a szobát", req.body.chatId)
        req.socket.to(req.body.chatId).emit('message', createdMsg, req.body.chatId)
        req.socket.to(req.body.chatId).emit('update participants', chat.participants, req.body.chatId)
        res.end()
    },
    getOnline: async (req, res) => {
        const onlineUsers = await socketServices.getOnlineUsers(req.userdata.id)
        res.send(onlineUsers)
    },
    getGroupChat: async (req, res) => {
        const rooms = await Chat.find({type: "group"})
        res.send(rooms)
    },
    getOwnChat: async (req, res) => {
        let chats = await chatServices.getChatList(req.userdata.id)
        res.send(chats)
    }
}

export default chatController