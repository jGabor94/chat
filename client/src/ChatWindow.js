import styles from './styles/ChatWindow.module.css';
import { useEffect, useState } from 'react';
import useLoginServices from './customHooks/useLoginServices';

const ChatWindow = ({disabled, messages, sendMessage}) => {

    const [message, setMessage] = useState("")
    const { loginState } = useLoginServices()

    const handleChange = (e) => {
        setMessage(e.target.value)
    }

    const handleClick = () => {
        if(message){
            sendMessage(message)
            setMessage("")
        } 
    }

    useEffect(() => {

    }, [])

    return (
        <div className={styles.container}>
            
            <div className={styles.messageWindow}>
            {!disabled && (
                <>
                {messages?.map(({ message, user, type}, key) => (
                    <div className={`${(user.username === loginState.username) ? styles.own : ""} ${(type === 1) ? styles.system : ""}`} key={key}>{user.username}: {message}</div>
                ))}
                </>
                )}
                
            </div>
            <div className={styles.inputWindow}>
                <input type="text" onChange={handleChange} value={message} disabled={disabled ? true : false}></input>
                <button type="button" onClick={handleClick} disabled={disabled ? true : false}>Küdés</button>
            </div>
        </div>
    )
}

export default ChatWindow