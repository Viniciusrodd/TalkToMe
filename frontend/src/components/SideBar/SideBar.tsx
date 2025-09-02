
// css
import styles from './SideBar.module.css';

// hooks
import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConversations } from '../../hooks/useGetConversations'; // custom hook

// component
import Modal from '../../components/Modal/Modal';

// context
import { UserContext } from '../../context/UserContext';
import { ConversationContext } from '../../context/ConversationContext';

// service
import { search_chat_service } from '../../services/ChatService';
import { user_logOut } from '../../services/AuthService';


// sidebar
const SideBar = () => {
    // interfaces
    interface IModalConfig {
        title: string;
        msg: string;
        btt1: boolean | string;
        btt2: boolean | string;
        display: boolean;
    };

    interface chat{
        conversationId: string;
        title: string;
        conversationCreatedAt: Date;
        messages: {
            messageId: string;
            sender: string;
            content: string;
        }[];
    }


    // states
    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    const [ isSearching, setIsSearching ] = useState<boolean>(false);
    const [ searchValue, setSearchValue ] = useState<string>('');
    const [ searchChat_find, setSearchChat_find ] = useState<chat[]>([]);
    const [ search_notfound, setSearch_notfound ] = useState<string | boolean>(false);
    const [ loginRedirect, setLoginRedirect ] = useState<boolean>(false);
    const [ conversationId, setConversationId ] = useState<string>('');

    // consts
    const { conversation, setConversation, setConversationHistoric } = useContext(ConversationContext);
    const { userId, setUserId, userName, setUserName } = useContext(UserContext);
    const search_ref = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

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

    // login redirect
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
    }, [loginRedirect]);

    // side open
    const side_open = () =>{
        setIsOpen(!isOpen);
        setIsSearching(!isSearching);
    };

    // search chat
    const search_chat = () =>{
        setIsSearching(!isSearching);
        setIsOpen(!isOpen);
    };

    // search focus
    useEffect(() =>{
        search_ref.current?.focus();
    }, [ isSearching ]);

    // new conversation
    const new_conversation = () =>{
        if(conversation) setConversation(false);
    };

    // get conversations
    const { conversations, errorResConv } = getConversations(userId);
    useEffect(() =>{
        if(errorResConv){
            console.log('Error at get conversations historic: ', errorResConv);
            modal_config({
                title: 'Error ❗', msg: 'Internal error at get conversations historic,\n please try again later!', 
                btt1: false, btt2: 'Try again', display: true
            });
        }
    }, [ conversations, errorResConv ]);

    // historic conversation redirect
    const historicConversationRedirect = (conversationId: string | undefined) =>{
        if(conversationId !== ''){
            const conversationFiltered = conversations.filter(conv => conv.conversationId === conversationId);

            setConversation(true);
            setConversationHistoric(conversationFiltered);
            setSearchChat_find([]);
        }
    };

    // send chat search 
    const send_search = async () =>{
        try{
            const res = await search_chat_service(userId, searchValue);
        
            if(res.status === 200 && res.data.data){
                setSearchChat_find(res.data.data);
                setSearchValue('');
            }
            if(res.status === 204){
                setSearch_notfound('Chat not found...');
                setTimeout(() => {
                    setSearchValue('');
                    setSearch_notfound(false);
                }, 3000);
            }
        }
        catch(error){
            console.log('Error at send search chat: ', errorResConv);
            modal_config({
                title: 'Error ❗', msg: 'Internal error at send search chat,\n please try again later!', 
                btt1: false, btt2: 'Try again', display: true
            });
        };
    };

    // reset chats
    const reset_chats = () =>{
        setSearchChat_find([]);
        setSearch_notfound(false);
    };

    // exit user
    const exit = async () =>{
        try{
            modal_config({
                title: 'Success ✅', msg: `Adios <${userName}> 👋, \n until next time...`, 
                btt1: false, btt2: false, display: true
            });                    
            
            const res = await user_logOut();
            if(res.status === 200){
                setUserId('');
                setUserName('');
                setConversation(false);
                setConversationHistoric([]);
                setLoginRedirect(true);
            }
        }
        catch(error){
            console.log('Error at logOut: ', error);
            modal_config({
                title: 'Error ❗', msg: 'Internal error at logOut,\n please try again later!', 
                btt1: false, btt2: 'Try again', display: true
            });
        }
    };

    // delete chat modal
    const deleteChat_modal = (convId: string) =>{
        setConversationId(convId);

        modal_config({
            title: 'Wait ❗', msg: 'You sure about delete this chat ?', 
            btt1: `Yes, I'm sure`, btt2: false, display: true
        });
    };

    // delete chat
    const deleteChat = () =>{
        modal_config({
            title: '', msg: '', btt1: false, 
            btt2: false, display: false
        });
        setConversation(false);
        // split in conversation historic...
        
        console.log(`chat: ${conversationId} deletado`);
    };


    // jsx


    return (
        <>
        { /* modal */ }
        <Modal 
            title={ modal_title }
            msg={ modal_msg }
            btt1={ modal_btt }
            btt2={ modal_btt_2 }
            display={ modal_display }
            onClose={ closeModal }
            modalEvent={ deleteChat }
        />

        <div className={ styles.sidebar_container }>
            {
                isOpen ? (
                    <>
                    <ul className={ styles.open_sidebar }>
                        <li onClick={ side_open }>
                            <span className="material-symbols-outlined">dock_to_left</span>
                        </li>
                        {
                            isSearching ? (
                                <li className={ styles.search_li }>
                                    <span className="material-symbols-outlined">search</span>
                                    <input type="text" name="" placeholder='Search for chats...' 
                                    ref={ search_ref } value={ searchValue } 
                                    onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value) } />
                                    <button type='submit' onClick={ send_search }>
                                        Search
                                    </button>
                                </li>
                            ) : (
                                <li onClick={ search_chat }>
                                    <span className="material-symbols-outlined">search</span>
                                    Search chats
                                </li>
                            )
                        }
                        <li onClick={ new_conversation }>
                            <span className="material-symbols-outlined">chat_add_on</span>
                            New chat
                        </li>
                    </ul>

                    <hr />
                    <div className={ styles.scrollbar_div }>
                        <p className={ styles.chat_p }>Chats</p>
                        { search_notfound && (
                            <p>{ search_notfound }</p>                            
                        ) }

                        { searchChat_find.length > 0 && (
                            <button type='button' className={ styles.reset_btt }
                            onClick={ reset_chats }>
                                reset
                            </button>
                        ) }
                        
                        {/* searched chats conversations */}
                        { searchChat_find.length > 0 && searchChat_find.map(chat =>(
                            <div className={ styles.chat_titles_container }  key={ chat.conversationId }>
                                <p className={ styles.chat_titles } onClick={ () => historicConversationRedirect(chat.conversationId) }>
                                    { chat.title }
                                </p>

                                <div className={ styles.interactions_container }>
                                    <span className="material-symbols-outlined">edit</span>
                                    <span className={ `material-symbols-outlined ${styles.delete_icon}` }>
                                        delete
                                    </span>
                                </div>
                            </div>
                        ))}

                        {/* all chats conversations */}
                        { searchChat_find.length === 0 && !search_notfound && conversations && conversations.map((conv) =>(
                            <div className={ styles.chat_titles_container } key={ conv.conversationId }>
                                <p className={ styles.chat_titles_p } onClick={ () => historicConversationRedirect(conv.conversationId) }>
                                    { conv.title }
                                </p>

                                <div className={ styles.interactions_container }>
                                    <span className="material-symbols-outlined">edit</span>
                                    <span onClick={ () => deleteChat_modal(conv.conversationId) } className={ `material-symbols-outlined ${styles.delete_icon}` }>
                                        delete
                                    </span>
                                </div>
                            </div>
                        )) }
                    </div>                    
                    </>
                ) : (
                    <ul>
                        <li onClick={ side_open }>
                            <span className="material-symbols-outlined">dock_to_right</span>
                        </li>

                        <li onClick={ search_chat }>
                            <span className="material-symbols-outlined">search</span>
                        </li>

                        <li onClick={ new_conversation }>
                            <span className="material-symbols-outlined">chat_add_on</span>
                        </li>

                        <li className={ styles.exit_li } onClick={ exit }>
                            <span className="material-symbols-outlined">exit_to_app</span>
                        </li>
                    </ul>
                )
            }
        </div>
        </>
    );
};

export default SideBar;