
// css
import '../../../utils/AuthCss/AuthStyles.css';

// hooks
import React, { useState } from 'react';

// services
import { user_register } from '../../../services/AuthService';

// components
import Modal from '../../../components/Modal/Modal';


// register
const Register = () => {
    // interface
    interface IFormData{
        name: string,
        email: string,
        password: string
    };

    interface IModalConfig {
        title: string;
        msg: string;
        btt1: boolean;
        btt2: boolean;
        display: boolean;
        title_color?: string; // Opcional com valor padrão
    }

    // states
    const [ formData, setFormData ] = useState<IFormData>({name: '', email: '', password: ''});
    const [ confirmPassword, setConfirmPassword ] = useState<string>('');

    // modal
    const [ modal_display, setModal_display ] = useState<boolean>(false);
    const [ modal_title, setModal_title ] = useState<string>('');
    const [ modal_msg, setModal_msg ] = useState<string>('');
    const [ modal_btt, setmodal_btt ] = useState<boolean>(false);
    const [ modal_btt_2, setModal_btt_2 ] = useState<boolean>(false);
    const [ title_color, setTitle_color ] = useState<string>('#000');


    // functions


    // modal config
    const modal_config = ({ title, msg, btt1, btt2, display, title_color }: IModalConfig) => {
        setModal_title(title ?? '');
        setModal_msg(msg ?? '');
        setmodal_btt(btt1 ?? false);
        setModal_btt_2(btt2 ?? false);
        setModal_display(display ?? false);
        setTitle_color(title_color ?? '#000');

        // The "??" (nullish coalescing operator) 
        // returns the value on the right ONLY if the value on the left is null or undefined
    };    
    
    // close modal
    const closeModal = () =>{
        if(modal_btt_2 !== false){
            modal_config({
                title: '', msg: '', btt1: false, 
                btt2: false, display: false, title_color: '#000'
            });
        }
    };

    // form
    const handle_form = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        
        if(formData.password !== confirmPassword){
            console.log('confirm password must be equal password...');
            return;
        }

        try{
            const res = await user_register(formData);
            if(res.status === 201){
                console.log('User registration successfully');
            }
        }
        catch(error){
            console.log(error);
        }

        console.log(formData);
    };


    // jsx


    return (
        <div className='register_container'>
            <div className='register_image_container'>
                <div className='register_image_container_filter'>
                    <h1>Go talk to me</h1>
                    <h3>The best llm ever</h3>
                    <button type='button'>
                        More About
                    </button>
                </div>
            </div>

            <div className='register_panel'>
                <div>
                    <h1>Hello, friend</h1>
                    <img src='../../../images/hello.png' alt="Hello ilustration" />
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

                    <p className='ask'>Already logged ?</p>
                </form>
            </div>

            <Modal 
                title={ modal_title }
                msg={ modal_msg }
                btt1={ modal_btt }
                btt2={ modal_btt_2 }
                display={ modal_display }
                title_color={ title_color } 
                onClose={ closeModal }
            />
        </div>
    );
};

export default Register;