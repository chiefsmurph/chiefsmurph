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
    return (
        <section>
            <h2>Nba Predictions</h2>
            {
                !loading ? (
                    <div>
                        <DatePicker selected={date} onChange={date => setDate(date)} />
                        <ul style={{ zoom: '70%' }}>
                            {
                                predictions.predictions.map(line => <li>{line}</li>)
                            }
                        </ul>
                    </div>
                ) : <small>loading</small>
            }
        </section>
    )
}