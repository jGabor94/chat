import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import AvatarGroup from '@mui/material/AvatarGroup';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useState } from 'react';

const Title = styled(Typography)(({ theme }) => ({
    ...theme.typography.h4,
    fontWeight: 600
}))

const Header = styled(Stack)(({ theme }) => ({
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.palette.primary.main,
    flexWrap: "wrap",
    background: theme.palette.primary.main, 
    padding: "15px",
}))

const ModalBox = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)', 
    maxWidth: "30%", 
    backgroundColor: "#414141",
    padding: "30px"
}))


const ChatTitleBox = ({ chatInstance }) => {

    const [activeModal, setActiveModal] = useState(false)

    const handleClick = (uid, username) => {
        setActiveModal(false)
        if(chatInstance.chat.type !== "private"){
            chatInstance.newPrivateChat(uid, username)
        }

    }

    return (
        
            <Header gap={2}>
            <Stack direction="row" gap={2}>
                <Avatar alt={chatInstance.chat.name.charAt(0)} src={`/images/${chatInstance.chat.imageid}`} sx={{width: "80px", height: "80px", }} />
                <Stack justifyContent="center">
                    <Title sx={{color: "#F7F7F7"}}>{chatInstance.chat.name}</Title>
                    {(chatInstance.chat.type === "group") && (
                        <Button color="warning" variant="contained" onClick={chatInstance.leaveRoom}>Szoba elhagyása</Button>
                    )}
                </Stack>
            </Stack>
            <AvatarGroup>
                {chatInstance.chat.participants?.map(({_id, username, imageid}, index) => (index < 3) && (
                    <Tooltip key={index} title={username}>
                    <Avatar alt={username.charAt(0)} src={`/images/${imageid}`} sx={{cursor: "pointer"}} onClick={() => handleClick(_id, username)} />
                    </Tooltip>
                    ))}
                    {chatInstance.chat.participants.length > 3 && (
                        <Avatar sx={{cursor: "pointer"}} onClick={() => setActiveModal(true)}>...</Avatar>
                    )}   
            </AvatarGroup>

            
            <Modal open={activeModal} onClose={() => setActiveModal(false)}>
                <ModalBox>
                <Stack direction="row" spacing={3} useFlexGap flexWrap="wrap">
                    
                {chatInstance.chat.participants?.map(({_id, username, imageid}, index) => (
                    <Box key={index} sx={{display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer"}} onClick={() => handleClick(_id, username)}>
                    <Avatar sx={{width: "50px", height: "50px", fontSize: 30}} alt={username.charAt(0)} src={`/images/${imageid}`} />
                    <Typography sx={{color: "white", fontWeight: 600}}>{username}</Typography>
                    </Box>
                    ))}
                </Stack>
                
                </ModalBox>
            </Modal>
            </Header>
    )
}

export default ChatTitleBox