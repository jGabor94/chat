import jwt_decode from "jwt-decode"

const useTokenServices = () => {




    const decodedToken = () => {
        let token = getAccessToken()
        if(token){
            return jwt_decode(token)
        }else{
            return false
        }
    }



    const getAccessToken = () => {
        return localStorage.getItem("accessToken")
    }

    const setAccessToken = (token) => {
        localStorage.setItem("accessToken", token)
    }

    const deleteAccessToken = () => {
        localStorage.removeItem("accessToken")
    }   

    return {decodedToken, getAccessToken, setAccessToken, deleteAccessToken}
}

export default useTokenServices