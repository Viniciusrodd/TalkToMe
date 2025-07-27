// css
import './App.css'

// hooks
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// pages
import Register from './pages/Auth/Register/Register';


// app
function App() {
    return (
        <div className='app'>
            <BrowserRouter>
                <Routes>
                    <Route path='/cadastro' element={ <Register /> } />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;
