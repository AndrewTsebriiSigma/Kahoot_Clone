import React from 'react'
import { useLocation } from 'react-router-dom';

const FinalScoreboard = () => {

    const location = useLocation()

    const scores = location.state?.scores;
    console.log(scores)
    return (
        <div>
            final scoreboard
        </div>
    )
}

export default FinalScoreboard
