import axios from "axios"
import useTokenServices from "./useTokenServices"
import { AuthContext } from "../App";
import {useContext} from 'react';

const useFetchAuth = () => {

    const {loginState, setLoginState} = useContext(AuthContext)

    const instance = axios.create()
    const tokenServices = useTokenServices()

    instance.interceptors.request.use(
    (config) => {

        if(!tokenServices.getAccessToken()){
            return config
        }else{
            return {...config,
                headers: {...config.headers, 'Authorization': 'Bearer ' + tokenServices.getAccessToken()}
            }
        }
    },

    (error) => Promise.reject(error)

    )


    instance.interceptors.response.use(
        (res) => res,
        async (err) => {

            const originalrequest = err.config

            if (originalrequest.isRetry){
                
                return Promise.reject(err)
            }

            if (err.response.status !== 401){
                return Promise.reject(err)
            }

            originalrequest.isRetry = true

            
            
            return axios.get("/auth/accessToken", {withCredentials: true})
            .then((res) => tokenServices.setAccessToken(res.data.accessToken))
            .catch(() => {
              tokenServices.deleteAccessToken()
              setLoginState({isLogged: false})
            })
            .then(() => instance(originalrequest))
            }
          )

    

      

    return instance


}

export default useFetchAuth