import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import CircularProgress from "@mui/material/CircularProgress";
import HomeContainer from "./elements/HomeContainer";

const EmailVerifiyPage = () => {

    const { token } = useParams()

    const navigate = useNavigate()


    useEffect(() => {
        
        axios.get(`/user//verify/${token}`)
        .then(() => {
            navigate("/", { state: {success: true, msg: "Sikeres ativálás"} })
        })
        .catch(() => {
            navigate("/", { state: {success: false, msg: "Sikertelen ativálás"} })
        })
        
    }, [])


    return (
        <HomeContainer>
            <CircularProgress sx={{width: "100px", height: "100px", color: "white"}}/>
        </HomeContainer>
   )
}

export default EmailVerifiyPage