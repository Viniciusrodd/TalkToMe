
// css
import styles from './Homepage.module.css';

// components
import NavBar from '../../components/NavBar/NavBar';


// homepage
const Homepage = () => {
    return (
        <div className="general_container">
            { /* navbar */ }
            <NavBar />

            <h1 className={ styles.h1_test }>
                homepage
            </h1>
        </div>
    );
};

export default Homepage;