import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import _ from 'lodash';
import ChatSelector from './ChatSelector/ChatSelector';
import ChatMenu from './ChatMenu/ChatMenu';
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import ChatIcon from "@mui/icons-material/Chat";
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';


const ChatAppBar = ({ chatInstance }) => {


    const [isMenuOpen, setisMenuOpen] = useState({
        menu: false,
        chats: false
      });

    const handleToggleClick = (side, open) => {
        setisMenuOpen((prev) => {
          return { ...prev, [side]: open };
        });
      };

    useEffect(() => setisMenuOpen({menu: false, chats: false}), [chatInstance.isFetchPending])

    return (
        <AppBar position="static" sx={{display: { md: "none"},  backgroundColor: "primary.dark"}}>
        <Toolbar>
            <MenuItem  onClick={() => handleToggleClick("menu", true)}>
                <IconButton>
                    <MenuIcon sx={{color: "white"}} />
                </IconButton>
                <Typography>Menü</Typography>
            </MenuItem>
            <Drawer
                open={isMenuOpen["menu"]}
                onClose={() => handleToggleClick("menu", false)}
                anchor="top"
                sx={{
                display: { xs: "block", md: "none" },
                "& .MuiDrawer-paper": { width: "100%", height: "100%" }
                }}
            >
                <Box sx={{ display: "flex", flexDirection: "column", height: "100vh"}}>
              
                        <ChatMenu chatInstance={chatInstance} />
                  
                    
                    <IconButton onClick={() => handleToggleClick("menu", false)}>
                        <ExpandLessIcon sx={{width: "50px", height: "50px"}} />
                    </IconButton>
                </Box>
            </Drawer> 
            
            <MenuItem onClick={() => handleToggleClick("chats", true)}>
            
                <IconButton>
                    <ChatIcon sx={{color: "white"}} />
                </IconButton>    
                <Badge badgeContent={chatInstance.alertMap.all.number} color="error">      
                <Typography sx={{paddingRight: "10px"}}>Beszélgetések</Typography>
                </Badge> 
            </MenuItem>
      
            <Drawer
                 open={isMenuOpen["chats"]}
                onClose={() => handleToggleClick("chats", false)}
                anchor="top"
                sx={{
                display: { xs: "block", md: "none" },
                "& .MuiDrawer-paper": { width: "100%", height: "100%" }
                }}
            >
                <Box sx={{height: "100vh", display: "flex", flexDirection: "column"}} >
            
                    <ChatSelector chatInstance={chatInstance} />
                    
                 
                    <Box sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                        <IconButton onClick={() => handleToggleClick("chats", false)}>
                            <ExpandLessIcon sx={{width: "50px", height: "50px"}} />
                        </IconButton>
                    </Box>
                    
                </Box>
            </Drawer>
        </Toolbar>
    </AppBar>
    )
}

export default ChatAppBar