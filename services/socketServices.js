import { io } from "../index.js";

export const socketServices = {
    getOnlineUsers: async (uid) => {
        let sockets = await io.fetchSockets();
        sockets = sockets.filter(({userid}) => userid !== uid)
        return sockets.map((socket) => socket.userid)
    },
    getUsersByRoom: async (room) => {
        const socketList = await io.in(room).fetchSockets();
        return socketList.map(({username, userid}) => {return {username, userid}})
    },
    getSocketByUserid: async (userid) => {
        const socketList = await io.fetchSockets();
        const selectedSocket = socketList.filter((socket) => socket.userid.toString() === userid)
        return selectedSocket[0]
    },
}

