import styles from './styles/SignUpComponent.module.css';
import TextInput from './elements/TextInput';
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios"
import validator from 'validator';
import LoadingItem from './elements/LoadingItem';
import Button from './elements/Button';
import Alert from './elements/Alert';
import useControlledForm from './customHooks/useControlledForm';

function SignUpComponent () {

    const form = useControlledForm({
        initState: {
            schema: {
                username: "",
                password: "",
                confirmPassword: "",
                email: "",
                agreement: false
            }
        },
        validation: (values) => {
            const errors = {}
            const cfg = {
                minLength: 8, 
                minLowercase: 1, 
                minUppercase: 1, 
                returnScore: false, 
                minNumbers: 1, 
                minSymbols: 0, 
                pointsPerUnique: 0, 
                pointsPerRepeat: 0, 
                pointsForContainingLower: 0, 
                pointsForContainingUpper: 0, 
                pointsForContainingNumber: 0, 
                pointsForContainingSymbol: 0
            }
            if (values.username.length < 4) errors.username = "a felhasználónévnek minimum 3 karakterből kell állnia"
            if (!validator.isStrongPassword(values.password, cfg)) errors.password = "a jelszónak minimum 8 karakterből kell állnia, tartalmaznia kell kis és nagy betűt valamint számot"
            if (values.confirmPassword !== values.password) errors.confirmPassword = "a megerőstő jelszó nem egyezik"
            if (!validator.isEmail(values.email)) errors.email = "helytelen formátumban adtad meg az E-mail címed"
            if (!values.agreement) errors.agreement = true
            return errors
        },
        onSubmit: (e, values) => {
            e.preventDefault()
            setFetchPending(true)
        

                
                const body = {
                    username: values.username,
                    password: values.password,
                    confirmPassword: values.confirmPassword,
                    email: values.email,
                    agreement: values.agreement
                }
        
                return axios.post('/user/signup', body)
                .then(() => {
                    setFetchPending(false)
                    console.log("sikeres regisztráció")
                    navigate("/success", { state: { msg: "Regisztráció sikeres" } })

                })
                .catch((err) => {
                    setFetchPending(false)
                    if(err.response.status === 400 || 409){
                        console.log(err.response.data)
                        throw err.response.data
                    }
                })
            }
    })

    const navigate = useNavigate()
    const [isFetchPending, setFetchPending] = useState(false);

    return (
        
            <div className={styles.signUpContainer}>
                <LoadingItem show={isFetchPending} />
                <form className={styles.form} onSubmit={form.handleSubmit} >
                    <div>
                        <span className={styles.title}>Regisztráció</span>
                    </div>
                    <Alert errors={form.serverErrorsArray} />

                    
                    <TextInput 
                        label="Felhasználónév" 
                        name="username" 
                        iconURL={`icons/profileIcon.png`} 
                        value={form.values.username} 
                        onChange={form.handleChange} 
                        isValid={!form.errors.username ? true : false}
                        invalidMessage={form.errors.username} />
                    <TextInput 
                        label="Jelszó" 
                        name="password"
                        type="password"
                        iconURL={`icons/passwordIcon.png`} 
                        value={form.values.password}
                        onChange={form.handleChange} 
                        isValid={!form.errors.password ? true : false}
                        invalidMessage={form.errors.password} />
                    <TextInput 
                        label="Megerősítő jelszó" 
                        name="confirmPassword" 
                        type="password"
                        iconURL={`icons/passwordIcon.png`} 
                        value={form.values.confirmPassword} 
                        onChange={form.handleChange} 
                        isValid={!form.errors.confirmPassword ? true : false}
                        invalidMessage={form.errors.confirmPassword} />
                    <TextInput 
                        label="E-mail cím" 
                        name="email" 
                        type="text"
                        iconURL={`icons/emailIcon.png`} 
                        value={form.values.email} 
                        onChange={form.handleChange} 
                        isValid={!form.errors.email ? true : false}
                        invalidMessage={form.errors.email} />
                    <div className={styles.checkBoxContainer}>
                        <input type="checkbox" name="agreement" onChange={form.handleChange} value={form.values.agreement}/>
                        <label htmlFor="agreement">Elfogadom a felhasználói feltételeket</label>
                        
                    </div>
                    <Button type="submit" value="Regisztráció" disabled={!form.isValid || isFetchPending} />

                </form>
            </div>
        
    )
}

export default SignUpComponent