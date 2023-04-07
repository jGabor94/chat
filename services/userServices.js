import bcrypt from "bcrypt";
import { validationErrors } from "./utils.js"; 
import { User, Role, VerifyToken } from "../models/models.js"
import nodemailer from "nodemailer"
import authServices from "./authServices.js";
import { serverConfig } from "../serverConfig.js";


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'barcafanx@gmail.com',
      pass: 'ugymojkvddaxqdpg'
    }
  });

const userServices = {
    createUser: async (userdata) => {
        const errorMessages = []

        const existUsername = await User.findOne({username: userdata.username})
        existUsername && errorMessages.push({field: "username", msg: "felhasználónév már létezik"})
        const existEmail = await User.findOne({email: userdata.email}).lean()
        existEmail && errorMessages.push({field: "email", msg: "E-mail cím már létezik"})
      
        if(!existUsername && !existEmail){
            const createdUser = await User.create({
                username: userdata.username,
                password: bcrypt.hashSync(userdata.password, 10),
                email: userdata.email,
                roles: ["user", userdata.username]
            })
            const createdRole = await Role.create({
              name: userdata.username,
              crud: {
                create: false,
                read: true,
                update: true,
                delete: true
              }
            })

            const result = await transporter.sendMail({
                from: 'barcafanx@gmail.com',
                to: 'jakucs.gabor94@gmail.com',
                subject: 'Regisztráció megerősítése',
                html: `
                Az alábbi linkre kattintva igazolhatod a registzrációt.
                Ha a regisztrációt nem te kezdeményezted, hagyd figyelmen kívül ezt az üzenetet.
                <a href='http://${serverConfig.hostname}:3000/verify/${authServices.createVerifyToken(createdUser._id)}'>Regisztráció megerőstése</a>
                `
              });

            
            return {
                success: true,
                createdUser: createdUser,
                createdRole: createdRole
            }

        }else{
            throw new validationErrors(errorMessages)
        }
    },
    userValidate: async (username, password) => {
        const user = await User.findOne({username: username})
        if(!user || !bcrypt.compareSync(password, user.password)){
            throw new validationErrors([{msg: "Hibás felhasználónév vagy jelszó"}])
        }else if(!user.active){
            throw new validationErrors([{msg: "A felhasználó nincs aktiválva"}])
        }else{
            return user
        }
    },
    getUserDetails: async (userId, cfg) => {
        if(cfg.populated){
            return await User.findOne({_id: userId}).populate("saved").populate("own")
        }else{
            return await User.findOne({_id: userId})
        }  
    },
    verify: async (uid) => {
        const user = await User.findOne({_id: uid})
        if(user.active) throw new validationErrors(["Ez a felhasználó már aktiválva van"])
        user.active = true
        return await user.save()
    }
}

export default userServices