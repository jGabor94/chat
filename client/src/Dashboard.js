import { useState } from 'react';
import Box from '@mui/system/Box';
import { styled } from '@mui/material/styles';
import Stack from '@mui/system/Stack';
import Typography from '@mui/material/Typography';
import ChatIcon from '@mui/icons-material/Chat';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from "react-router-dom";
import useLoginServices from './customHooks/useLoginServices';
import HomeContainer from './elements/HomeContainer';



const Card = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "50px",
    cursor: "pointer",
    '& .MuiSvgIcon-root': {
        color: "white",
        width: "150px",
        height: "150px",
        [theme.breakpoints.down('sm')]: {
            width: "100px",
            height: "100px",
        }
    },
    '& .MuiTypography-root': {
        color: "white",
        fontSize: "25px",

    },
    '&:hover': {
        backdropFilter: 'blur(500px)'
    }
}))

const Dashboard = () => {

    const navigate = useNavigate()
    const { logout } = useLoginServices()

    return (
        <HomeContainer>
            <Card onClick={() => navigate("/chatApp")}>
                <ChatIcon />
                <Typography>ChatApp</Typography>
            </Card>
            <Card onClick={() => navigate("/profile")}>
                <PersonIcon />
                <Typography>Profil</Typography>
            </Card>
            <Card onClick={() => logout()}>
                <LogoutIcon />
                <Typography>Kilépés</Typography>
            </Card>
        </HomeContainer>
    )
}

export default Dashboard