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
import chatRouter from "./routers/chatRouter.js";
import middlewares from "./middlewares/middlewares.js";

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
app.use('/chat', chatRouter)

io.use(middlewares.socketAuth)
io.use(middlewares.socketInit)



io.on('connection', async (socket) => {
    console.log(socket.username + " csatlakozik")

    socket.on("disconnecting", (reason) => {
        console.log(socket.username + " lecsatlakozik ")
        console.log("Indok: " + reason)
        io.emit("goOffline", socket.userid)
    })
})


app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'))
})



httpServer.listen(serverConfig.port)