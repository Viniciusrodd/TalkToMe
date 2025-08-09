
// css
import '../../../utils/AuthCss/AuthStyles.css';

// components
import Modal from '../../../components/Modal/Modal';

// hooks
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// service
import { user_login } from '../../../services/AuthService';


// login
const Login = () => {
    // interface
    interface IModalConfig {
        title: string;
        msg: string;
        btt1: boolean | string;
        btt2: boolean | string;
        display: boolean;
    };

    interface IFormData{
        email: string,
        password: string
    };


    // states
    const [ formData, setFormData ] = useState<IFormData>({ email: '', password: '' });
    const [ confirmPassword, setConfirmPassword ] = useState<string>('');
    const [ redirectHomepage, setRedirectHomepage ] = useState<boolean>(false);

    // modal
    const [ modal_display, setModal_display ] = useState<boolean>(false);
    const [ modal_title, setModal_title ] = useState<string>('');
    const [ modal_msg, setModal_msg ] = useState<string>('');
    const [ modal_btt, setmodal_btt ] = useState<boolean | string>(false);
    const [ modal_btt_2, setModal_btt_2 ] = useState<boolean | string>(false);

    // consts
    const navigate = useNavigate();


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

    // redirect login
    useEffect(() =>{
        if(redirectHomepage){
            const timeout = setTimeout(() => {
                modal_config({
                    title: '', msg: '', btt1: false, 
                    btt2: false, display: false
                });  

                navigate('/');
            }, 3000);

            return () =>{
                clearTimeout(timeout);
            };
        }
    }, [redirectHomepage]);

    // form
    const handle_form = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();

        if(formData.password !== confirmPassword){
            modal_config({
                title: 'Error ❗', msg: 'passwords must be equals', btt1: false, 
                btt2: 'try again', display: true
            });
            return;
        }

        try{
            const res = await user_login(formData);
            if(res.status === 200){
                console.log('User login successfully');

                // clean states
                setFormData({ email: '', password: '' });
                setConfirmPassword('');

                // modal advice
                modal_config({
                    title: 'Success ✅', msg: `Hello <${res.data.data?.name}> 👋, \nYou will be redirect to Homepage`, 
                    btt1: false, btt2: false, display: true
                });

                setRedirectHomepage(true);
            }
        }
        catch(error){
            console.log('Full error: ', error);

            if(error instanceof Error){
                modal_config({
                    title: 'Error ❗', msg: error.message, btt1: false, 
                    btt2: 'try again', display: true
                });
            }
        }
    };

    // register page
    const register_page = () =>{
        navigate('/cadastro');
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
            <div className='auth_image_container login_image_container'>
                <div className='auth_image_container_filter'>
                    <h1>Not registered yet ?</h1>
                    <h3>Go to the register page</h3>
                    <button type='button' onClick={ register_page }>
                        Register
                    </button>
                </div>
            </div>

            <div className='auth_panel'>
                <div>
                    <h1>Log in</h1>
                    <img src='../../../images/util_images/login.png' alt="Hello ilustration" />
                </div>

                <form autoComplete='off' onSubmit={ handle_form }>
                    <div className='input_container'>
                        <span className="material-symbols-outlined">mail</span>
                        <input type="email" name="email" placeholder='Email' value={ formData.email }
                        onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, email: e.target.value}) } />
                    </div>

                    <div className='input_container'>
                        <span className="material-symbols-outlined">key</span>
                        <input type="password" name="password" placeholder='Password' value={ formData.password }
                        onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, password: e.target.value}) } />
                    </div>

                    <div className='input_container'>
                        <span className="material-symbols-outlined">key</span>
                        <input type="password" name="confirm_password" placeholder='Confirm Password' value={ confirmPassword } 
                        onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value) } />
                    </div>

                    <button type='submit'>
                        Login
                    </button>                    
                </form>
            </div>
        </div>
    );
};

export default Login;