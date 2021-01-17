import React, { useState, useEffect } from 'react';

export default () => {
    const [predictions, setPredictions] = useState({} as any);
    useEffect(() => {
        fetch('/pattern-predict/nba?json').then(setPredictions);
    }, []);
    return (
        <section>
            <h2>Nba Predictions</h2>
            {
                predictions.predictions ? (
                    <div>
                        <i>for {predictions.date}...</i>
                        <ul>
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