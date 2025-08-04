
// css
import '../../../utils/AuthCss/AuthStyles.css';

// hooks
import React, { useState } from 'react';

// assets
import helloImage from '../../../../public/images/hello.png'; 


// register
const Register = () => {
    // interface
    interface IFormData{
        name: string,
        email: string,
        password: string
    };

    // types
    //type ConfirmPass = string | number | readonly string[] | undefined;

    // states
    const [ formData, setFormData ] = useState<IFormData>({name: '', email: '', password: ''});
    const [ confirmPassword, setConfirmPassword ] = useState<string>('');


    // functions
    const handle_form = (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        
        if(formData.password !== confirmPassword){
            console.log('confirm password must be equal password...');
            return;
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
                    <img src={ helloImage } alt="Hello ilustration" />
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
        </div>
    );
};

export default Register;