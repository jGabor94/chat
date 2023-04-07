import express from "express";
import { getAccessTokenController } from "../controllers/authControllers.js";
import middlewares from "../middlewares/middlewares.js";

const authRouter = express.Router();

authRouter.get("/accessToken", middlewares.refreshTokenVerify, getAccessTokenController)

authRouter.get("/userverify", middlewares.refreshTokenVerify, (req, res) => {
    res.send(req.userdata)
})

export default authRouter