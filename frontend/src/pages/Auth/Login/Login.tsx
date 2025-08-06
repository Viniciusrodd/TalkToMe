
// css
import '../../../utils/AuthCss/AuthStyles.css';

// components
import Modal from '../../../components/Modal/Modal';

// hooks
import { useState } from 'react';


// login
const Login = () => {
    // interface
    interface IModalConfig {
        title: string;
        msg: string;
        btt1: boolean | string;
        btt2: boolean | string;
        display: boolean;
    }

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


    // jsx
    return (
        <div className='auth_container'>
            { /* modal */ }
            <Modal 
                title={ modal_title }
                msg={ modal_msg }
                btt1={ modal_btt }
                btt2={ modal_btt_2 }
                display={ modal_display }
                onClose={ closeModal }
            />

            { /* aplication */ }
            <div className='auth_image_container test'>
                <div className='auth_image_container_filter'>
                    <h1>Not registered yet ?</h1>
                    <h3>Go to the register page</h3>
                    <button type='button'>
                        Register
                    </button>
                </div>
            </div>

            <div className='auth_panel'>
                <div>
                    <h1>Log in</h1>
                    <img src='../../../images/login.png' alt="Hello ilustration" />
                </div>
            </div>
        </div>
    );
};

export default Login;