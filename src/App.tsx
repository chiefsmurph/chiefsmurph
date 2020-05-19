import React, { useState, useEffect } from 'react';
import AutoPlayAudio from './AutoPlayAudio';
import projects from './projects';

import { Line } from 'react-chartjs-2';

import socketIOClient from 'socket.io-client';

import logo from './logo.svg';
import './App.css';

import ReactGA from 'react-ga';
ReactGA.initialize('UA-131761952-2');
ReactGA.pageview(window.location.pathname + window.location.search);



const getColor = (i: number) => ['black', 'green', 'blue', 'orange', 'black', 'violet', 'pink', 'black', 'orange', 'blue', 'green'][i];
const stockDataToChartData = (stockData: any) => {

  if (!stockData || !stockData.length) {
    return {
      chartData: []
    };
  }

  const curDate = (new Date(stockData[stockData.length - 1].time)).toLocaleDateString();
  const labels = stockData.map((r: any) => (new Date(r.time)).toLocaleTimeString());
  const dataKeys = Object.keys(stockData[0]).filter(key => key !== 'time').sort((a, b) => {
    const first = 'alpacaBalance';
    return a === first ? -1 : b === first ? 1 : 0; 
  });
  console.log({ dataKeys })
  const datasets = dataKeys.map((key, i) => ({
    label: key,
    data: stockData.map((r: any) => r[key]),

    fill: false,
    lineTension: key.includes('balance') ? 0 : 0,
    backgroundColor: 'rgba(75,192,192,0.1)',
    pointBorderColor: getColor(i),
    // pointBorderWidth: 10,
    borderColor: getColor(i),
    // borderCapStyle: 'butt',
    borderWidth: 5,
    borderDashOffset: 0.0,
    borderJoinStyle: 'round',
    // pointBorderColor: key === 'account balance' ? 'black' : getColor(key),
    pointBackgroundColor: getColor(i),
    // pointBorderWidth: key === 'account balance' || false ? 6 : 5,
    // pointHoverRadius: 5,
    // pointHoverBackgroundColor: getColor(key),
    // pointHoverBorderColor: 'black',
    // pointHoverBorderWidth: 2,
    pointRadius: 0,
    // pointHitRadius: 10,


  }));

  return {
    chartData: {
      labels,
      datasets
    },
    curDate
  };

};





const App: React.FC = () => {
  const [clicked, setClicked] = useState(false);
  const [loadedVideo, setLoadedVideo] = useState(false);
  const [stockSocket, setStockSocket] = useState(null);
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    const socket = socketIOClient(`https://chiefsmurph.com`, {
      path: '/stocktips/socket.io',
      secure: true
    });
    socket.on('server:stock-data', (data: any) => {
      console.log({ data}, 'hiiii');
      setStockData(data);
    });
    setStockSocket(socket as any);
  }, []);
  if (!clicked) {
    return (
      <div className="click-here">
        <button onClick={() => setClicked(true)}>click here</button>
      </div>
    );
  }

  const { chartData, curDate } = stockDataToChartData(stockData);
  
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
        {
          stockData.length ? (
            <section>
              <h2>Stock Market</h2>
              <div style={{ height: '90vh' }}>
                <Line data={chartData} options={{ maintainAspectRatio: false, title: { display: true, text: `Trends for ${curDate}` }}} />
              </div>
            </section>
          ) : null
        }
      </main>
      <AutoPlayAudio/>
    </div>
  );
}

export default App;
