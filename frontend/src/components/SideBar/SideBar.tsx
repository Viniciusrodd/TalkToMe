
// css
import styles from './SideBar.module.css';


const SideBar = () => {
    return (
        <div className={ styles.sidebar_container }>
            <ul>
                <li>
                    <span className="material-symbols-outlined">dock_to_right</span>
                </li>
                <li>
                    <span className="material-symbols-outlined">search</span>
                </li>
                <li>
                    <span className="material-symbols-outlined">person</span>
                </li>
            </ul>
        </div>
    );
};

export default SideBar;