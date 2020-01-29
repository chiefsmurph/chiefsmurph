import React from 'react';
import AutoPlayAudio from './AutoPlayAudio';

import logo from './logo.svg';
import './App.css';
import MeTransparent from './me transparent.png';
console.log({ MeTransparent })
const App: React.FC = () => {
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
