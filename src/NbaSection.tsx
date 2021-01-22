import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
require('react-datepicker/dist/react-datepicker.css')

export default () => {
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [predictions, setPredictions] = useState({} as any);
    useEffect(() => {
        setLoading(true);
        fetch(`/pattern-predict/nba/${date}?json`).then(response => response.json()).then(data => {
            setPredictions(data);
            setLoading(false);
        });
    }, [date]);
    const alertText = game => JSON.stringify(game, null, 2);
    return (
        <section>
            <h2>Nba Predictions</h2>
            {
                !loading && predictions.games ? (
                    <div>
                        <DatePicker selected={date} onChange={date => setDate(date)} />
                        <ul style={{ zoom: '70%' }}>
                            {
                                predictions.games.map(({ teams: { home, away }, prediction }) => (
                                    <li>
                                        <a href={`javascript:alert("${alertText(away)}")`}>{away.name} ({away.record})</a> @&nbsp;
                                        <a href={`javascript:alert("${alertText(home)}")`}>{home.name} ({home.record})</a>&nbsp;
                                        predicted winner: {prediction.winningTeam}&nbsp;
                                        with {Math.round(prediction.confidence)} confidence
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                ) : <small>loading</small>
            }
        </section>
    )
}