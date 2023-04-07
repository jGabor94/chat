import styles from '../styles/elements/LoadingItem.module.css';

function LoadingItem ({ show }) {

    return (
        <div className={styles.container}>
        <div className={`${styles.loading} ${show && styles.loadingShow}`}></div>
        </div>
    )
}

export default LoadingItem