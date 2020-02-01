import React, { useState } from 'react';
import AutoPlayAudio from './AutoPlayAudio';
import projects from './projects';

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
      <main>
        {
          projects.map(({ section: sectionName, links }: any) => (
            <section>
              <h2>{sectionName}</h2>
              <ul>
                {
                  links.map(({ name: projectName, url = '/#' }: any) => (
                    <li><a href={url}>{projectName}</a></li>
                  ))
                }
              </ul>
            </section>
          ))
        }
{/*         
        <section>
        <h2>Games</h2>
        </section>
        <ul>
          <li><a href="/circlebattle" target="blank">CircleBattle</a></li>
        </ul>
        <h2>Not Games</h2>
        <ul>
          <li><a href="/stocks" target="blank">Stocks</a></li>
        </ul>
        <h2>Contributed To</h2>
        <ul>
          <li><a href="/#" target="blank">Scrapin' It</a></li>
          <li><a href="/#" target="blank">Foodhyped</a></li>
        </ul> */}
      </main>
      <AutoPlayAudio/>
    </div>
  );
}

export default App;
