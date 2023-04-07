import express from "express";
import { signupController, loginController, logoutController, getUserDataController, getFullUserDataController, verifyEmailController } from "../controllers/userController.js";
import middlewares from "../middlewares/middlewares.js";

const userRouter = express.Router();

userRouter.get("/", middlewares.accessTokenVerify, getUserDataController)
userRouter.get("/full", middlewares.accessTokenVerify, getFullUserDataController)
userRouter.post("/signin", loginController)
userRouter.get('/signout', logoutController)
userRouter.post('/signup', middlewares.signupFormValidation, signupController)
userRouter.get('/verify/:token', middlewares.verifyTokenVerify, verifyEmailController)


export default userRouter
