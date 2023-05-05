import { styled } from '@mui/material/styles';
import Stack from '@mui/system/Stack';

const HomeContainer = styled(Stack)(({ theme }) => ({
    background: "linear-gradient(225deg, rgba(25,118,210,1) 15%, rgba(255,30,186,1) 85%)",
    width: "100%",
    minHeight: "100vh",
    justifyContent:"center",
    alignItems:"center",
    flexWrap: "wrap",
    flexDirection: "row",
}))

export default HomeContainer