
// css
import '../../../utils/AuthCss/AuthStyles.css';

// hooks
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// services
import { user_register } from '../../../services/AuthService';

// components
import Modal from '../../../components/Modal/Modal';


// register
const Register = () => {
    // interface
    interface IModalConfig {
        title: string;
        msg: string;
        btt1: boolean | string;
        btt2: boolean | string;
        display: boolean;
    };
    interface IFormData{
        name: string,
        email: string,
        password: string
    };


    // states
    const [ formData, setFormData ] = useState<IFormData>({ name: '', email: '', password: '' });
    const [ confirmPassword, setConfirmPassword ] = useState<string>('');
    const [ redirectLogin, setRedirectLogin ] = useState<boolean>(false);

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
        if(redirectLogin){
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
    }, [redirectLogin]);

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
            const res = await user_register(formData);
            if(res.status === 201){
                console.log('User registration successfully');

                // clean states
                setFormData({ name: '', email: '', password: '' });
                setConfirmPassword('');

                // modal advice
                modal_config({
                    title: 'Success ✅', msg: 'You will be redirect to Login', btt1: false, 
                    btt2: false, display: true
                });

                setRedirectLogin(true);
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
    };

    // login page
    const login_page = () =>{
        navigate('/login');
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
            <div className='auth_image_container'>
                <div className='auth_image_container_filter'>
                    <h1>Go talk to me</h1>
                    <h3>The best llm ever</h3>
                    <button type='button' onClick={ login_page }>
                        Already logged ?
                    </button>
                </div>
            </div>

            <div className='auth_panel'>
                <div>
                    <h1>Hello, friend</h1>
                    <img src='../../../images/util_images/hello.png' alt="Hello ilustration" />
                </div>
                <p>Welcome to TalkToMe</p>

                <form onSubmit={ handle_form } autoComplete='off'>
                    <div className='input_container'>
                        <span className="material-symbols-outlined">person</span>
                        <input type="text" name="name" placeholder='Full name' value={ formData.name } 
                        onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value}) } />
                    </div>

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
                        Register
                    </button>

                    {/*
                    <p className='ask'>Already logged ?</p>
                    */}
                </form>
            </div>
        </div>
    );
};

export default Register;