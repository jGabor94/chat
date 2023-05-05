import MessageSlice from "./MessageSlice"
import Box from "@mui/system/Box"
import { styled } from '@mui/material/styles';
import List from '@mui/material/List';

const MessageContainer = styled(Box)(({ theme }) => ({
    overflowY: "auto",
    overflowX: "hidden",
    padding: "20px 5px 20px 5px",
    display: "flex",
    flexFlow: "column-reverse",
    flexGrow: 1
}))

const CustomList = styled(List)(({ theme }) => ({
    display: "flex",
    flexFlow: "column-reverse",
    marginBottom: '10px'
}))




const MessageBox = ({messages}) => {

    return (
        
        <MessageContainer> 
            {[...messages].reverse().map((slice, index) =>
            <CustomList key={index}>
                <MessageSlice slice={slice} /> 
            </CustomList>
            )}
       </MessageContainer>
    )
}

export default MessageBox