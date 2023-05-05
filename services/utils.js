import { promises as fs } from 'fs';
import { validationResult } from "express-validator"
import { ObjectIdConverter } from '../models/models.js';
import nodemailer from "nodemailer"

export class validationErrors {
    constructor(messages) {
      this.name = "validationErrors";
      this.messages = messages;
    }
}




const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'barcafanx@gmail.com',
      pass: 'ugymojkvddaxqdpg'
    }
  });

const utils = {
    getValidationErrors: (req, formatter) => {

        const customValidationResult = validationResult.withDefaults({
            formatter: error => {
                return formatter ? formatter : {msg: error.msg, field: error.param}
            },
          });

        const errorObject = customValidationResult(req)
        let errors = errorObject.array()
        req.fileValidationError && errors.push({msg: req.fileValidationError})
        errors = errors.filter((v,i,a)=>a.findIndex(v2=>(v2.msg===v.msg))===i)
        if(errors.length > 0) throw new validationErrors(errors)
    },
    deleteRecipeImage: async (imageid) => {
        try{
            return await fs.unlink(`public/images/${imageid}`)
        }catch(err){
            return err
        }
         
    },
    sendMailAsync: function (mailOptions) {
        return new Promise((res, rej) => {
            transporter.sendMail({...mailOptions, from: 'barcafanx@gmail.com',}, function(error, info){
                if (error) {
                    console.log(error);
                    rej(error)
                } else {
                    console.log('Az e-mail sikeresen elküldve: ' + info.response);
                    res(info.response)
                }
            });
        })},
    getObjectId: (raw) => {
        try{ return ObjectIdConverter(raw) }
        catch(err){ return ""}
    },
}

export default utils