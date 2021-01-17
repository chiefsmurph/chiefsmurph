import React, { useState, useEffect } from 'react';
import AutoPlayAudio from './AutoPlayAudio';
import projects from './projects';

import { Line } from 'react-chartjs-2';

import socketIOClient from 'socket.io-client';

import logo from './logo.svg';
import './App.css';

import ReactGA from 'react-ga';

import useCookie from '@devhammed/use-cookie'

import NbaSection from './NbaSection';

ReactGA.initialize('UA-131761952-2');
ReactGA.pageview(window.location.pathname + window.location.search);



const getColor = (i: number) => ['black', 'green', 'blue', 'orange', 'black', 'violet', 'pink', 'black', 'orange', 'blue', 'green'][i];
const karateDataToChartData = (karateData: any) => {

  if (!karateData || !karateData.length) {
    return {
      chartData: []
    };
  }

  const curDate = (new Date(karateData[karateData.length - 1].time)).toLocaleDateString();
  const labels = karateData.map((r: any) => (new Date(r.time)).toLocaleTimeString());
  const dataKeys = Object.keys(karateData[0])
    .filter(key => key !== 'time')
    // .sort((a, b) => {
    //   const first = 'chiefsmurph';
    //   return a === first ? -1 : b === first ? 1 : 0; 
    // });
  console.log({ dataKeys })
  const datasets = dataKeys.map((key, i) => ({
    label: key,
    data: karateData.map((r: any) => r[key]),
    fill: key === 'sp500' ? 'origin' : false,
    // background
    lineTension: key.includes('balance') ? 0 : 0,
    backgroundColor: 'rgba(75,192,192,0.3)',
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

  console.log(datasets)

  let { time, ...curTrends } = karateData[karateData.length - 1];
  curTrends = Object.keys(curTrends)
    .map(key => ({
      key,
      trend: curTrends[key]
    }))
    .sort((a, b) => b.trend - a.trend);

  return {
    chartData: {
      labels,
      datasets
    },
    curDate,
    curTrends
  };

};

const pruneByDays = (data: any, numDays: any) => {
  const response: any = [];
  let inc = 0;
  const pruneEvery = (numDays - 1) * 3 || 1;
  data.forEach((value: any, index: number) => {
      inc++;
      if (inc % pruneEvery === 0 || index === 0 || index === data.length - 1) {
          response.push(value);
      }
  })
  return response;

};

const formatData = (data: any) => {
  console.log({ data })
  const width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const pruneBy =  Math.floor(data.length / width) * 3;
  const renamed = data.map(({ alpacaBalance, ...rest }: any) => ({
    // chiefsmurph: alpacaBalance,
    ...rest,
  }));
  console.log({
    length: data.length,
    width,
    pruneBy
  })
  return data.length > width / 2
    ? pruneByDays(renamed, pruneBy)
    : renamed;
};

type Recommendations = {

};

interface CheapestPicks {
  label: string;
  data: any[]
};

const formatAlert = (recommendations: any = {}, cheapestPicks?: CheapestPicks | null) => {
  console.log({ recommendations, cheapestPicks })
  return [
    Object.entries(recommendations).map(entry => entry.join(' - ')).join('\n'),
    ...cheapestPicks ? [cheapestPicks.data.map(({ ticker, last_trade_price, trend_since_prev_close }: any) => 
      `${ticker}${' '.repeat(7 - ticker.length)} - $${last_trade_price} (${trend_since_prev_close > 0 ? '+' : ''}${trend_since_prev_close}%)`
    ).join('\n')] : []
  ].filter(Boolean).join('\n\n');
};



const App: React.FC = () => {
  const [clicked, setClicked] = useState(true);
  const [loadedVideo, setLoadedVideo] = useState(false);
  const [karateSocket, setKarateSocket] = useState();
  const [auth, setAuth] = useState(null);
  const [karateData, setKarateData] = useState(undefined as any);
  const [cheapestPicks, setCheapestPicks] = useState(null);

  const [blauthString, setblauthString, deleteblauthString] = useCookie('blauthString', 'basic');
  const [publicData, setPublicData] = useState();
  const [weatherData, setWeatherData] = useState();
  useEffect(() => {
    const socket = socketIOClient(`https://chiefsmurph.com`, {
      path: '/karatetips/socket.io',
      secure: true
    });
    setKarateSocket(socket as any);
    fetch('https://chiefsmurph.com/weather/').then(response => response.json()).then(setWeatherData);
  }, []);

  useEffect(() => {
    if (!karateSocket) return;
    karateSocket.on('server:public-data', setPublicData);
    karateSocket.on('server:cheapest', (cheapest: any) => {
      console.log({ cheapest });
      setCheapestPicks(cheapest);
    });
    karateSocket.on('server:karate-data', (data: any) => {
      console.log({ data, karateData})
      setKarateData({
        ...karateData,
        ...data,
        ...data.chartData && { chartData: formatData(data.chartData) }
      });
    });
    if (blauthString) {
      console.log({ blauthString })
      karateSocket.emit('client:auth', blauthString);
    }
  }, [karateSocket]);

  if (!clicked) {
    return (
      <div className="click-here">
        <button onClick={() => setClicked(true)}>click here</button>
      </div>
    );
  }

  const alertRecs = () => window.alert(
    formatAlert(karateData.recommendations)
  );
  
  const alertCheapest = () => window.alert(formatAlert(undefined, cheapestPicks))
  const hit = () => {
    const response = window.prompt('how about it?');
    setblauthString(response);
    if (karateSocket) {
      karateSocket.emit('client:auth', response);
    }
  };
  console.log({ karateData });

  const { chartData, curDate, curTrends = [] } = karateDataToChartData((karateData || {}).chartData);
  console.log('bam')

  const isAuth = Boolean(karateData);
  return (
    <div className="App">
      <header>
        <div>
          {/* <img src={MeTransparent} /> */}
          
          {/* <video loop autoPlay muted poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" style={{ visibility: loadedVideo ? 'visible' : 'hidden' }} onLoadedData={() => setTimeout(() => setLoadedVideo(true), 300)}>
            <source src="https://chiefsmurph.com/memovingcrop.mp4" type="video/mp4" />
            <source src="https://chiefsmurph.com/memovingcrop.mp4" type="video/ogg" />
            Your browser does not support the video tag.
        </video> */}
        </div>
        <h1>chie<span onClick={hit}>f</span>smurph.com</h1>
      </header>

      
      <div className="second-row">
        <a href="https://github.com/chiefsmurph" className="github">Github</a>
        <a href="https://linkedin.com/in/chiefsmurph" className="linkedIn">LinkedIn</a>
        <div/>
      </div>
      <main>

        <div className="side-by-side">
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
          weatherData && (
            <section>
              <h2>About you</h2>
              <ul>
                {Object.entries(weatherData).map(([key, value]) => (
                  <li>{key}: {value}</li>
                ))}
              </ul>
            </section>
          )
        }
        {
          karateData && curDate ? (
            <section>
              <h2>{karateData.section}</h2>
              <a onClick={evt => { alertRecs(); evt.preventDefault(); }} href="#">
                {karateData.label}
              </a>
              <br/>
              {Boolean(cheapestPicks && cheapestPicks.data.length) && 
                <a onClick={evt => { alertCheapest(); evt.preventDefault(); }} href="#">
                  {cheapestPicks.label}
                </a>
              }
              <ul style={{ listStyleType: 'none', padding: '0 0.5em', fontSize: '80%' }}>
                {
                  curTrends.map(({ key: indexName, trend }: any) => (
                    <li style={{ fontWeight: indexName === 'chiefsmurph' ? 'bold' : 'initial', color: trend > 0 ? 'green' : 'red' }}>{trend > 0 ? '+' : ''}{trend}% - {indexName}</li>
                  ))
                }
              </ul>
            </section>
          ) : null
        }

        <NbaSection/>

          {/* <section>
            <h2>My Music</h2>
            <a onClick={() => {
              const evt = new CustomEvent('playSong', { detail: 'whats-up.mp3' });
              document.dispatchEvent(evt);
              karateSocket.emit('client:log', 'playing whats up');
              setTimeout(() => {
                const evt = new CustomEvent('stopAudio');
                document.dispatchEvent(evt);
                console.log(';stopp')
              }, 5000);
            }} style={{ cursor: 'pointer' }}>"Whats Up"</a>
          </section> */}
          
        </div>
        
        {
          karateData && curDate ? (
            <div style={{ height: '80vh' }}>
              <Line 
                data={chartData} 
                options={{ 
                  maintainAspectRatio: false, 
                  title: { 
                    display: true, 
                    text: `Trends for ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][(new Date(curDate)).getDay()]} ${curDate}`, 
                    // fontFamily: "'Raleway', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;",
                    fontSize: 20
                  },
                  legend: {
                    labels: {
                      filter: function(item: any) {
                        return !item.text.includes('zero');
                      }
                    }
                  },
                  scales: {
                    yAxes: [{
                      scaleLabel: {
                        display: true,
                        labelString: 'trend since previous close',
                        fontSize: 17,
                        
                      },
                      ticks: {
                        fontSize: 20,
                        callback: function(value: any) {
                          return value + '%';
                        }
                      }
                    }]
                  },
                  fill: true
                }} />
            </div>
          ) : null
        }

      </main>
    </div>
  );
}

export default App;
