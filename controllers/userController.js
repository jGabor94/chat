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



export async function getUserDataController(req, res){
    try{
        const userdetails = await userServices.getUserDetails(req.userdata.id)
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

export async function profileModificationController(req, res){
    try{
        console.log(req.body)
        console.log(req.file)
        console.log("AAAAAAA")
        await userServices.modification({...req.body, image: req.file}, req.userdata.id)
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


export async function profileDeleteController(req, res){
    try{
        await userServices.delete(req.userdata.id)
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

export async function passwordRequestController(req, res){
    try{
        
        await userServices.passwordRequest(req.body.email)
        res.sendStatus(200)
    }catch(err){
        console.log(err)
        if(err.name === "validationErrors"){
            res.status(409).send(err.messages)
        }else{
            res.sendStatus(500) 
        }
       
    }
}

export async function passwordChangeController(req, res){
    try{
        await userServices.passwordChange(req.body.password, req.uid)
        res.sendStatus(200)
    }catch(err){
        console.log(err)
        res.sendStatus(500) 
    }
}

export async function getUserByQueryController(req, res) {
    try{
        const users = await userServices.getUserByQuery(req.params.username)
        res.send(users)
    }catch(err){
        console.log(err)
        res.sendStatus(500) 
    }

}