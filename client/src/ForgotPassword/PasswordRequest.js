import HomeContainer from "../elements/HomeContainer"
import HomeButton from "../elements/HomeButton"
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import HomeTextInput from "../elements/HomeTextInput"
import Button from "@mui/material/Button"
import { Formik } from 'formik';
import validator from 'validator';
import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress"

const PasswordRequest = () => { 

    const [isFetchPending, setFetchPending] = useState(false)

    const navigate = useNavigate()

    const validation = (values) => {
        const errors = {}
        if (!validator.isEmail(values.email)) errors.email = "helytelen formátumban adtad meg az E-mail címed"
        return errors
    }

    const submit = (values, actions) => {
        setFetchPending(true)
        axios.put("/user/password/request", {email: values.email})
        .then(() => {
            navigate("/success", { state: { email: values.email, text: "A jelszó helyreállító linket elküldtük a következő email címre:", title: ""} })
            actions.setSubmitting(false)
            setFetchPending(false)
        })
        .catch((err) => {
            console.log(err)
            if(err.response.status === 400 || 409){
                err.response.data.forEach(({field, msg}) => {
                    actions.setFieldError(field, msg)
                })
            }
            actions.setSubmitting(false)
            setFetchPending(false)    
        })
    
      
    }

    return (
        <HomeContainer>
            <HomeButton />
            {isFetchPending && <LinearProgress sx={{width: "100%", position: "fixed", top: 0}} />}
            <Formik initialValues={{ email: ''}} onSubmit={submit} validate={validation} validateOnChange={false} validateOnBlur={false}>
            {({values, handleSubmit, handleChange, errors }) => (
                <Stack gap={2} component="form" onSubmit={handleSubmit} sx={{maxWidth: "90%",}}>
                    <Typography fontSize={15} fontWeight={500} color="white">Add meg az E-mail címed, hogy elküldjük a linket az új jelszó beállításához:</Typography>
                    <Stack gap={1}>
                        <HomeTextInput size="small" id="email" label="E-mail cím"  value={values.email} onChange={handleChange} error={errors.email ? true : false} helperText={errors.email} />
                        <Button variant="contained" type="submit" sx={{width: "fit-content", alignSelf: "end"}}>Küldés</Button>
                    </Stack>
                </Stack>
            )}
            </Formik>
        
            
        </HomeContainer>
    )
}

export default PasswordRequest