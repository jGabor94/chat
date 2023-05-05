import { useEffect, useState, Fragment } from 'react';
import { styled } from '@mui/material/styles';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import axios from 'axios';

const RoomsModal = ({ activeRoomsModal, setActiveRoomsModal, handleRoomChange }) => {

    const [groupChats, setGroupChats] = useState([])
    
    const handleClick = (id) => {
        setActiveRoomsModal(false)
        handleRoomChange(id)
    }

    useEffect(() => {
        axios.get("/chat/groupChat").then(({data}) => {
            setGroupChats(data)
        })
    }, [])

    return (
        <Dialog onClose={() => setActiveRoomsModal(false)} open={activeRoomsModal} >
            <DialogTitle>Szobák:</DialogTitle> 
            <List >
            {groupChats.map((room, index) => (
            <Fragment key={index}>
                <ListItem sx={{display: "flex", justifyContent: "space-between", gap: "50px"}}>
                <ListItemText primary={room.name} />
                <Button size="small" variant="contained" color="success" onClick={() => handleClick(room._id)}>
                        Csatlakozás
                    </Button>
                </ListItem>
                <Divider />
            </Fragment>
            ))}
            </List>         
        </Dialog>
    )
}

export default RoomsModal