import React, { useState } from 'react';
import AutoPlayAudio from './AutoPlayAudio';

import logo from './logo.svg';
import './App.css';
const App: React.FC = () => {
  const [clicked, setClicked] = useState(false);
  if (!clicked) {
    return (
      <div className="click-here">
        <button onClick={() => setClicked(true)}>click here</button>
      </div>
    );
  }
  return (
    <div className="App">
      <header>
        <div>
          {/* <img src={MeTransparent} /> */}
        </div>
        <h1>chiefsmurph.com</h1>
      </header>
      <ul>
        <li><a href="/stocks" target="blank">Stocks</a></li>
        <li><a href="/circlebattle" target="blank">CircleBattle</a></li>
      </ul>
      <AutoPlayAudio/>
    </div>
  );
}

export default App;
