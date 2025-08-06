// css
import './App.css'

// hooks
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// pages
import Register from './pages/Auth/Register/Register';
import Login from './pages/Auth/Login/Login';


// app
function App() {
    return (
        <div className='app'>
            <BrowserRouter>
                <Routes>
                    { /* auth */ }
                    <Route path='/cadastro' element={ <Register /> } />
                    <Route path='/login' element={ <Login /> } />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;
