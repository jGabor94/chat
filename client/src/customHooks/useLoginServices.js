import axios from "axios"
import useTokenServices from "./useTokenServices"
import { AuthContext } from "../App";
import {useContext} from 'react';

const useLoginServices = () => {

    const tokenServices = useTokenServices()
    const {loginState, setLoginState} = useContext(AuthContext)

    const login = async (userdata) => {

        return new Promise((resolve, reject) => {
            axios.post("/user/signin", userdata).then((res) => {
                tokenServices.setAccessToken(res.data.accessToken)
                setLoginState({...tokenServices.decodedToken(), isLogged: true})
                resolve() 
            })
            .catch((err) => {
                reject(err)
            })
        })
        
    }

    const logout = async () => {
        return new Promise((resolve) => {
            axios.get("/user/signout", {withCredentials: true}).then(() => {
                tokenServices.deleteAccessToken()
                setLoginState({isLogged: false})
                resolve()
            })
        })
    }
    

    return {login, logout, loginState}


}


export default useLoginServices