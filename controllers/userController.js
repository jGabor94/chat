import userServices from "../services/userServices.js";
import authServices from "../services/authServices.js";
import { jwtConfig } from "../serverConfig.js";

export async function loginController(req, res){

    const { username, password } = req.body;

    try{
        const user = await userServices.userValidate(username, password)
        res.cookie(
            "refreshToken", 
            authServices.createRefreshToken(user), 
            {maxAge: jwtConfig.refreshJwtExpire * 1000, httpOnly: true
        })
        res.send({accessToken: authServices.createAccessToken(user)})
    }catch(err){
        if(err.name === "validationErrors"){
            console.log(err)
            res.status(401).send({errorMsg: err.messages})
        }else{
            console.log(err)
            res.sendStatus(500)
        }
    }
}

export function logoutController(req, res){
    res.clearCookie('refreshToken');
    res.send("Logout scuccess")
}


export async function  signupController(req, res){
    try{
        await userServices.createUser(req.body)
        res.sendStatus(200)
    }catch(err){
        if(err.name === "validationErrors"){
            res.status(409).send(err.messages)
          }else{
            console.log(err)
            res.sendStatus(500)
          }
        
    }
}

export async function getFullUserDataController(req, res){
    try{
        const userdetails = await userServices.getUserDetails(req.userdata.id, {populated: true})
        res.send(userdetails)
    }catch(err){
        console.log(err)
        res.sendStatus(500) 
    }
}

export async function getUserDataController(req, res){
    try{
        const userdetails = await userServices.getUserDetails(req.userdata.id, {populated: false})
        res.send(userdetails)
    }catch(err){
        console.log(err)
        res.sendStatus(500) 
    }
}



export async function verifyEmailController(req, res){
    try{
        await userServices.verify(req.uid)
        res.sendStatus(200)
    }catch(err){
        console.log(err)
        if(err.name === "validationErrors"){
            res.status(401).send({errorMsg: err.messages})
        }else{
            res.sendStatus(500) 
        }
       
    }
}