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
    useEffect(() => {
        getClicks()
    }, [])


    console.log(clicks)
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>
            <h3 style={{ color: 'white' }}>Cantidad de clicks </h3>
            <h1 style={{ color: 'white' }}>{isLoading ? '' : clicks[0]?.contador}</h1>
        </div>
    )
}

export default Stats