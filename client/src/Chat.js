import { useEffect, useState } from 'react';
import useLoginServices from './customHooks/useLoginServices';
import ChatWindow from './ChatWindow';
import styles from './styles/Chat.module.css';
import useChat from './customHooks/useChat';



const Chat = () => {

    const chatInstance = useChat()
    
    const [listType, setListType] = useState("private")
    const { logout, loginState } = useLoginServices()


    const handleChangeList = (type) => {
        setListType(type)
    }


    return (
        <div className={styles.container}>
            <div className={styles.leftSide}>
                <div className={styles.privateLabel} onClick={() => handleChangeList("private")}>
                    <span>private</span>
                </div>
                <div className={styles.groupLabel} onClick={() => handleChangeList("group")}>
                <span>group</span>
                </div>
                <div className={styles.list}>
                    <ul>
                        {chatInstance.rooms?.map(({ name, _id, participants, type, visitors}, key) => 
                            (listType === type) && (
                                <li key={key} onClick={() => chatInstance.handleRoomChange(_id)} className={`${!visitors.includes(loginState.id) && styles.unVisited}`}>
                                    {name} 
                                    {(type === "private") && ((chatInstance.online.has(participants[0]._id) || chatInstance.online.has(participants[1]._id)) ? "(online)" : "(offline)")}
                                    </li>
                            )
                            
                        )}
                    </ul>
                </div>
            
                
            </div>

            <div>
                <h1>{chatInstance.chat.name}</h1>
                {(chatInstance.chat && chatInstance.chat.type === "group") && (
                    <span onClick={chatInstance.leaveRoom}>Szoba elhagyása</span>
                )}
                
                <ChatWindow sendMessage={chatInstance.sendMessage}  messages={chatInstance.chat.messages} disabled={chatInstance.chat ? false : true}  />
            </div>

            <div>
            <h2>Szoba tagok:</h2>
                <ul>
                    {chatInstance.chat.participants?.map(({_id, username}, key) => (
                        <li key={key} onClick={() => chatInstance.newPrivateChat(_id, username)}>{username}</li>
                    ))}
                </ul>
                <h2>Összes felhasználó:</h2>
                <ul>
                    {chatInstance.allUsers.map(({username, _id}, key) => (
                        <li key={key} onClick={() => chatInstance.newPrivateChat(_id, username)}>{username}</li>
                    ))}
                </ul>
                <h2>Összes szoba:</h2>
                <ul>
                    {chatInstance.allRooms.map(({name, _id}, key) => (
                        <li key={key} onClick={() => chatInstance.newGroupChat(_id)}>{name}</li>
                    ))}
                </ul>
                
                <span onClick={logout}>Kilépés</span>
            </div>
            


        
            
            
            
        </div>
    )
}

export default Chat