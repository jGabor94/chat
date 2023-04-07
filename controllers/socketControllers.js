import { socketServices } from "../services/socketServices.js"
import { chatServices } from "../services/chatServices.js"
import { io } from "../index.js";


const socketController = {
    getOnlineUsers: async (socket) => {
        const onlineUsers = await socketServices.getOnlineUsers(socket)
        socket.emit("getOnlineUsers", onlineUsers)
    },
    closeChat: async (socket, closedRoomId) => {
        socket.leave(closedRoomId)
        const chat = await chatServices.removeParticipant(socket, closedRoomId)
        const createdMsg = await chatServices.createMessage(socket, 1, socket.username + " elhagyta a szobát", closedRoomId)
        socket.to(closedRoomId).emit('message', createdMsg, closedRoomId)
        socket.to(closedRoomId).emit('leaveUser', chat.participants, closedRoomId)
    },
    joinChat: async (socket, targetRoomId) => {
        const {chat} = await chatServices.getChatById(socket, targetRoomId)
        socket.emit("reciveChat", chat._doc)
    },
    newPrivateChat: async (socket, userid, username) => {
        if(socket.userid !== userid){
            let pmChat = await chatServices.getPrivateChat(socket, userid, username)
            if(!pmChat){
                pmChat = await chatServices.createPrivateChat(socket, username, userid)
                const anotherSocket = await socketServices.getSocketByUserid(userid)
                socket.join(pmChat._id)
                anotherSocket && anotherSocket.join(pmChat._id)
                socket.emit("reciveChat", pmChat)
                const createdMsg = await chatServices.createMessage(socket, 1, `${socket.username} és ${username} csatlakozott`, pmChat._id)
                io.in(pmChat._id.toString()).emit('message', createdMsg, pmChat._id)
                io.to(userid).to(socket.id).emit("newPm", pmChat)
            }else{
                socket.emit("reciveChat", pmChat)
            }
        }      
    },
    newGroupChat: async (socket, id) => {
        const {chat, newParticipant} = await chatServices.getChatById(socket, id)
        if(newParticipant){
            socket.join(chat._id)
            const createdMsg = await chatServices.createMessage(socket, 1, socket.username + " csatlakozott", chat._id)
            socket.emit("reciveChat", chat);
            socket.emit("newGroupChat", chat);
            io.in(chat._id.toString()).emit('message', createdMsg, chat._id) 
            io.in(chat._id.toString()).emit('joinUser', chat.participants, chat._id)
        }else{
            socket.emit("reciveChat", chat)
        }
    },
    message: async (socket, message, currentRoomId) => {
        const createdMsg = await chatServices.createMessage(socket, 0, message, currentRoomId)
        socket.to(currentRoomId).emit('message', createdMsg, currentRoomId)
    },
    disconnecting: (socket, reason) => {
        console.log(socket.username + " lecsatlakozik ")
        console.log("Indok: " + reason)
        io.emit("goOffline", socket.userid)
    }
}

export default socketController