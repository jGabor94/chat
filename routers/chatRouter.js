import chatController from "../controllers/chatControllers.js";
import express from "express";
import middlewares from "../middlewares/middlewares.js";


const chatRouter = express.Router();

chatRouter.get('/', middlewares.accessTokenVerify, chatController.getOwnChat)
chatRouter.get('/groupChat', chatController.getGroupChat)
chatRouter.post('/new', middlewares.accessTokenVerify, chatController.new)
chatRouter.post('/message', middlewares.accessTokenVerify, chatController.message)
chatRouter.put('/close', middlewares.accessTokenVerify, chatController.close)
chatRouter.get('/online', middlewares.accessTokenVerify, chatController.getOnline)
chatRouter.get('/:id', middlewares.accessTokenVerify, chatController.getById)

export default chatRouter