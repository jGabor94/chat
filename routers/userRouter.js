import express from "express";
import { signupController, 
    loginController, 
    logoutController, 
    getUserDataController, 
    verifyEmailController, 
    profileModificationController, 
    profileDeleteController, 
    passwordRequestController, 
    passwordChangeController, 
    getUserByQueryController } from "../controllers/userController.js";
import middlewares from "../middlewares/middlewares.js";

const userRouter = express.Router();

userRouter.get("/", middlewares.accessTokenVerify, getUserDataController)
userRouter.get("/profile", middlewares.accessTokenVerify, getUserDataController)
userRouter.post("/signin", loginController)
userRouter.get('/signout', logoutController)
userRouter.post('/signup', middlewares.uploadImage.single('image'), middlewares.signupFormValidation, signupController)
userRouter.get('/verify/:token', middlewares.verifyTokenVerify, verifyEmailController)
userRouter.post('/modification', middlewares.accessTokenVerify, middlewares.uploadImage.single('image'))
userRouter.delete('/delete', middlewares.accessTokenVerify, profileDeleteController)
userRouter.put('/password/request', middlewares.emailValidation, passwordRequestController)
userRouter.put('/password/change/:token', middlewares.passwordValidation, middlewares.verifyTokenVerify, passwordChangeController)
userRouter.get('/:username', middlewares.accessTokenVerify, getUserByQueryController)


export default userRouter
