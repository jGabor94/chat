import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';

const ModalBox = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)', 
    width: "30%", 
    backgroundColor: "#414141"
}))


const ResultTitle = styled(Typography)(({ theme }) => ({
    ...theme.typography.h4,
    paddingLeft: "10px",
    fontWeight: 600,
    color: "#E1E1E1"

}))

const NotFound = styled(Typography)(({ theme }) => ({
    ...theme.typography.h6,
    paddingLeft: "10px",
    color: "#E1E1E1"

}))

const SearchModal = ({ activeSearchModal, setActiveSearchModal, newPrivateChat, findedValue }) => {

    const handleNewChat = (_id, username) => {
        setActiveSearchModal(false)
        newPrivateChat(_id, username)
    }

    return (
        <Dialog open={activeSearchModal} onClose={() => setActiveSearchModal(false)}>
         <DialogTitle>Találatok:</DialogTitle>
            {(findedValue.length > 0) ? (
                <List sx={{width: "100%"}}>
                {findedValue.map((user, index) => (
                <ListItem key={index} sx={{display: "flex",}}>
                <ListItemAvatar>
                    <Avatar alt={user.username.charAt(0)} src={`/images/${user.imageid}`} />
                </ListItemAvatar>
                <ListItemText primary={user.username} />
                <Button variant="contained" color="success" onClick={() => handleNewChat(user._id, user.username)} sx={{marginLeft: "50px"}}>
                        Csevegés
                    </Button>
                </ListItem>
                ))}
                </List>
            ) : (
            <NotFound>Nincs találat</NotFound>
            )}
        </Dialog>
    )
}

export default SearchModal