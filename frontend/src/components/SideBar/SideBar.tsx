
// css
import styles from './SideBar.module.css';

// hooks
import { useState } from 'react';


// sidebar
const SideBar = () => {
    // states
    const [ isOpen, setIsOpen ] = useState<boolean>(false);


    // functions
    const side_open = () =>{
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
                        <li>
                            <span className="material-symbols-outlined">search</span>
                            Search chats
                        </li>
                        <li>
                            <span className="material-symbols-outlined">chat_add_on</span>
                            New chat
                        </li>
                    </ul>

                    <hr />
                    <p>Chats</p>

                    <p>jfndsajknfdk</p>
                    <p>jfndsajknfdk</p>
                    <p>jfndsajknfdk</p>
                    <p>jfndsajknfdk</p>
                    </>
                ) : (
                    <ul>
                        <li onClick={ side_open }>
                            <span className="material-symbols-outlined">dock_to_right</span>
                        </li>
                        <li>
                            <span className="material-symbols-outlined">search</span>
                        </li>
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