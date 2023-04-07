import authServices from "../services/authServices.js";


export async function getAccessTokenController(req, res){
    try{
        res.send({accessToken: authServices.createAccessToken(req.userdata)})
    }catch(err) {
        console.log(err)
        res.sendStatus(401)
    }
}




