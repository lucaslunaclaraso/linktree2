import './App.css';
import { Routes, Route } from 'react-router'
import Home from './Home';
import Stats from './Stats';
import { useEffect, useState } from 'react';


function App() {
    
    return (
        <div className="App">
            <Routes>
                <Route exact path='/' element={<Home />} />
                <Route path='/stats' element={<Stats  />} />
            </Routes>
        </div>
    );
}

export default App;
