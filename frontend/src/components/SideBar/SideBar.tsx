
// css
import styles from './SideBar.module.css';

// hooks
import { useState } from 'react';


// sidebar
const SideBar = () => {
    // states
    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    const [ isSearching, setIsSearching ] = useState<boolean>(false);


    // functions
    

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


    // jsx


    return (
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
                                <li>
                                    <span className="material-symbols-outlined">search</span>
                                    <input type="text" name="" placeholder='Search for chats...' />
                                    <button type='submit'>
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
                        <li>
                            <span className="material-symbols-outlined">chat_add_on</span>
                            New chat
                        </li>
                    </ul>

                    <hr />
                    <div className={ styles.scrollbar_div }>
                        <p className={ styles.chat_p }>Chats</p>

                        <p>chat conversation 1</p>
                        <p>chat conversation 2</p>
                        <p>chat conversation 3</p>
                        <p>chat conversation 4</p>
                        <p>chat conversation 1</p>
                        <p>chat conversation 2</p>
                        <p>chat conversation 3</p>
                        <p>chat conversation 4</p>
                        <p>chat conversation 1</p>
                        <p>chat conversation 2</p>
                        <p>chat conversation 3</p>
                        <p>chat conversation 4</p>
                        <p>chat conversation 1</p>
                        <p>chat conversation 2</p>
                        <p>chat conversation 3</p>
                        <p>chat conversation 4</p>                    
                        <p>chat conversation 1</p>
                        <p>chat conversation 2</p>
                        <p>chat conversation 3</p>
                        <p>chat conversation 4</p>
                        <p>chat conversation 1</p>
                        <p>chat conversation 2</p>
                        <p>chat conversation 3</p>
                        <p>chat conversation 4</p>
                    </div>
                    </>
                ) : (
                    <ul>
                        <li onClick={ side_open }>
                            <span className="material-symbols-outlined">dock_to_right</span>
                        </li>
                        {
                            isSearching ? (
                                <li>
                                    <span className="material-symbols-outlined">search</span>
                                    <input type="text" name="" placeholder='Search...' />
                                </li>
                            ) : (
                                <li onClick={ search_chat }>
                                    <span className="material-symbols-outlined">search</span>
                                </li>
                            )
                        }
                        <li>
                            <span className="material-symbols-outlined">person</span>
                        </li>
                    </ul>
                )
            }
        </div>
    );
};

export default SideBar;