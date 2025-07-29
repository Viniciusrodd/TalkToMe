
// css
import '../../../utils/AuthCss/AuthStyles.css';


// register
const Register = () => {

    // functions
    const handle_form = (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        const form = e.currentTarget; // HTMLFormElement
        const formData = new FormData(form); // Objeto FormData para pegar os valores

        // Iterar sobre os campos do formulário
        formData.forEach((value, key) => {
            console.log(key, value);
        });
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
                    <img src="../../../images/hello.png" alt="" />
                </div>
                <p>Welcome to TalkToMe</p>

                <form onSubmit={ handle_form } autoComplete='off'>
                    <div className='input_container'>
                        <span className="material-symbols-outlined">person</span>
                        <input type="text" name="name" placeholder='Full name' />
                    </div>

                    <div className='input_container'>
                        <span className="material-symbols-outlined">mail</span>
                        <input type="email" name="email" placeholder='Email' />
                    </div>

                    <div className='input_container'>
                        <span className="material-symbols-outlined">key</span>
                        <input type="password" name="password" placeholder='Password' />
                    </div>

                    <div className='input_container'>
                        <span className="material-symbols-outlined">key</span>
                        <input type="password" name="confirm_password" placeholder='Confirm Password' />
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