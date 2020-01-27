import React from 'react';
import logo from './logo.svg';
import './App.css';
import MeTransparent from './me transparent.png';
console.log({ MeTransparent })
const App: React.FC = () => {
  return (
    <div className="App">
      <header>
        <img src={MeTransparent} />
        <h1>chiefsmurph.com</h1>
      </header>
      <ul>
        <li><a href="/stocks" target="blank">Stocks</a></li>
        <li><a href="/circlebattle" target="blank">CircleBattle</a></li>
      </ul>
    </div>
  );
}

export default App;
