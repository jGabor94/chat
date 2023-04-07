import styles from './styles/LoginComponent.module.css';
import { useState } from 'react';
import { useNavigate } from "react-router-dom"
import TextInput from './elements/TextInput';
import LoadingItem from './elements/LoadingItem';
import Button from './elements/Button';
import useLoginServices from './customHooks/useLoginServices';
import Alert from './elements/Alert';
import useControlledForm from './customHooks/useControlledForm';
import { NavLink } from "react-router-dom"


function LoginComponent () {

    const { login } = useLoginServices()
    const [isFetchPending, setFetchPending] = useState(false);
    const navigate = useNavigate()

    const form = useControlledForm({
        initState: {
            schema: {
                username: "",
                password: ""
            }},
        onSubmit: (e, values) => {
            e.preventDefault()
            setFetchPending(true)
            return login(values).catch(({response}) => {
                setFetchPending(false)
                throw response.data.errorMsg
            })
        },
        validation: (values) => {
            const errors = {};
            if(values.username.length < 1) errors.username = true
            if(values.password.length < 1) errors.password = true
            return errors
        }
    })

    const handleClick = () => {
        navigate('/signup')
    }

    return (
            <div className={styles.loginContainer}> 
                <LoadingItem show={isFetchPending} />
                <form onSubmit={form.handleSubmit} className={styles.form}>
                    <div>
                        <span className={styles.title}>Bejelentkezés</span>
                    </div>
                    <Alert errors={form.serverErrorsArray} />
                    <TextInput 
                        label="Felhasználónév" 
                        name="username" 
                        type="text" 
                        value={form.values.username}
                        onChange={form.handleChange} />
                    <TextInput 
                        label="Jelszó" 
                        name="password" 
                        type="password" 
                        value={form.values.password}
                        onChange={form.handleChange} />
                    <NavLink>
                        Elfelejtett jelszó
                    </NavLink>
                    <Button 
                        type="submit" 
                        value="Bejelentkezés" 
                        disabled={!form.isValid || isFetchPending} />
                    <Button 
                        type="button" 
                        value="Regisztráció" 
                        onClick={handleClick} />
                    
                </form>
            </div>
    )
}

export default LoginComponent