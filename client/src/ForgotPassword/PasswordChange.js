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
import { useNavigate, useParams } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress"

const errorMessages = {
    password: "a jelszónak minimum 8 karakterből kell állnia, tartalmaznia kell kis és nagy betűt valamint számot",
    confirmPassword: "a megerőstő jelszó nem egyezik",
}

const PasswordChange = () => { 

    const [isFetchPending, setFetchPending] = useState(false)

    const navigate = useNavigate()
    const { token } = useParams()

    const validation = (values) => {
        const errors = {}
        const cfg = {
            minLength: 8, 
            minLowercase: 1, 
            minUppercase: 1, 
            returnScore: false, 
            minNumbers: 1, 
            minSymbols: 0, 
            pointsPerUnique: 0, 
            pointsPerRepeat: 0, 
            pointsForContainingLower: 0, 
            pointsForContainingUpper: 0, 
            pointsForContainingNumber: 0, 
            pointsForContainingSymbol: 0
        }

        if (!validator.isStrongPassword(values.password, cfg)) errors.password = errorMessages.password
        if (values.confirmPassword !== values.password) errors.confirmPassword = errorMessages.confirmPassword
        return errors
    }

    const submit = (values, actions) => {
        setFetchPending(true)
        axios.put(`/user/password/change/${token}`, {...values})
        .then(() => {
            navigate("/", { state: {success: true, msg: "Sikeres jelszó módosítás"} })
        })
        .catch((err) => {
            console.log(err)
            if(err.response.status === 400 || 409){
                err.response.data.forEach(({field, msg}) => {
                    actions.setFieldError(field, msg)
                })
            }
            setFetchPending(false)
            actions.setSubmitting(false)
        })
      
    }

    return (
        <HomeContainer>
            <HomeButton />
            {isFetchPending && <LinearProgress sx={{width: "100%", position: "fixed", top: 0}} />}
            <Formik initialErrors={errorMessages} initialValues={{ password: '', confirmPassword: ''}} onSubmit={submit} validate={validation}>
            {({values, handleSubmit, handleChange, handleBlur, errors, touched }) => (
                <Stack gap={2} component="form" onSubmit={handleSubmit} sx={{maxWidth: "90%"}}>
                    <Typography fontSize={15} fontWeight={500} color="white">Új jelszó megadása:</Typography>
                    <Stack gap={1} sx={{width: '300px', maxWidth: "90%"}} gap={2}>
                        <HomeTextInput type="password" size="small" id="password" label="jelszó"  value={values.email} onChange={handleChange} onBlur={handleBlur} error={errors.password && touched.password ? true : false} helperText={errors.password} />
                        <HomeTextInput type="password" size="small" id="confirmPassword" label="Megerősítő jelszó"  value={values.email} onChange={handleChange} onBlur={handleBlur} error={errors.confirmPassword && touched.confirmPassword  ? true : false} helperText={touched.confirmPassword && errors.confirmPassword} />
                        <Button variant="contained" type="submit" sx={{width: "fit-content", alignSelf: "end"}}>Küldés</Button>
                    </Stack>
                </Stack>
            )}
            </Formik>
        </HomeContainer>
    )
}

export default PasswordChange