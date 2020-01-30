import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';

const playingFiles: any[] = [];
let playing: string | undefined;
const playNextFile = () => {
  console.log({ playingFiles })
  
  if (playing) return;
  const file = playingFiles.shift();
  console.log({ file })
  if (!file) {
    playing = undefined;
    return;
  };
  playing = file;
  console.log(file.fileName, 'now')
  var audio = new Audio(`http://23.237.87.144:3008/audio/${file.fileName}`);
  audio.addEventListener('ended', () => {
    playing = undefined;
    playNextFile();
  });
  audio.play();
};
const playFile = (file: any) => {
  playingFiles.push(file);
  console.log('pushing ', file)
  playNextFile();
};

const AutoPlayAudio: React.FC = () => {
  const [userCount, setUserCount] = useState(0);
  const [playingFile, setPlayingFile] = useState(0);
  const [fileQueue, setFileQueue] = useState([]);

  useEffect(() => {
    const playFile = (file: any) => {
      // fileQueue.push(file);
      // if (!playingFile) {
      //   console.log(`hurry up`)
      //   setPlayingFile(file);
      // } else {
        // add to end of queue
        setFileQueue(fileQueue => [
          ...fileQueue,
          file
        ] as never[]);
      // }
    };

    const socket = socketIOClient('http://23.237.87.144:3008');
    socket.emit('client:watch-user', 'chiefsmurph');
    socket.emit('client:request-profile', 'chiefsmurph', (data: any) => {
      console.log({ data })
      const fileToPlay = data.publicMessages[0];
      playFile(data.publicMessages.find((m: any) => m._id === "5e30e5436b6e6b5889666f4c"));
      playFile(fileToPlay);
    });
    socket.on('server:new-watch-message', ({ message }: any) => {
      console.log(message, message.fileName)
      playFile(message);
    });
    socket.on('server:user-count-change', ({ userCount }: any) => {
      setUserCount(userCount);
    });
    // return () => {
    //   socket.off('server:new-watch-message');
    //   socket.off('server:user-count-change');
    // }
  }, []);

  // const playNextFile = () => {
  //   const firstFile = fileQueue[0];
  //   if (!firstFile) return;
  //   setPlayingFile(firstFile);
  //   setFileQueue(fileQueue.slice(1));
  // };

  useEffect(() => {
    console.log('yo', {
      playingFile,
      length: fileQueue
    })
    const playNext = () => setPlayingFile(count => count + 1);
    if (playingFile != fileQueue.length - 1) return console.log('not happening');
    const file = fileQueue[playingFile];
    console.log({ playingFile, file})
    var audio = new Audio(`http://23.237.87.144:3008/audio/${(file || {} as any).fileName}`);
    audio.addEventListener('ended', () => {
      // playNextFile();
      console.log('increasing')
      playNext();
    });
    audio.play();
  }, [fileQueue, playingFile]);
  const fileObj = fileQueue[playingFile] as any;
  return (
    <div className="autoplay-audio">
      <b>Users On Right Now: { userCount }</b><br/>
      { fileObj && (
        <div>
          <b>Playing File: { fileObj.fileName }</b><br/>
          {
            fileObj.timestamp && ( <small>{(new Date(fileObj.timestamp)).toLocaleString()}</small> )
          }
        </div>
      )}
    </div>
  );
}

export default AutoPlayAudio;