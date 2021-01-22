import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import Modal from 'react-modal';
require('react-datepicker/dist/react-datepicker.css')

export default () => {
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [predictions, setPredictions] = useState({} as any);
    const [modalShowing,setModalShowing] = React.useState(null);
    useEffect(() => {
        setLoading(true);
        fetch(`/pattern-predict/nba/${date}?json`).then(response => response.json()).then(data => {
            setPredictions(data);
            setLoading(false);
        });
    }, [date]);
    const alertText = game => JSON.stringify(game, null, 2);
    function closeModal(){
      setModalShowing(null);
    }
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
                                        <a href='javascript:void(0)' onClick={evt => { setModalShowing(away); evt.preventDefault(); }}>{away.name} ({away.record})</a> @&nbsp;
                                        <a href='javascript:void(0)' onClick={evt => { setModalShowing(home); evt.preventDefault(); }}>{home.name} ({home.record})</a>&nbsp;
                                        predicted winner: {prediction.winningTeam} with {Math.round(prediction.confidence)} confidence
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                ) : <small>loading</small>
            }
            <Modal
                isOpen={Boolean(modalShowing)}
                onRequestClose={closeModal}
                contentLabel="NBA Details"
            >
                <button onClick={closeModal}>Close Modal</button>
                <pre>
                    {
                        JSON.stringify(modalShowing, null, 2)
                    }
                </pre>

            </Modal>
        </section>
    )
}