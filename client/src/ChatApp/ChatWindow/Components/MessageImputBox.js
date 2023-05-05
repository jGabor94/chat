import Box from "@mui/system/Box"
import { useEffect, useState  } from 'react';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import IconButton from "@mui/material/IconButton";
import { styled } from '@mui/material/styles';


const CustomSendIcon = styled(SendIcon)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main, 
    color: "#fff", 
    padding: '5px', 
    borderRadius: '5px', 
    height: '40px', 
    width: '40px',
}))

const MessageImputBox = ({chatInstance}) => {

    const [message, setMessage] = useState("")

    const handleChange = (e) => {
        setMessage(e.target.value)
    }

    const handleSend = (e) => {
        e.preventDefault()
        if(message){
            chatInstance.sendMessage(message)
            setMessage("")
        } 
    }

    return (
        <Box component="form" onSubmit={handleSend} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: "10px", paddingRight: '25px'}}  noValidate >
            <TextField fullWidth value={message} onChange={handleChange} id="messageInput" variant="outlined" height='30px' color='primary' />
            <IconButton type="submit">
                <CustomSendIcon />
            </IconButton>
        </Box>
    )
}

export default MessageImputBox