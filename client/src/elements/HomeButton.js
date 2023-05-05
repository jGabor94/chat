import Fab from '@mui/material/Fab';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from "react-router-dom";

const HomeButton = () => {

    const navigate = useNavigate()

    return (
        <Fab color="primary" aria-label="Home" onClick={() => navigate("/")} sx={{position: "fixed", top: "16px", left: "16px"}}>
                    <HomeIcon />
                    </Fab>
    )
}

export default HomeButton