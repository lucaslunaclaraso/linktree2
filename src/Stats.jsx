import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ReactPaginate from 'react-paginate';
import './tabla.css'
function Stats(props) {
    const [clicks, setClicks] = useState();
    const [clicksTable, setClicksTable] = useState([]);
    const [filteredClicks, setFilteredClicks] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [filter, setFilter] = useState('');
    const clicksPerPage = 10;
    const [filtro, setFiltro] = useState({
        total: false,
        dia: false,
        semana: false,
        mes: false
    });
    const [isLoading, setIsLoading] = useState(true);
    const getClicks = async () => {
        const res = await axios.get('https://apidengue.vercel.app/')
        setClicks(res.data)
        setClicksTable(res.data)
        setFilteredClicks(res.data)
        setPageCount(Math.ceil(res.data.length / clicksPerPage));
        setFiltro({
            total: true,
            dia: false,
            semana: false,
            mes: false
        })
        setIsLoading(false)
    }
    const getClicksDay = async () => {
        const res = await axios.get('https://apidengue.vercel.app/daily')
        setClicks(res.data)
        setFiltro({
            total: false,
            dia: true,
            semana: false,
            mes: false
        })
        setIsLoading(false)
    }
    const getClicksWeekly = async () => {
        const res = await axios.get('https://apidengue.vercel.app/weekly')
        setClicks(res.data)
        setFiltro({
            total: false,
            dia: false,
            semana: true,
            mes: false
        })
        setIsLoading(false)
    }
    const getClicksMonthly = async () => {
        const res = await axios.get('https://apidengue.vercel.app/monthly')
        setClicks(res.data)
        setFiltro({
            total: false,
            dia: false,
            semana: false,
            mes: true
        })
        setIsLoading(false)
    }

    useEffect(() => {
        getClicks()
    }, [])
    const handleFilterChange = (e) => {
        const value = e.target.value;
        setFilter(value);
        const filtered = clicks.filter(click =>
            click.timestamp.includes(value)
        );
        setFilteredClicks(filtered);
        setPageCount(Math.ceil(filtered.length / clicksPerPage));
        setCurrentPage(0); // Reset to the first page when filtering
    };

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * clicksPerPage;
    const currentClicks = filteredClicks.slice(offset, offset + clicksPerPage);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>
            <h3 style={{ color: 'white' }}>Cantidad de clicks </h3>
            {/* <h1 style={{ color: 'white' }}>{isLoading ? '' : clicks?.length == 1 ? clicks[clicks?.length - 1]?.count : `Total: ${clicks?.length}`}</h1> */}
            {
                filtro.total &&
                <h1 style={{ color: 'white' }}>{isLoading ? '' : `Total: ${clicks?.length}`}</h1>

            }
            {
                filtro.dia &&
                <h1 style={{ color: 'white' }}>{isLoading ? '' : `Total por día: ${clicks[clicks?.length - 1]?.count}`}</h1>

            }
            {
                filtro.semana &&
                <h1 style={{ color: 'white' }}>{isLoading ? '' : `Total por semana: ${clicks[clicks?.length - 1]?.count}`}</h1>

            }
            {
                filtro.mes &&
                <h1 style={{ color: 'white' }}>{isLoading ? '' : `Total por mes: ${clicks[clicks?.length - 1]?.count}`}</h1>

            }
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button onClick={() => getClicksDay()}>Por día</button>
                <button onClick={() => getClicksWeekly()}>Por Semana</button>
                <button onClick={() => getClicksMonthly()}>Por Mes</button>
                <button onClick={() => getClicks()}>Total</button>

            </div>

            <table>
                <thead>
                    <tr>
                        <th style={{color:'white'}}>Registro de Click</th>
                    </tr>
                </thead>
                <tbody>
                    {currentClicks.map(click => (
                        <tr key={click._id}>
                            <td style={{color:'white'}}>{new Date(click.timestamp).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ReactPaginate
                previousLabel={'previous'}
                nextLabel={'next'}
                breakLabel={'...'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
            />
        </div>
    )
}

export default Stats