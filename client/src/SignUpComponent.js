import { useState, useEffect } from "react"
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios"
import validator from 'validator';
import HomeContainer from './elements/HomeContainer';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import HomeTextInput from './elements/HomeTextInput';
import { styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Formik } from 'formik';


const FormContainer = styled(Stack)(({ theme }) => ({
    alignItems:"center",
    width: "300px",
    maxWidth: "90%",
    gap: 20
}))

const AgreementInput = styled(FormControlLabel)(({ theme }) => ({
    '& .MuiTypography-root': {
        color: "white",
        fontSize: 15
    },
   
    '& .MuiButtonBase-root': {
        color: "white",
        '&.Mui-checked': {
            color: "white"
        },
    },
}))

const errorMessages = {
    username: "a felhasználónévnek minimum 3 karakterből kell állnia",
    password: "a jelszónak minimum 8 karakterből kell állnia, tartalmaznia kell kis és nagy betűt valamint számot",
    confirmPassword: "a megerőstő jelszó nem egyezik",
    email: "helytelen formátumban adtad meg az E-mail címed"
}


function SignUpComponent () {

    const [previewImage, setPreviewImage] = useState("")
    const [isFetchPending, setFetchPending] = useState(false)

    const navigate = useNavigate()

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
        if (values.username.length < 4) errors.username = errorMessages.username
        if (!validator.isStrongPassword(values.password, cfg)) errors.password = errorMessages.password
        if (values.confirmPassword !== values.password) errors.confirmPassword = errorMessages.confirmPassword
        if (!validator.isEmail(values.email)) errors.email =errorMessages.email
        if (!values.agreement) errors.agreement = true
        return errors
    }

    const submit = (values, actions) => {
        setFetchPending(true)
        const formData = new FormData()

        formData.append('username', values.username)
        formData.append('password', values.password)
        formData.append('confirmPassword', values.confirmPassword)
        formData.append('email', values.email)
        formData.append('agreement', values.agreement)
        formData.append('image', values.image)
        
        axios.post('/user/signup', formData)
        .then(() => {
            setFetchPending(false)
            actions.setSubmitting(false)
            navigate("/success", { state: { email: values.email, text: "A megerősítő linket elküldtük a következő email címre:", title: "Sikeres regisztráció"} })
         })
        .catch((err) => {
            setFetchPending(false)
            actions.setSubmitting(false)
                    
            if(err.response.status === 400 || 409){
                err.response.data.forEach(({field, msg}) => {
                    actions.setFieldError(field, msg)
                })
            }     
        })
    }

    return (
        <HomeContainer direction="column">
            {isFetchPending && <LinearProgress sx={{width: "100%", position: "fixed", top: 0}} />}
            <Formik initialErrors={errorMessages} initialValues={{ username: '', password: '', confirmPassword: '', email: '', image: {}, agreement: false}} onSubmit={submit} validate={validation}>
            {({values, handleSubmit, handleChange, handleBlur, errors, setFieldValue, touched }) => (
                <FormContainer component="form" onSubmit={handleSubmit}>
                    <Typography fontSize={30} fontWeight={600} color="white">Regisztráció</Typography>
                    <HomeTextInput size="small" id="username" label="Felhasználónév" variant="outlined" value={values.username} onChange={handleChange} onBlur={handleBlur} error={errors.username && touched.username ? true : false} helperText={touched.username && errors.username} />
                    <HomeTextInput size="small" type="password" id="password" label="Jelszó" variant="outlined" value={values.password} onChange={handleChange} onBlur={handleBlur} error={errors.password && touched.password ? true : false} helperText={errors.password} />
                    <HomeTextInput size="small" type="password" id="confirmPassword" label="Megerősítő jelszó" variant="outlined" value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur} error={errors.confirmPassword && touched.confirmPassword  ? true : false} helperText={touched.confirmPassword && errors.confirmPassword} />
                    <HomeTextInput size="small" id="email" label="E-mail cím" variant="outlined" value={values.email} onChange={handleChange} onBlur={handleBlur} error={errors.email && touched.email ? true : false} helperText={touched.email && errors.email} />
                    <Avatar src={previewImage} sx={{width: "120px", height: "120px"}}></Avatar>
                    <Stack direction="row" gap={1}>
                        <Button size="small" variant="contained" component="label">
                            Kép feltöltése
                            <PhotoCamera sx={{ml: 1}}/>
                            <input hidden id="image" accept="image/*" multiple type="file" onChange={(e) => {setFieldValue("image", e.target.files[0]); setPreviewImage(URL.createObjectURL(e.target.files[0])) }} />
                        </Button>
                        {previewImage && (
                            <Button color="error" size="small" variant="contained" component="label" onClick={() => {setFieldValue("image", {}); setPreviewImage(false)}} >
                                Törlés
                            </Button>
                        )}
                    </Stack>
                    <Box sx={{width: "100%"}}>
                        <AgreementInput control={<Checkbox checked={values.agreement} onChange={() => setFieldValue("agreement", !values.agreement)} />} label="Elfogadom a felhasználói feltételeket" />
                    </Box>
                    <Stack gap={1} sx={{width: "100%"}} alignItems="center">
                        <Button size="small" variant="contained" type="submit" sx={{width: "100%"}} disabled={Object.keys(errors).length > 0 ? true : false}>Regisztráció</Button>
                        <Typography sx={{color: "white"}}>
                            Már van fiókom, <NavLink to="/" style={{color: "white"}}>belépek</NavLink>
                        </Typography>
                    </Stack>
                </FormContainer>
            )}
            </Formik>
        </HomeContainer>

    )
}

export default SignUpComponent