import './App.css';
import { Routes, Route } from 'react-router'
import Home from './Home';
import Stats from './Stats';
import { useEffect, useState } from 'react';
import PanelSorteo from './CrearSorteo';
import CrearSorteo from './CrearSorteo';
import ListadoSorteos from './ListadoSorteos';
import DetalleSorteo from './DetalleSorteo';
import Callback from './Callback';


function App() {
    const [width, setWidth] = useState(window.innerWidth);
    const isMobile = width <= 768;

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const RutaPrivada = ({ children }) => {
        const usuario = localStorage.getItem('fbUser')?.replaceAll('"', "");


        if (usuario !== ('Lucas Luna' || 'Luis San Cristobal')) {
            return <Home isMobile={isMobile} />
        }

        return children;
    };

    const [sorteos, setSorteos] = useState([]);
    return (
        <div className="App">
            <Routes>
                <Route exact path='/' element={<Home isMobile={isMobile} />} />
                <Route path='/stats' element={<Stats />} />

                <Route path='/panel' element={<RutaPrivada><CrearSorteo isMobile={isMobile} sorteos={sorteos} setSorteos={setSorteos}/></RutaPrivada>} />

                <Route path="/sorteos" element={<RutaPrivada><ListadoSorteos sorteos={sorteos} /> </RutaPrivada>} />
                
                <Route path="/sorteo/:url" element={<RutaPrivada><DetalleSorteo sorteos={sorteos} setSorteos={setSorteos} /> </RutaPrivada>} />
                <Route path="/callback" element={<Callback />} />
            </Routes>
        </div>
    );
}

export default App;
