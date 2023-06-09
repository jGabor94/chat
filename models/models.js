import { dbConfig } from '../serverConfig.js';
import { mongoose } from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

mongoose.set("strictQuery", false);
mongoose.connect(dbConfig.connectionUrl, { dbName: dbConfig.dbName })
.then(() => console.log('DB connection success'))
.catch(() => console.log('DB connection failed'))




const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    name: {type: String, default: ""},
    age: {type: Number, default: null},
    imageid: {type: String, default: "default"},
    active: {type: Boolean, default: false},
    roles: []
}, { timestamps: true })

const chatSchema = new mongoose.Schema({
    name: String,
    type: {type: String, enum: ['private', 'group']},
    participants: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    visitors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }
}, { timestamps: true })


const messageSchema = new mongoose.Schema({
    type: Number,
    message: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })




messageSchema.virtual('userdata', {
    ref: 'User',
    localField: 'user',
    foreignField: '_id',
    justOne: true
  });
  

const roleSchema = new mongoose.Schema({
    name: {type: String},
    crud: {type: {}, default: {
        create: Boolean,
        read: Boolean,
        edit: Boolean,
        delete: Boolean
    }}
})

/*
messageSchema.pre('populate', function(next) {
    this.userRefId = this.user;
    next();
  });


messageSchema.virtual('originalUserid').get(function(){
    return this.user
})

messageSchema.pre('find', function(next) {
    this.populate('originalUserid');
    next();
  });
*/



messageSchema.set('toObject', { virtuals: true });
messageSchema.set('toJSON', { virtuals: true });


const verifyTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    token: String,
})

chatSchema.methods.addVisitor = function({userid}) {
    !this.visitors.includes(userid) && this.visitors.push(userid)
  };


export const User = mongoose.model('User', userSchema)
export const Chat = mongoose.model('Chat', chatSchema)
export const Message = mongoose.model('Message', messageSchema)


export const Role = mongoose.model('Role', roleSchema)
export const VerifyToken = mongoose.model('VerifyToken', verifyTokenSchema)



export const ObjectIdConverter = mongoose.Types.ObjectId

export function getId(raw){
    try{ return new ObjectId(raw) }
    catch(err){ return ""}
}
