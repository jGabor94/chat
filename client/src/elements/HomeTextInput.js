import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';


const HomeTextInput = styled(TextField)(({ theme }) => ({
    input: {
        color: "white"
    },
    '& .MuiInputLabel-root': {
        color: "white",
    },
    '& label.Mui-focused': {
        color: "white"
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'white',
        },
        '&:hover fieldset': {
          borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
          borderColor: 'white',
        },
    },
    '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
        borderColor: 'yellow'
    },
    '& label.Mui-error': {
        color: 'yellow'
      },
    '& .MuiFormHelperText-root': {
        color: 'yellow'
    },
    '& .MuiFormHelperText-root.Mui-error ': {
        color: 'yellow'
    },
    width: "100%"
}))

export default HomeTextInput