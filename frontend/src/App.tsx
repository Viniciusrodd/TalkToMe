// modules
import React from 'react';
import './App.css';

// hooks
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// pages
import Register from './pages/Auth/Register';


// app
function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path='/registro' element={ <Register /> } />
                </Routes>
            </BrowserRouter>
            <h1>app</h1>
        </div>
    );
}

export default App;
