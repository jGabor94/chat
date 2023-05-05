import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';


const VerifyDialog = ({dialogOpen, handleDialogClose, handleProfileDelete}) => {

    return (
        <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
               <DialogTitle id="alert-dialog-title">
          {"Biztos vagy benne hogy véglegesen megszűnteted a fiókod?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleDialogClose}>Nem</Button>
          <Button onClick={handleProfileDelete}>Igen</Button>
        </DialogActions>
      </Dialog>
    )
}

export default VerifyDialog