import jwt from "jsonwebtoken";
import { jwtConfig } from "../serverConfig.js";

const authServices = {
    createAccessToken: (user) => {
        return jwt.sign({id: user.id, username: user.username, imageid: user.imageid, roles: user.roles }, jwtConfig.accessSecretkey, {
            algorithm: "HS256",
            expiresIn: jwtConfig.accesshJwtExpire
         });
    },
    createRefreshToken: (user) => {
        return jwt.sign({id: user.id, username: user.username, roles: user.roles }, jwtConfig.refreshSecretkey, {
            algorithm: "HS256",
            expiresIn: jwtConfig.refreshJwtExpire
         });
    },
    createVerifyToken: (uid) => {
        return jwt.sign({ uid: uid }, jwtConfig.verifySecretkey, {
            algorithm: "HS256",
            expiresIn: jwtConfig.verifyJwtExpire
         });
    }
}

export default authServices



