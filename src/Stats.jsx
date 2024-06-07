import React, { useEffect, useState } from 'react'
import axios from 'axios'


function Stats(props) {
    const [clicks, setClicks] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const getClicks = async () => {
        const res = await axios.get('https://apidengue.vercel.app/')
        setClicks(res.data)
        setIsLoading(false)
    }
    const getClicksDay = async () => {
        const res = await axios.get('https://apidengue.vercel.app/daily')
        setClicks(res.data)
        setIsLoading(false)
    }
    const getClicksWeekly = async () => {
        const res = await axios.get('https://apidengue.vercel.app/weekly')
        setClicks(res.data)
        setIsLoading(false)
    }
    const getClicksMonthly = async () => {
        const res = await axios.get('https://apidengue.vercel.app/monthly')
        setClicks(res.data)
        setIsLoading(false)
    }

    useEffect(() => {
        getClicks()
    }, [])


    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>
            <h3 style={{ color: 'white' }}>Cantidad de clicks </h3>
            <h1 style={{ color: 'white' }}>{isLoading ? '' : clicks[0]?.contador ? clicks[0]?.contador : clicks[0]?.count}</h1>

            <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                <button onClick={() => getClicksDay()}>Por día</button>
                <button onClick={() => getClicksWeekly()}>Por Semana</button>
                <button onClick={() => getClicksMonthly()}>Por Mes</button>
                <button onClick={() => getClicks()}>Total</button>

            </div>
        </div>
    )
}

export default Stats