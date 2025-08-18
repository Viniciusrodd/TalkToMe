
// css
import styles from './Homepage.module.css';

// components
import NavBar from '../../components/NavBar/NavBar';
import SideBar from '../../components/SideBar/SideBar';
import Modal from '../../components/Modal/Modal';

// hooks
import React, { useState, useEffect, useContext, useRef, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyToken } from '../../hooks/useVerifyToken'; // custom hook

// service
import { get_user_data } from '../../services/getUserService';
import { chat_interaction } from '../../services/ChatService';

// context
import { UserContext } from '../../context/UserContext';
import { ConversationContext } from '../../context/ConversationContext';
import { LoadingContext } from '../../context/LoadingContext';


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

    // messages
    interface Message{
        messageId?: string;
        sender: string;
        content: string;
    };


    // states
    const [ messageValue, setMesageValue ] = useState<string>('');
    const [ showSendIcon, setShowSendIcon ] = useState<boolean>(false);
    const [ loginRedirect, setLoginRedirect ] = useState<boolean>(false);
    const [ clearMessage ] = useState<boolean>(false);
    const [ file, setFile ] = useState<File | null>(null);
    const [ titleChat, setTitleChat ] = useState<string>('');
    const [ messages, setMessages ] = useState<Message[]>([]);
    const [ conversationId, setConversationId ] = useState<string | null>(null);


    // consts
    const navigate = useNavigate();
    const { userName, setUserName, userId, setUserId } = useContext(UserContext);
    const { conversation, setConversation, conversationHistoric } = useContext(ConversationContext);
    const conversationContainerRef = useRef<HTMLDivElement>(null);
    const { loading, setLoading } = useContext(LoadingContext);


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
        if(modal_btt_2 !== false || modal_btt !== false){
            modal_config({
                title: '', msg: '', btt1: false, 
                btt2: false, display: false
            });
        }
    };

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
    
    // get historic conversation id
    useEffect(() =>{
        if(conversationHistoric.length > 0){
            setConversationId(conversationHistoric[0].conversationId);
            setTitleChat(conversationHistoric[0].title);
            setMessages(conversationHistoric[0].messages);
        }
    }, [ conversationHistoric ]);    

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
    /*useEffect(() =>{
        if(file !== null) console.log(file)
    }, [file]);*/

    // read file function
    const readFileContent = (file: File): Promise<string> =>{
        return new Promise((resolve, reject) =>{
            const reader = new FileReader();

            reader.onload = (event) =>{
                if(event.target?.result){
                    resolve(event.target.result.toString());
                }else{
                    reject(new Error('Failed to read file'));
                }
            };

            reader.onerror = (error) =>{
                reject(error);
            };

            // read file as (text) or (64base) for binaries
            if(file.type.match('text.*') || ['.txt', '.csv', '.json', '.xml', '.md', '.py', '.js', '.html', '.css', '.sql'].some(ext => file.name.endsWith(ext))){
                reader.readAsText(file);
            }else{
                reader.readAsDataURL(file); // for binaries files like PDF, DOCX, ...
            }
        })
    };

    // send message
    const send_message = async () =>{
        if(messageValue.trim() === ''){
            modal_config({
                title: 'Wait ❗', msg: 'Please, ask something...', btt1: false, 
                btt2: 'Write a message', display: true
            });
            return;
        }

        // start conversation
        setConversation(true);

        // set message
        setMessages(prev => [...prev, { sender: 'user', content: messageValue }]);

        try{
            setLoading(true);            
        
            // set file
            let fileContent = null;
            if(file){
                fileContent = await readFileContent(file);
            }            

            // message data
            const data = {
                text: messageValue,
                userId,
                sender: 'user',
                conversationId,
                file: file ? {
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    content: fileContent
                } : null
            };
            
            const res = await chat_interaction(data);
            setLoading(false);
            
            if(res.status === 200){
                // set current conversation id
                if(!conversationId && res.data.data?.conversationId){
                    setConversationId(res.data.data?.conversationId);
                    // chat title
                    setTitleChat(res.data.data?.title || '');
                }
                
                // set llm response
                setMessages(prev => [...prev, {
                    sender: 'llm',
                    content: res.data.data?.llm_result || ''
                }]);
            }
        }
        catch(error){
            console.log('full error: ', error);

            if(error instanceof Error){
                modal_config({
                    title: 'Error ❗', msg: error.message, btt1: false, 
                    btt2: 'try again', display: true
                });
            }
        }

        // clear message
        setMesageValue('');
    };

    // clear on conversation desactive
    useEffect(() =>{
        if(conversation === false){
            setMesageValue('');
            setFile(null);
            setConversationId(null);
            setMessages([]);
            setTitleChat('');
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
    }, [ messages ]);


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
                            <>
                            <h1 className={ styles.title_chat }>
                                { titleChat }
                            </h1>
                            <div className={ styles.coversation_container } ref={ conversationContainerRef }>
                                {
                                    messages && messages.map((msg, index) =>(
                                        <Fragment key={ index }>
                                            { msg.sender === 'user' ? (
                                                <>
                                                <p className={ styles.user_name }>
                                                    { `<${userName}>` }
                                                </p>
                                                <div className={ styles.user_message_container }>
                                                    <p>
                                                        { msg.content }
                                                    </p>
                                                </div> 
                                                </>
                                            ) : (
                                                <>
                                                <p className={ styles.llm_name }>
                                                    { `<IA>` }
                                                </p>
                                                <div className={ styles.llm_message_container }>
                                                    <p>{ msg.content }</p>
                                                </div>
                                                </>
                                            ) } 
                                        </Fragment>
                                    ))
                                }
                                { loading &&
                                    <p className={ styles.loading }>
                                        Loading...
                                        <span className="material-symbols-outlined">cached</span>
                                    </p> 
                                }
                            </div>
                            </>                            
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
                        onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setMesageValue(e.target.value) }
                        autoComplete='off'/>


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