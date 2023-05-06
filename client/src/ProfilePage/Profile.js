import { useEffect, useState } from 'react';
import useFetchAuth from '../customHooks/useFetchAuth';
import HomeContainer from "../elements/HomeContainer"
import Avatar from '@mui/material/Avatar';
import VerifyDialog from './Components/VerifyDialog';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { Formik } from 'formik';
import { useNavigate } from "react-router-dom";
import Stack from '@mui/material/Stack';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import useLoginServices from '../customHooks/useLoginServices';
import Paper from '@mui/material/Paper';
import HomeButton from '../elements/HomeButton';
import { getFullLocalDateTime } from '../helpers';




const ProfileContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    width: "600px",
    maxWidth: "90%",
    alignItems: "center",
    gap: 10
}))

const Title = styled(Typography)(({ theme }) => ({
    fontWeight: 600
}))

const CustomPaper = styled(Paper)(({ theme }) => ({
    display: "flex", 
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    padding: "10px",
    width: "100%"
}))




const Profile = () => {

    const [userdata, setUserData] = useState({})
    const [isFetchPending, setFetchPending] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [previewImage, setPreviewImage] = useState("")

    const fetchAuth = useFetchAuth()
    const navigate = useNavigate()
    const { logout } = useLoginServices()

    useEffect(() => {
        userdata.imageid && setPreviewImage(`/images/${userdata.imageid}`)
    }, [userdata])

    useEffect(() => {
        fetchAuth.get("/user/profile").then((res) => {
            setUserData(res.data)
            
            console.log(res.data)
            setFetchPending(false)
        })
        
    }, [])

 

    const submit = (values, actions) => {
        setFetchPending(true)
        const formData = new FormData()

        formData.append('image', values.image)
        !previewImage && formData.append('imageid', "")
        formData.append('name', values.name)
        formData.append('age', values.age == null ? "" : values.age)

        
        
        fetchAuth.post('/user/modification', formData)
        .then(() => {
            navigate(0)
         })
        .catch((err) => {
            console.log(err)
            actions.setSubmitting(false)
        })
    }

    const handleDialogOpen = () => setDialogOpen(true)
    const handleDialogClose = () => setDialogOpen(false)

    const handleProfileDelete = () => {
        setFetchPending(true)
        fetchAuth.delete('/user/delete')
        .then(() => {
            setFetchPending(false)
            logout()
        })
        .catch(() => {
            setFetchPending(false)
        })
    }

    return (
        <HomeContainer>
            {isFetchPending ? (<CircularProgress sx={{color: "white"}}/>) : (
                <Formik initialValues={{ name: userdata.name, age: userdata.age ? userdata.age : "", image: ""}} onSubmit={submit}>
                {({values, handleSubmit, handleChange, setFieldValue }) => (
                <ProfileContainer component="form" onSubmit={handleSubmit}>
                    <Stack direction="row" flexWrap="wrap-reverse" gap={3}>
                        <Stack gap={1} alignItems="center" sx={{width: {xs: "100%", md: "auto"}}}>
                            <Avatar src={previewImage} sx={{width: "200px", height: "200px"}}/>
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
                        </Stack>
                        <Stack justifyContent="center" alignItems="center" sx={{width: {xs: "100%", md: "auto"}}}>
                            <Typography fontWeight={600} color="white" fontSize={40}>{userdata.username}</Typography>
                            <Typography color="white" fontSize={10}>Csatlakozás: {getFullLocalDateTime(userdata.createdAt)}</Typography>
                        </Stack>
                    </Stack>
                    
                    
                    <CustomPaper>
                            <Title>Felhasználónév:</Title>
                            <TextField size="small" id="email" value={userdata.username} disabled={true} />
                    </CustomPaper>
                    <CustomPaper>
                            <Title>E-mail:</Title>
                            <TextField size="small" onChange={handleChange} id="email" value={userdata.email} disabled={true} />
                    </CustomPaper>
                    <CustomPaper>   
                            <Title>Név:</Title>
                            <TextField size="small" onChange={handleChange} id="name" value={values.name}/>
                    </CustomPaper>
                    <CustomPaper>
                            <Title>Kor:</Title>
                            <TextField size="small" onChange={handleChange} id="age" value={values.age}/>
                    </CustomPaper>           
                    <Button variant="contained" color="error" sx={{width: "100%"}} onClick={handleDialogOpen}>Fiók törlése</Button>
                    <Button variant="contained" type="submit">Módosítások elküldése</Button>
                    <HomeButton />
                </ProfileContainer>
                )}
                </Formik>
                
                
            )}
            <VerifyDialog dialogOpen={dialogOpen} handleDialogClose={handleDialogClose} handleProfileDelete={handleProfileDelete} />
            
        </HomeContainer>
    )
}

export default Profile