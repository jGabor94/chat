export const formatChat = (chat, userid) => {
 
    if(chat.type === "private"){
        chat.partner = (chat.participants[0]._id === userid) ? chat.participants[1] : chat.participants[0]
        chat.name = chat.partner.username
        chat.imageid = chat.imageid ? chat.imageid : chat.partner.imageid
    }

    return chat
}

export const sortChat = chat => chat.sort((a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt))

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

export const updateVisitor = (chatList, targetChat, userid) => {
    return chatList.map((room) => {
        if(targetChat._id === room._id) {
            room.visitors = addVisitor(room, userid)
        }
        return room
    })
}

export const removeVisitor = (chat, userid) => {
    const set = new Set(chat.visitors)
    set.delete(userid)
    return [...set]
}

export const removeChat = (chats, chat) => {
    return chats.filter((room) => room._id !== chat._id)
}

export const updateLastMessage = (chats, chat, msgObject) => {
     chats.map((room) => {
        if(room._id === chat._id) room.lastMessage = msgObject
    })
    return chats
}

export const getUnixTimestamp = (ISO8601Time) => {
    return Math.ceil(Date.parse(ISO8601Time) / 1000)
}





export const getLocalDateTime = (ISO8601Time) => {
    const dateObj = new Date(ISO8601Time);
    const currentDate = new Date()
    if(dateObj.toISOString().slice(0, 10) === currentDate.toISOString().slice(0, 10)){
        return dateObj.toLocaleTimeString('hu-HU', {	
            hour: 'numeric',
            minute: 'numeric'
    })
    }
    else if(getUnixTimestamp(currentDate) - getUnixTimestamp(dateObj) < (60 * 60 *24 * 6)){
        return dateObj.toLocaleDateString('hu-HU', {
            weekday: 'short',
            hour: 'numeric',
            minute: 'numeric'
        })
    }else{
        return dateObj.toLocaleDateString('hu-HU', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        })
    }
 
}

export const getFullLocalDateTime = (ISO8601Time) => {
    const dateObj = new Date(ISO8601Time);
    
    return dateObj.toLocaleDateString('hu-HU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    })
   
 
}

export const removeFromArray = (array, removed) => array.filter((e) => !removed.includes(e))
export const addArray = (array, target, mode = "array") => (!array.includes(target) || (mode === "set")) ? [...array, target] : array
export const reduceChat = messages => messages.reduce((acc, message, index, array) => messageReductor(acc, message, {...array[index-1]}, index), [])

export const adMsgToReducedArray = (reducedMessages, message) => {
    const prev = {...reducedMessages[reducedMessages.length-1][reducedMessages[reducedMessages.length-1].length-1]}
    return messageReductor(reducedMessages, message, prev) 
}

export const messageReductor = (acc, curr, prev, index = false) => {
    if(index !== false && index === 0){
        return [[{type: 2, message: getLocalDateTime(curr.createdAt)}], [curr]]
    }
    else if(((prev.user?._id !== curr.user?._id)  || curr.type === 1) && ((getUnixTimestamp(curr.createdAt) - getUnixTimestamp(prev.createdAt)) > 3600)){
        return [...acc, [{type: 2, message: getLocalDateTime(curr.createdAt)}], [curr]] 
    }else if(((prev.user?._id !== curr.user?._id)  || curr.type === 1)){
        return [...acc, [curr]]
    }else if(((getUnixTimestamp(curr.createdAt) - getUnixTimestamp(prev.createdAt)) > 3600)){
        return [...acc, [{type: 2, message: getLocalDateTime(curr.createdAt)}], [curr]] 
    }else{
        return [...acc.slice(0, acc.length - 1) , [curr, ...acc[acc.length - 1]]]
    }
}


export const sliceLastMessage = (string) => (string.length > 20) ? `${string.substring(0, 20)}...` : string
