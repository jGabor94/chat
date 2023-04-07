import { checkSchema } from "express-validator";
import { signupValidationSchema } from "./schema.js";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../serverConfig.js";
import utils from "../services/utils.js";
import { Role } from "../models/models.js"
import { User, Chat } from "../models/models.js";
import { socketServices } from "../services/socketServices.js";

const defaultAccessGroups = {
    recipeAdd: ["admin", "user"],
}



const middlewares = {
    accessTokenVerify: (req, res, next) => {
        const authHeader = req.headers.authorization
        const token = authHeader ? authHeader.split(' ')[1] : ""

        try{
            if(token){
            jwt.verify(token, jwtConfig.accessSecretkey, (err, payload) => {
                if(err){
                    res.sendStatus(401)
                }else{
                    req.userdata = payload
                    next()
                }
            })
            }else{
                res.sendStatus(401)
            }
        }catch(err){
            console.log(err)
            res.sendStatus(500)
        }
    },
    refreshTokenVerify: (req, res, next) => {
        const token = req.cookies.refreshToken

        try{
            if(token){
            jwt.verify(token, jwtConfig.refreshSecretkey, (err, payload) => {
                if(err){
                    res.clearCookie('refreshToken');
                    res.sendStatus(401)
                }else{
                    req.userdata = payload
                    next()
                }
            })
            }else{
                res.sendStatus(401)
            }
        }catch(err){
            console.log(err)
            res.sendStatus(500)
        }
    },
    verifyTokenVerify: (req, res, next) => {
        const { token } = req.params

        try{
            if(token){
            jwt.verify(token, jwtConfig.verifySecretkey, (err, payload) => {
                if(err){
                    res.sendStatus(401)
                }else{
                    req.uid = payload.uid
                    next()
                }
            })
            }else{
                res.sendStatus(401)
            }
        }catch(err){
            console.log(err)
            res.sendStatus(500)
        }
    },
    authorization: (action, method) => async (req, res, next) => {
        try{
            let accessGroups = []
            if(req.params.id){
                const recipe = await Recipe.findOne({_id: req.params.id})
                accessGroups = recipe.accessGroups
            }else{
                accessGroups = defaultAccessGroups[method]
            }

            let isValidate = false
            
            const roles = await Role.find({name: req.userdata.roles})
            roles.forEach((role) => {
                if(accessGroups.includes(role.name)){
                    if(role.crud[action]){
                        isValidate = true
                    }
                }
            })

            isValidate ? next() : res.sendStatus(403)

        }catch(err){
            console.log(err)
            res.sendStatus(500)
        }
    },
    signupFormValidation: [
        checkSchema(signupValidationSchema), 
        (req, res, next) => {
        
            try{
                utils.getValidationErrors(req)
                next()
            }catch(err){
                if(err.name === "validationErrors"){ 
                    res.status(400).json(err.messages)   
                }else{
                    console.log(err)
                    res.sendStatus(500)
                }
            }
        }
    ],
    socketAuth: (socket, next) => {
        const token = socket.handshake.headers.cookie?.split("=")[1]
        try{
            if(token){
            jwt.verify(token, jwtConfig.refreshSecretkey, (err, payload) => {
                if(err){
                    next(new Error('Some error'))
                }else{
                    socket.username = payload.username
                    socket.userid = payload.id
                    next()
                }
            })
            }else{
                next(new Error('Authentication error'));
            }
        }catch(err){
            next(new Error('Authentication error'));
        }
    },
    socketInit: async (socket, next) => {
        const originalJoin = socket.join;
        socket.join = function(id, callback) {
            originalJoin.call(socket, id.toString(), callback);
        };

        const chats = await Chat.find({ participants: socket.userid }).populate({
            path: "participants",
            select: {_id: 1, username: 1}
          }).sort( { lastMessage : -1 } ).lean()

        socket.join(socket.userid)
        chats.forEach((chat) => socket.join(chat._id))
        socket.broadcast.emit("goOnline", socket.userid)

        next()
    }
}





export default middlewares




