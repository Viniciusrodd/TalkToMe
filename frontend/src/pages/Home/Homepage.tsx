
// css
import styles from './Homepage.module.css';

// components
import NavBar from '../../components/NavBar/NavBar';
import SideBar from '../../components/SideBar/SideBar';


// homepage
const Homepage = () => {
    return (
        <div className="general_container">
            { /* navbar */ }
            <NavBar />

            { /* homepage */ }
            <div className={ styles.home_container }>
                { /* sidebar */ }
                <SideBar />

                <h1 className={ styles.h1_test }>
                    homepage
                </h1>                
            </div>
        </div>
    );
};

export default Homepage;