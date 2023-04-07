import styles from '../styles/elements/SubmitButton.module.css';

const Button = (props) => {

    return (
        <input className={styles.submit} {...props} />
    )
}

export default Button