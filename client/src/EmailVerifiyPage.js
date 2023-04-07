import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import LoadingItem from "./elements/LoadingItem"
import styles from './styles/verifyEmailPage.module.css';

const EmailVerifiyPage = () => {

    const { token } = useParams()
    const [success, setSuccess] = useState(false)
    const [message, setMessage] = useState("")
    const [isFetchPending, setFetchPending] = useState(true)


    useEffect(() => {
        axios.get(`/user//verify/${token}`)
        .then((res) => {
            setMessage("Aktiválás sikeres")
            setFetchPending(false)
            setSuccess(true)
        })
        .catch((err) => {
            setMessage(err.response.data.errorMsg[0])
            setFetchPending(false)
        })
    }, [])


    return (<div>{isFetchPending ? (
        <LoadingItem />
    ) :(
        <div className={styles.container}>
            <div className={styles.message}>{message}</div>
            {success ? (
                <img src="/success.png" />
            ) : (
                <img src="/icons/failedIcon.png" />
            )}
            
        </div>
    )}
   
    </div>)
}

export default EmailVerifiyPage