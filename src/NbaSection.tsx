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
        fetch(`/pattern-predict/nba/predict/${date}?json`).then(response => response.json()).then(data => {
            setPredictions(data);
            setLoading(false);
        });
    }, [date]);
    const alertText = game => JSON.stringify(game, null, 2);
    function closeModal(){
      setModalShowing(null);
    }

    const renderTeam = team => (
        <div>
            <a href='javascript:void(0)' onClick={evt => { setModalShowing(team); evt.preventDefault(); }}>{team.name} ({team.record}) {team.sportsbook ? '(' + Object.values(team.sportsbook).join(' | ') + ')' : ''}</a>
        </div>
    )
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
                                        {renderTeam(away)} @ {renderTeam(home)}&nbsp;
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