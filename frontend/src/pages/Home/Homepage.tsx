
// css
import styles from './Homepage.module.css';

// components
import NavBar from '../../components/NavBar/NavBar';
import SideBar from '../../components/SideBar/SideBar';
import Modal from '../../components/Modal/Modal';

// hooks
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyToken } from '../../hooks/useVerifyToken'; // custom hook

// service
import { get_user_data } from '../../services/getUserService';

// context
import { UserContext } from '../../context/UserContext';
import { ConversationContext } from '../../context/ConversationContext';


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
    const [ messageValue, setMesageValue ] = useState<string>('');
    const [ showSendIcon, setShowSendIcon ] = useState<boolean>(false);
    const [ loginRedirect, setLoginRedirect ] = useState<boolean>(false);
    const [ clearMessage ] = useState<boolean>(false);
    const [ file, setFile ] = useState<File | null>(null);
    const [ userMessage, setUserMessage ] = useState<string[]>([]);


    // consts
    const navigate = useNavigate();
    const { userName, setUserName, userId, setUserId } = useContext(UserContext);
    const { conversation, setConversation } = useContext(ConversationContext);
    const conversationContainerRef = useRef<HTMLDivElement>(null);


    // modal
    const [ modal_display, setModal_display ] = useState<boolean>(false);
    const [ modal_title, setModal_title ] = useState<string>('');
    const [ modal_msg, setModal_msg ] = useState<string>('');
    const [ modal_btt, setmodal_btt ] = useState<boolean | string>(false);
    const [ modal_btt_2, setModal_btt_2 ] = useState<boolean | string>(false);


    // functions


    // get user data + udpate user contexts
    useEffect(() =>{
        if(userName === '' && userId === ''){ 
            const getUser = async () =>{
                try{
                    const res = await get_user_data();
                    if(res.status === 200){
                        // set context
                        setUserId(res.data.data?.id || '');
                        setUserName(res.data.data?.name || '');
                    }
                }
                catch(error){
                    console.log(error);
                }
            };
            getUser();
        }
    }, [userName, setUserName, userId, setUserId]);
    

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
        if(modal_btt_2 !== false || modal_btt !== false){
            modal_config({
                title: '', msg: '', btt1: false, 
                btt2: false, display: false
            });
        }
    };

    // send message icone
    useEffect(() =>{
        setShowSendIcon(messageValue.trim() !== '');
    }, [messageValue]);

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
                btt1: 'Continuar', btt2: false, display: true
            });
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

    // upload file
    const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) =>{
        if(e.target.files && e.target.files.length > 0){
            setFile(e.target.files[0]);
        }
    };
    useEffect(() =>{
        if(file !== null) console.log(file)
    }, [file]);

    // send message
    const send_message = () =>{
        if(messageValue === ''){
            modal_config({
                title: 'Wait ❗', msg: 'Please, ask something...', btt1: false, 
                btt2: 'Write a message', display: true
            });
        }

        // start conversation
        setConversation(true);

        // set message
        setUserMessage([...userMessage, messageValue]);

        // clear message
        setMesageValue('');
        console.log('message send: ', messageValue);
    };

    // clear on conversation desactive
    useEffect(() =>{
        if(conversation === false){
            setMesageValue('');
            setFile(null);
        }
    }, [ conversation ]);

    // chat automatic scroll
    useEffect(() =>{
        if(conversationContainerRef){
            conversationContainerRef.current?.scrollTo({
                top: conversationContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [ userMessage ]);


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
                modalEvent={ closeModal }
            />

            { /* homepage + sidebar container */ }
            <div className={ styles.home_container }>
                { /* sidebar */ }
                <SideBar />

                { /* homepage */ }
                <div className={ styles.homepage }>
                    {
                        conversation ? (
                            <div className={ styles.coversation_container } ref={ conversationContainerRef }>
                                { userMessage && userMessage.map((msg) => (
                                    <>
                                    <p className={ styles.user_name }>
                                        { `<${userName}>` }
                                    </p>
                                    <div className={ styles.user_message_container }>
                                        <p>
                                            { msg }
                                        </p>
                                    </div>
                                
                                    <p className={ styles.llm_name }>
                                        { `<IA>` }
                                    </p>
                                    <div className={ styles.llm_message_container }>
                                        <p>llm message</p>
                                    </div>
                                    </>
                                )) }
                            </div>                            
                        ) : (
                            <h1>What can I help with ?</h1>
                        )
                    }

                    <div className={ 
                        conversation 
                        ? ` ${styles.interect_container} ${styles.interect_container_in_conversation} `
                        : styles.interect_container
                    }>
                        <input title='file' type="file" name="add_file" id='add_file' className={ styles.file_input } 
                        onChange={ uploadFile } accept=".txt,.csv,.json,.xml,.pdf,.docx,.pptx,.xlsx,.md,.py,.js,.html,.css,.sql,.eml"/>
                        <button type='button' className={ styles.utils }>
                            <label htmlFor="add_file">
                                <span className="material-symbols-outlined">add</span>
                            </label>
                        </button>

                        { /* question input */ }
                        <input type="text" name="question" placeholder='Ask anithing...' value={ messageValue } 
                        onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setMesageValue(e.target.value) }/>


                        { showSendIcon ? (
                            <button onClick={ send_message } type='button' className={ styles.utils }>
                                <span className={`material-symbols-outlined ${styles.is_send}`}>
                                    send
                                </span>
                            </button>
                        ) : (
                            <button type='button' className={ styles.utils }>
                                <span className="material-symbols-outlined">mic</span>
                            </button>
                        ) }
                    </div>

                    {
                        file && file !== null && (
                            <div className={ styles.file_div }>
                                <img src="../../../images/util_images/file.png" alt="" />
                                <p>{ file.name }</p>
                                <span onClick={ () => setFile(null) } className="material-symbols-outlined">
                                    delete
                                </span>
                            </div>
                        ) 
                    }
                </div>
            </div>
        </div>
    );
};

export default Homepage;