import { useEffect, useState } from 'react';
import useChat from '../customHooks/useChat';
import _ from 'lodash';
import ChatSelector from './ChatSelector/ChatSelector';
import ChatMenu from './ChatMenu/ChatMenu';
import Box from "@mui/material/Box";
import ChatWindow from './ChatWindow/ChatWindow';
import { CssBaseline } from '@mui/material';
import useSound from 'use-sound';

const Chat = () => {

    
    
    //chat usage based on login state
    const chatInstance = useChat()

    return (
        <CssBaseline>
        <Box sx={{display: "grid",  gridTemplateColumns: {xs: "auto", md: "270px auto 270px"}, height: "100vh", width: "100vw"}}>
            <Box sx={{display: { xs: "none", md: "flex" }, width: "270px", height: "100vh", flexDirection: "column"}}>
                <ChatSelector chatInstance={chatInstance} />
            </Box>
            <Box sx={{minWidth: 0}}>
                <ChatWindow chatInstance={chatInstance} />
            </Box>
            <Box sx={{display: { xs: "none", md: "block" }, padding: "5px", width: "270px",}}>
                <ChatMenu chatInstance={chatInstance} />
            </Box>
        </Box>
        </CssBaseline>
    )
}

export default Chat