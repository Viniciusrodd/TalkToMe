
// css
import styles from './Homepage.module.css';

// components
import NavBar from '../../components/NavBar/NavBar';
import SideBar from '../../components/SideBar/SideBar';
import Modal from '../../components/Modal/Modal';

// hooks
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyToken } from '../../hooks/useVerifyToken'; // custom hook

// context
import { UserContext } from '../../context/UserContext';


// homepage
const Homepage = () => {
    // interfaces
    interface IModalConfig {
        title: string;
        msg: string;
        btt1: boolean | string;
        btt2: boolean | string;
        display: boolean;
    };


    // states
    const [ isTyping, setIsTyping ] = useState<string>('');
    const [ showSendIcon, setShowSendIcon ] = useState<boolean>(false);
    const [ loginRedirect, setLoginRedirect ] = useState<boolean>(false);
    const [ clearMessage, setClearMessage ] = useState<boolean>(false);


    // consts
    const navigate = useNavigate();
    const { userName } = useContext(UserContext);


    // modal
    const [ modal_display, setModal_display ] = useState<boolean>(false);
    const [ modal_title, setModal_title ] = useState<string>('');
    const [ modal_msg, setModal_msg ] = useState<string>('');
    const [ modal_btt, setmodal_btt ] = useState<boolean | string>(false);
    const [ modal_btt_2, setModal_btt_2 ] = useState<boolean | string>(false);


    // functions


    // modal config
    const modal_config = ({ title, msg, btt1, btt2, display }: IModalConfig) => {
        setModal_title(title ?? '');
        setModal_msg(msg ?? '');
        setmodal_btt(btt1 ?? false);
        setModal_btt_2(btt2 ?? false);
        setModal_display(display ?? false);

        // The "??" (nullish coalescing operator) 
        // returns the value on the right ONLY if the value on the left is null or undefined
    };    
    
    // close modal
    const closeModal = () =>{
        if(modal_btt_2 !== false){
            modal_config({
                title: '', msg: '', btt1: false, 
                btt2: false, display: false
            });
        }
    };

    // send message icone
    useEffect(() =>{
        setShowSendIcon(isTyping.trim() !== '');
    }, [isTyping]);

    // login redirect + clear message
    useEffect(() =>{
        if(loginRedirect){
            const timeout = setTimeout(() => {
                modal_config({
                    title: '', msg: '', btt1: false, 
                    btt2: false, display: false
                });  

                navigate('/login');
            }, 3000);

            return () =>{
                clearTimeout(timeout);
            };
        }

        if(clearMessage){
            const timeout = setTimeout(() => {
                modal_config({
                    title: '', msg: '', btt1: false, 
                    btt2: false, display: false
                });  
            }, 3000);

            return () =>{
                clearTimeout(timeout);
            };
        }
    }, [loginRedirect, clearMessage]);

    // verify token
    const { status, errorRes } = verifyToken();
    useEffect(() =>{
        if(status === 'ok' && userName !== ''){
            modal_config({
                title: 'Success ✅', msg: `Hello <${ userName }> 👋, \nWelcome to the best LLm's ever`, 
                btt1: false, btt2: false, display: true
            });

            // clear message
            setClearMessage(true);
        }
        if(errorRes){
            console.log('Error at verify token at homepage: ', errorRes);
            modal_config({
                title: 'Error ❗', msg: 'Necessary Login to continue', btt1: false, 
                btt2: false, display: true
            });

            // redirect to login
            setLoginRedirect(true);
        }
    }, [status, errorRes]);


    // jsx


    return (
        <div className="general_container">
            { /* navbar */ }
            <NavBar />

            { /* modal */ }
            <Modal 
                title={ modal_title }
                msg={ modal_msg }
                btt1={ modal_btt }
                btt2={ modal_btt_2 }
                display={ modal_display }
                onClose={ closeModal }
            />

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