import express from "express";
import { serverConfig } from './serverConfig.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import cookieParser from "cookie-parser"
import userRouter from './routers/userRouter.js';
import authRouter from './routers/authRouter.js';
import { Chat, User, getId } from "./models/models.js";
import { chatServices } from "./services/chatServices.js";
import middlewares from "./middlewares/middlewares.js";
import socketController from "./controllers/socketControllers.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildPath = path.join(__dirname, 'client', 'build')
const publicPath = path.join(__dirname, 'public')
const app = express();

const httpServer = createServer(app);
export const io = new Server(httpServer, { cors: { origin: '*' } });

app.use(express.json());

app.use(express.static(buildPath))
app.use(express.static(publicPath))
app.use(cookieParser());

app.use('/user', userRouter)
app.use('/auth', authRouter)

io.use(middlewares.socketAuth)
io.use(middlewares.socketInit)



io.on('connection', async (socket) => {
    console.log(socket.username + " csatlakozik")
    
    socket.on("getOnlineUsers", socketController.getOnlineUsers.bind(null, socket))
    socket.on('closeChat', socketController.closeChat.bind(null, socket))
    socket.on('joinChat', socketController.joinChat.bind(null, socket))
    socket.on("newPrivateChat", socketController.newPrivateChat.bind(null, socket))
    socket.on("newGroupChat", socketController.newGroupChat.bind(null, socket))
    socket.on('message', socketController.message.bind(null, socket))
    socket.on("disconnecting", socketController.disconnecting.bind(null, socket))
})



app.get('/mychats', middlewares.accessTokenVerify, async (req, res) => {
    let chats = await chatServices.getChatList(req.userdata.id)
    res.send(chats)
})

app.get('/allusers', middlewares.accessTokenVerify, async (req, res) => {
    const users = await User.find({_id: {$ne: req.userdata.id}})
    res.send(users)
})

app.get('/allrooms', async (req, res) => {
    const rooms = await Chat.find({type: "group"})
    res.send(rooms)
})

app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'))
})



httpServer.listen(serverConfig.port)