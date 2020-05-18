import React, { useState, useEffect } from 'react';
import AutoPlayAudio from './AutoPlayAudio';
import projects from './projects';

import logo from './logo.svg';
import './App.css';

import ReactGA from 'react-ga';
ReactGA.initialize('UA-131761952-2');
ReactGA.pageview(window.location.pathname + window.location.search);

const App: React.FC = () => {
  const [clicked, setClicked] = useState(false);
  const [loadedVideo, setLoadedVideo] = useState(false);
  if (!clicked) {
    return (
      <div className="click-here">
        <button onClick={() => setClicked(true)}>click here</button>
      </div>
    );
  }

  var audio = new Audio(`https://chiefsmurph.com/recordaudio/audio/chiefsmurph-what.m4a`);
  audio.play();
  
  return (
    <div className="App">
      <header>
        <div>
          {/* <img src={MeTransparent} /> */}
          
          <video loop autoPlay muted poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" style={{ visibility: loadedVideo ? 'visible' : 'hidden' }} onLoadedData={() => setTimeout(() => setLoadedVideo(true), 300)}>
            <source src="https://chiefsmurph.com/memovingcrop.mp4" type="video/mp4" />
            <source src="https://chiefsmurph.com/memovingcrop.mp4" type="video/ogg" />
            Your browser does not support the video tag.
        </video>
        </div>
        <h1>chiefsmurph.com</h1>
      </header>

      
      <div className="second-row">
        <a href="https://github.com/chiefsmurph" className="github">Github</a>
        <a href="https://linkedin.com/chiefsmurph" className="linkedIn">LinkedIn</a>
        <div/>
      </div>
      <main>
        {/* {loadedVideo.toString()} */}
        {
          projects.map(({ section: sectionName, links }: any) => (
            <section>
              <h2>{sectionName}</h2>
              <ul>
                {
                  links.map(({ name: projectName, url }: any) => (
                    <li><a href={url} className={String(!url && 'disabled-link')} target="_blank">{projectName}</a></li>
                  ))
                }
              </ul>
            </section>
          ))
        }
      </main>
      <AutoPlayAudio/>
    </div>
  );
}

export default App;
