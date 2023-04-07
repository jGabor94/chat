export const formatChat = (chat, userid) => {
    if(chat.type === "private"){
        chat.name = (chat.participants[0]._id === userid) ? chat.participants[1].username : chat.participants[0].username
    }
    return chat
}

export const sortChat = (chat) => {
    chat.sort((a, b) => {
        return new Date(b.lastMessage) - new Date(a.lastMessage)
    })
    return chat
}

export const isExistChat = (chats, chat) => {
    chats.forEach((room) => {
        if (room._id === chat._id) return true
    })
    return false
}

export const addVisitor = (chat, userid) => {
    !chat.visitors.includes(userid) && chat.visitors.push(userid)
    return chat.visitors
}

export const removeVisitor = (chat, userid) => {
    const set = new Set(chat.visitors)
    set.delete(userid)
    return [...set]
}

export const removeChat = (chats, chat) => {
    return chats.filter((room) => room._id !== chat._id)
}

export const updateLastMessage = (chats, chat) => {
     chats.map((room) => {
        if(room._id === chat._id) room.lastMessage = new Date().toISOString()
    })
    return chats
}

