import { useState, useEffect } from "react"
import useLoginServices from "./useLoginServices"
import useFetchAuth from './useFetchAuth';
import axios from "axios";
import { io } from "socket.io-client";
import {sortChat, formatChat, isExistChat, addVisitor, removeVisitor, removeChat, updateLastMessage} from "../helpers";

export const socket = io("", {
    autoConnect: false
  });

const useChat = () => {
    const [online, setOnline] = useState(new Set())
    const [chat, setChat] = useState(false)
    const [rooms, setRooms] = useState([])

    const [allUsers, setAllUsers] = useState([])
    const [allRooms, setAllRooms] = useState([])


    const { loginState } = useLoginServices()
    const fetchAuth = useFetchAuth()

    const sendMessage = (message) => {
        socket.emit("message", message, chat._id )
        setChat((state) => {
            state.messages.unshift({type: 0, message, user: {username: loginState.username}})
            return {...state}
        })
        setRooms((state) => [...sortChat(updateLastMessage(state, chat))])
    }
    

    const leaveRoom = () => {
        socket.emit("closeChat", chat._id)
        setRooms((state) => [...removeChat(state, chat)])
        setChat("")
    }

    const newPrivateChat = (userid, username) => {
        socket.emit("newPrivateChat", userid, username, chat._id)
    }

    const newGroupChat = (id) => {
        if(!chat || (chat._id !== id)) socket.emit("newGroupChat", id, chat._id)
    }

    
const handleRoomChange = (roomId) => {
    if(!chat || (chat._id !== roomId))  socket.emit("joinChat", roomId)  
}

    

    useEffect(() => {
        
        socket.connect()

        

        socket.on("getOnlineUsers", (onlineUsers) => setOnline(new Set(onlineUsers)))



    socket.on("message", (msgObject, chatId) => {
        setChat((currentChat) => {
            if(chatId === currentChat._id) currentChat.messages.unshift(msgObject)

            setRooms((state) => {
                state.map((room) => {
                    if(room._id === chatId){
                        room.lastMessage = new Date().toISOString()      
                        if(room._id !== currentChat._id){
                            room.visitors = removeVisitor(room, loginState.id)
                        }
                    } 
                })
                return [...sortChat(state)]
            })
            return {...currentChat}
        })
    })

    socket.on("reciveChat", (chat) => {
        setChat(chat)
        setRooms((state) => {
            state.map((room) => {
                if(chat._id === room._id) {
                    room.visitors = addVisitor(room, loginState.id)
                }
            })
            return [...state]
        })  
    })

    socket.on("joinUser", (participants, chatId) => {
        setChat((room) => {
            if(room._id === chatId){
                room.participants = participants
            } 
            return {...room}
        })
    })

    socket.on("leaveUser", (participants, chatId) => {
        setChat((room) => {
            if(room._id === chatId){
                room.participants = participants
            } 
            return {...room}
        })
    })

    socket.on("newPm", (pm) => {
        setRooms((state) => {
            !isExistChat(state, pm) && state.push(formatChat(pm, loginState.id))
            return [...sortChat(state)]
        })
    })

    socket.on("newGroupChat", (chat) => {
        setRooms((state) => {
            !isExistChat(state, chat) && state.push(formatChat(chat, loginState.id))
            return [...sortChat(state)]
        })
    })

    socket.on("goOffline", (userid) => {
        const set = new Set(online)
        online.delete(userid)
        setOnline(set)
    })

    socket.on("goOnline", (userid) => {
        const set = new Set(online)
        set.add(userid)
        setOnline(set)
    })

        fetchAuth.get("/mychats").then(({data}) => {
            data.map((chat) => formatChat(chat, loginState.id))
            setRooms(data)
            socket.emit("getOnlineUsers")
        })

        fetchAuth.get("/allusers").then(({data}) => setAllUsers(data))
        axios.get("/allrooms").then(({data}) => setAllRooms(data))
        
        return () => {socket.disconnect()}

    }, [])

    useEffect(() => console.log(chat), [chat])
    useEffect(() => console.log(rooms), [rooms])



    return {online, 
        setOnline, 
        chat, 
        setChat, 
        rooms, 
        setRooms, 
        allUsers, 
        setAllUsers, 
        allRooms, 
        setAllRooms,
        leaveRoom,
        newPrivateChat,
        newGroupChat,
        handleRoomChange,
        sendMessage
    }
}

export default useChat