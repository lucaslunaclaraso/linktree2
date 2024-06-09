import React, { useEffect, useState } from 'react'
import axios from 'axios'


function Stats(props) {
    const [clicks, setClicks] = useState();
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


    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>
            <h3 style={{ color: 'white' }}>Cantidad de clicks </h3>
            <h1 style={{ color: 'white' }}>{isLoading ? '' : clicks?.length == 1 ? clicks[clicks?.length - 1]?.count : `Total: ${clicks?.length}`}</h1>
            {
                filtro.total &&
                <h1 style={{ color: 'white' }}>{isLoading ? '' :  `Total: ${clicks?.length}`}</h1>

            }
            {
                filtro.dia && 
                <h1 style={{ color: 'white' }}>{isLoading ? '' :  `Total por día: ${clicks[clicks?.length -1]?.length}`}</h1>

            }
            {
                filtro.semana && 
                <h1 style={{ color: 'white' }}>{isLoading ? '' :  `Total por semana: ${clicks[clicks?.length -1]?.length}`}</h1>

            }
            {
                filtro.mes && 
                <h1 style={{ color: 'white' }}>{isLoading ? '' :  `Total por mes: ${clicks[clicks?.length -1]?.length}`}</h1>

            }
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button onClick={() => getClicksDay()}>Por día</button>
                <button onClick={() => getClicksWeekly()}>Por Semana</button>
                <button onClick={() => getClicksMonthly()}>Por Mes</button>
                <button onClick={() => getClicks()}>Total</button>

            </div>
        </div>
    )
}

export default Stats