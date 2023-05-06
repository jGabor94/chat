import chatController from "../controllers/chatControllers.js";
import express from "express";
import middlewares from "../middlewares/middlewares.js";


const chatRouter = express.Router();

chatRouter.get('/', middlewares.accessTokenVerify, chatController.getOwnChat)
chatRouter.get('/groupChat', chatController.getGroupChat)
chatRouter.post('/new', middlewares.accessTokenVerify, middlewares.getSocket, chatController.new)
chatRouter.post('/message', middlewares.accessTokenVerify, middlewares.getSocket, chatController.message)
chatRouter.put('/close', middlewares.accessTokenVerify, middlewares.getSocket, chatController.close)
chatRouter.get('/online', middlewares.accessTokenVerify, chatController.getOnline)
chatRouter.get('/:id', middlewares.accessTokenVerify, middlewares.getSocket, chatController.getById)

export default chatRouter