import { useState, useEffect } from 'react';
import { useLocation, NavLink } from "react-router-dom"
import Box from '@mui/system/Box';
import { styled } from '@mui/material/styles';
import Stack from '@mui/system/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import { useNavigate } from "react-router-dom";
import useLoginServices from './customHooks/useLoginServices';
import { Formik } from 'formik';


import HomeContainer from './elements/HomeContainer';
import HomeTextInput from './elements/HomeTextInput';

const FormContainer = styled(Stack)(({ theme }) => ({
    alignItems:"center",
}))

const Footer = styled(Stack)(({ theme }) => ({
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing(3),
    position: "absolute", 
    bottom: "0px", 
    boxSizing: "border-box",
    padding: theme.spacing(1),
    flexWrap: "wrap",
    '& .MuiTypography-root': {
        color: "white",
        fontWeight: 500
    }
}))




function LoginComponent () {

    const navigate = useNavigate()
    const { login } = useLoginServices()
    const { state } = useLocation();

    const [isFetchPending, setFetchPending] = useState(false);
    const [serverErrors, setServerErrors] = useState([])
    const [successMessage, setSuccessMessage] = useState("")

    const submit = (values, { setSubmitting, validate }) => {
        setFetchPending(true)
        login(values).catch(({response}) => {
            setFetchPending(false)
            setSubmitting(false)
            setServerErrors(response.data.errorMsg)
        })
    }

    const validation = (values) => {
        const errors = {};
        if(values.username.length < 1) errors.username = true
        if(values.password.length < 1) errors.password = true
        return errors
    }

    useEffect(() => {
        if(state){
            console.log(state)
            state.success === true ? setSuccessMessage(state.msg) : setServerErrors([{msg: state.msg}])
        }
        
    }, [])

    return (
        <HomeContainer gap={2}>
            <Box>
                <Typography fontSize={60} fontWeight={600} color="white">Chat App</Typography>
                <Typography color="white">Alpha</Typography>
            </Box>
                <Formik initialErrors={{ username: true, password: true }} initialValues={{ username: '', password: '' }} onSubmit={submit} validate={validation}>
                {({values, handleSubmit, handleChange, handleBlur, errors}) => (
                    <FormContainer component="form" gap={2} onSubmit={handleSubmit}>
                        {isFetchPending && (<LinearProgress sx={{width: "100%", position: "fixed", top: 0}} />)}
                        {serverErrors.length > 0 && serverErrors.map(({msg}, index) => (
                            <Typography sx={{color: "#FF6464"}} key={index}>{msg}</Typography>
                        ))}
                        {successMessage && (
                             <Typography sx={{color:"#00FF03"}}>{successMessage}</Typography>
                        ) }
                        <HomeTextInput size="small" id="username" label="felhasználónév" variant="outlined" value={values.username} onChange={handleChange}  onBlur={handleBlur} />
                        <HomeTextInput size="small" type="password" id="password" label="jelszó" variant="outlined" value={values.password} onChange={handleChange}  onBlur={handleBlur} />
                        <Stack direction="row" gap={1}>
                            <Button type="submit" variant="contained" disabled={errors.username || errors.password}>Belépés</Button>
                            <Button variant="contained" onClick={() => navigate('/signup')}>Regisztráció</Button>
                        </Stack>
                        
                        <NavLink to="/password-reset/request" style={{color: "white"}}>
                        Elfelejtett jelszó
                        </NavLink>
                       
                    </FormContainer>
                )}
                </Formik>
                <Footer divider={<Divider orientation="vertical" color="white" flexItem />}>
                    <Typography>React</Typography>
                    <Typography>React MUI</Typography>
                    <Typography>Express</Typography>
                    <Typography>Mongo DB</Typography>
                </Footer>
        </HomeContainer>
    )
}

export default LoginComponent

