
// css
import styles from './SideBar.module.css';

// hooks
import React, { useState, useContext, useEffect, Fragment, useRef } from 'react';
import { getConversations } from '../../hooks/useGetConversations'; // custom hook

// component
import Modal from '../../components/Modal/Modal';

// context
import { UserContext } from '../../context/UserContext';
import { ConversationContext } from '../../context/ConversationContext';


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

    // states
    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    const [ isSearching, setIsSearching ] = useState<boolean>(false);
    const [ searchValue, setSearchValue ] = useState<string>('');

    // consts
    const { conversation, setConversation, setConversationHistoric } = useContext(ConversationContext);
    const { userId } = useContext(UserContext);
    const search_ref = useRef<HTMLInputElement>(null);

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
            console.log('Error at get conversations in homepage: ', errorResConv);
            modal_config({
                title: 'Error ❗', msg: 'Internal erro at get conversations historic,\n please try again later!', 
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
        }
    };

    // send chat search 
    const send_search = () =>{
        if(searchValue !== '') console.log('search value: ', searchValue);

        setSearchValue('');
    };


    // jsx


    return (
        <div className={ styles.sidebar_container }>
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

                        { conversations && conversations.map((conv) =>(
                            <Fragment key={ conv.conversationId }>
                                <p onClick={ () => historicConversationRedirect(conv.conversationId) }>
                                    { conv.title }
                                </p>
                            </Fragment>
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
                    </ul>
                )
            }
        </div>
    );
};

export default SideBar;