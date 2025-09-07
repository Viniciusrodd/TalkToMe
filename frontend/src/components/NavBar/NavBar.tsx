
// css
import styles from './NavBar.module.css';


// navbar
const NavBar = () => {
    return (
        <div className={ styles.navbar_container }>
            <div>
                <img src='../../../images/favicon.png' alt="Hello ilustration" />
                <h1>Hey, talk to me ?</h1>
            </div>
        </div>
    );
};

export default NavBar;