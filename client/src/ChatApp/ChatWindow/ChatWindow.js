import { styled } from '@mui/material/styles';
import SpeakerNotesOffIcon from '@mui/icons-material/SpeakerNotesOff';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import _ from 'lodash';
import Box from '@mui/material/Box';
import MessageBox from './Components/MessageBox';
import MessageImputBox from './Components/MessageImputBox';
import ChatTitleBox from './Components/ChatTitleBox';
import { Fragment } from 'react';
import ChatAppBar from '../ChatAppBar';


const ChatContainer = ({children}) => (<Box sx={{
    display: "flex",
    flexDirection: "column",
    height: "100vh",

}}>{children}</Box>)

const StatusContainer = styled(Box)(({ theme }) => ({
     
    height: '100%',
    display: "flex", 
    gap: '10px', 
    alignItems: "center", 
    justifyContent: "center",
    flexGrow: 1
}))

const ChatWindow = ({ chatInstance }) => {


    

    return (
        <ChatContainer>
            <ChatAppBar chatInstance={chatInstance} />
        {chatInstance.isFetchPending ? (
        
            <StatusContainer>
                <CircularProgress />
            </StatusContainer>
        ) : !_.isEmpty(chatInstance.chat) ? (
            <Fragment>       
                <ChatTitleBox chatInstance={chatInstance} />
                <MessageBox messages={chatInstance.chat.messages} />
                <MessageImputBox chatInstance={chatInstance} />
            </Fragment> 
            ) : (

                <StatusContainer>
                    <SpeakerNotesOffIcon /> 
                    <Typography>Nincs kiválasztott csevegés</Typography>
                </StatusContainer>  
            )}
            </ChatContainer>
    )
}

export default ChatWindow