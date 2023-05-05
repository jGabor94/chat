import { useLocation } from "react-router-dom";
import HomeContainer from "./elements/HomeContainer";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { styled } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";

const CustomButton = styled(Button)(({ theme }) => ({
    backgroundColor: "#00C902",
    '&:hover': {
        backgroundColor: "#00AB02"
    }

}))

function SuccessPage(){

    const { state: { email, text, title } = {} } = useLocation();
    const navigate = useNavigate()

    return (
        <HomeContainer>
            <Stack alignItems="center" sx={{padding: "10px"}} gap={1}> 
            <CheckCircleOutlineIcon sx={{color: "#00C902", width: "70px", height: "70px"}} />
            <Typography variant="h3" fontWeight={500} sx={{color: "white"}}>{title}</Typography>
            <Stack direction="row" gap={1} flexWrap="wrap" justifyContent="center">
                <Typography sx={{color: "white", textAlign: "center"}}>{text}</Typography>
                <Typography sx={{color: "white", textDecoration: 'underline'}} fontWeight={600} >{email}</Typography>
            </Stack>
            <CustomButton variant="contained"onClick={() => navigate("/")} >Föoldal</CustomButton>
            </Stack>
            
        </HomeContainer>
    )
}

export default SuccessPage