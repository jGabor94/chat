import { useState, useEffect } from "react"
import useLoginServices from "./useLoginServices"
import useFetchAuth from './useFetchAuth';
import axios from "axios";
import { io } from "socket.io-client";
import {sortChat, formatChat, isExistChat, addVisitor, removeVisitor, removeChat, updateLastMessage} from "../helpers";
import { reduceChat, adMsgToReducedArray, removeFromArray, addArray, updateVisitor } from "../helpers";
import chatAlert from '../audio/chatAlert.mp3';


export const socket = io("", {
    autoConnect: false
  });



const useChat = () => {
    const [online, setOnline] = useState([])
    const [chat, setChat] = useState({})
    const [rooms, setRooms] = useState(false)
    const [isFetchPending, setFetchPending] = useState(false)

    const audio = new Audio(chatAlert)
    audio.volume = 0.4
   
    const [alertMap, setAlertMap] = useState({
        private: {
            rooms: [],
            number: 0
        },
        group: {
            rooms: [],
            number: 0
        },
        all: {
            rooms: [],
            number: 0
        },
    })

    const { loginState } = useLoginServices()
    const fetchAuth = useFetchAuth()

    const sendMessage = (message) => {
        fetchAuth.post("/chat/message", {chatId: chat._id, message: message})
        const msgObject = {type: 0, message, user: {username: loginState.username}, createdAt: new Date().toISOString()}
        setChat((state) => {
            return {...state, messages: adMsgToReducedArray(state.messages, msgObject)}
        })
        setRooms((state) => [...sortChat(updateLastMessage(state, chat, msgObject))])
    }
    

    const leaveRoom = () => {
        fetchAuth.put(`/chat/close`, {chatId: chat._id}).then(() => {
            setRooms((state) => [...removeChat(state, chat)])
            setChat("")
        })
    }

    const newPrivateChat = (userid, username) => {
        setFetchPending(true)
        fetchAuth.post(`/chat/new`, {userid, username}).then(({ data }) => {
            const chat = formatChat(data.chat, loginState.id)
            if(data.new){
                setRooms((state) => {
                    !isExistChat(state, chat) && state.push(chat)
                    return [...sortChat(state)]
                })}else{
                    setRooms(updateVisitor(rooms, chat, loginState.id))
                }
            setChat({...chat, messages: reduceChat(chat.messages)})
            setFetchPending(false)
        })
        .catch((err) => {
            console.log(err)
            setFetchPending(false)
        })
       
    }
    
    const handleRoomChange = (roomId) => {
        if(!chat || (chat._id !== roomId)){
            setFetchPending(true)
            fetchAuth.get(`/chat/${roomId}`).then(({ data }) => {
                const chat = formatChat(data.chat, loginState.id)
                if(data.new){
                    setRooms((state) => {
                        !isExistChat(state, chat) && state.push(chat)
                        return [...sortChat(state)]
                    })
                }else{
                    setRooms(updateVisitor(rooms, chat, loginState.id))
                }
                setChat({...chat, messages: reduceChat(chat.messages)})
                setFetchPending(false) 
            })
            .catch((err) => {
                console.log(err)
                setFetchPending(false)
            })
        }  
    }

    useEffect(() => {
        
        socket.connect()


        socket.on("message", (msgObject, chatId) => {
        
        setChat((currentChat) => {
            if(chatId === currentChat._id){
                currentChat.messages = adMsgToReducedArray(currentChat.messages, msgObject)
            }

            setRooms((state) => {
                state.map((room) => {
                    if(room._id === chatId){
                        room.lastMessage = msgObject
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


    socket.on("update participants", (participants, chatId) => {
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


    socket.on("goOffline", (userid) => setOnline(state => removeFromArray([...state], [userid])))
    socket.on("goOnline", (userid) => setOnline((state) => addArray([...state], userid)))

        fetchAuth.get("/chat").then(({data}) => {
            data.map((chat) => formatChat(chat, loginState.id))
            setRooms(data)
        })

        fetchAuth.get("/chat/online").then(({data}) => {
            setOnline(data)
        })

       
        
    return () => {socket.close()}        

    }, [])

    useEffect(() => {

        if(rooms){
            setAlertMap(state => {
                const newState ={
                    private: rooms.filter(room => room.type === "private" && !room.visitors.includes(loginState.id)), 
                    group: rooms.filter(room => room.type === "group" && !room.visitors.includes(loginState.id))
                }

                if((state.private.length < newState.private.length) || (state.group.length < newState.group.length)){
                    audio.play()
                }
                return {
                    private: {
                        rooms: newState.private,
                        number: newState.private.length
                    },
                    group: {
                        rooms: newState.group,
                        number: newState.group.length
                    },
                    all: {
                        rooms: [...newState.private, ...newState.group],
                        number: newState.private.length + newState.group.length
                    }
                }
            })
           
        }
        
    }, [rooms])

    return {online, 
        setOnline, 
        chat, 
        setChat, 
        rooms, 
        setRooms, 
        leaveRoom,
        newPrivateChat,
        handleRoomChange,
        sendMessage,
        isFetchPending,
        alertMap
    }
}

export default useChat