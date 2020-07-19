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
  const dataKeys = Object.keys(stockData[0])
    .filter(key => key !== 'time')
    // .sort((a, b) => {
    //   const first = 'chiefsmurph';
    //   return a === first ? -1 : b === first ? 1 : 0; 
    // });
  console.log({ dataKeys })
  const datasets = dataKeys.map((key, i) => ({
    label: key,
    data: stockData.map((r: any) => r[key]),
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

  let { time, ...curTrends } = stockData[stockData.length - 1];
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



const App: React.FC = () => {
  const [clicked, setClicked] = useState(true);
  const [loadedVideo, setLoadedVideo] = useState(false);
  const [stockSocket, setStockSocket] = useState(null);
  const [stockData, setStockData] = useState(undefined as any);

  useEffect(() => {
    const socket = socketIOClient(`https://chiefsmurph.com`, {
      path: '/stocktips/socket.io',
      secure: true
    });
    socket.on('server:stock-data', (data: any) => {
      console.log({ data}, 'hiiii');
      setStockData({
        ...data,
        chartData: formatData(data.chartData)
      });
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

  const alertRecs = () => {
    window.alert(JSON.stringify(stockData.recommendations, null, 2));
  };

  console.log({ stockData });

  const { chartData, curDate, curTrends = [] } = stockDataToChartData((stockData || {}).chartData);
  
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
        <h1>chiefsmurph.com</h1>
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
          stockData && curDate ? (
            <section>
              <h2>Stock Market</h2>
              <a onClick={evt => { alertRecs(); evt.preventDefault(); }} href="#">Click here for my list of penny stocks to watch</a>
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
        </div>
        
        {
          stockData && curDate ? (
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
      <AutoPlayAudio/>
    </div>
  );
}

export default App;
