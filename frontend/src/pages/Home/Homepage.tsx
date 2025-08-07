
// css
import styles from './Homepage.module.css';

// components
import NavBar from '../../components/NavBar/NavBar';
import SideBar from '../../components/SideBar/SideBar';

// hooks
import React, { useState, useEffect } from 'react';


// homepage
const Homepage = () => {
    // states
    const [ isTyping, setIsTyping ] = useState<string>('');
    const [ showSendIcon, setShowSendIcon ] = useState<boolean>(false);


    // functions

    // send message icone
    useEffect(() =>{
        setShowSendIcon(isTyping.trim() !== '');
    }, [isTyping]);


    // jsx


    return (
        <div className="general_container">
            { /* navbar */ }
            <NavBar />

            { /* homepage + sidebar container */ }
            <div className={ styles.home_container }>
                { /* sidebar */ }
                <SideBar />

                { /* homepage */ }
                <div className={ styles.homepage }>
                    <h1>What can I help with ?</h1>
                    <div className={ styles.interect_container }>
                        <div className={ styles.utils }>
                            <span className="material-symbols-outlined">add</span>
                        </div>

                        <input type="text" name="question" placeholder='Ask anithing...' value={ isTyping } 
                        onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setIsTyping(e.target.value) }/>


                        <div className={ styles.utils }>
                            { showSendIcon ? (
                                <span className={`material-symbols-outlined ${styles.is_send}`}>send</span>
                            ) : (
                                <span className="material-symbols-outlined">mic</span>
                            ) }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homepage;