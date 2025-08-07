// css
import './App.css'

// hooks
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// pages
import Register from './pages/Auth/Register/Register';
import Login from './pages/Auth/Login/Login';
import Homepage from './pages/Home/Homepage';


// app
function App() {
    return (
        <div className='app'>
            <BrowserRouter>
                <Routes>
                    { /* auth */ }
                    <Route path='/cadastro' element={ <Register /> } />
                    <Route path='/login' element={ <Login /> } />

                    { /* homepage */ }
                    <Route path='/talkToMe' element={ <Homepage /> } />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;
