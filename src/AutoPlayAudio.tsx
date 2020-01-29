import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';

const playingFiles: string[] = [];
let playing = false;
const playNextFile = () => {
  console.log({ playingFiles })
  if (playing) return;
  const file = playingFiles.shift();
  if (!file) {
    playing = false;
    return;
  };
  playing = true;
  var audio = new Audio(`http://23.237.87.144:3008/audio/${file}`);
  audio.addEventListener('ended', () => {
    playing = false;
    playNextFile();
  });
  audio.play();
};
const playFile = (file: string) => {
  playingFiles.push(file);
  console.log('pushing ', file)
  playNextFile();
};

const AutoPlayAudio: React.FC = () => {
  const [fileToPlay, setFileToPlay] = useState(null);
  useEffect(() => {
    playFile('chiefsmurph-hey-gang.m4a');
    const socket = socketIOClient('http://23.237.87.144:3008');
    socket.emit('client:watch-user', 'chiefsmurph');
    socket.emit('client:request-profile', 'chiefsmurph', (data: any) => {
      const fileToPlay = data.publicMessages[0].fileName;
      console.log(fileToPlay, 'received');
      playFile(fileToPlay);
    });
    socket.on('server:new-watch-message', ({ message }: any) => {
      console.log(message, message.fileName)
      playFile(message.fileName);
    });
  }, []);

  return (
    <div className="autoplay-audio">
      autoplay
    </div>
  );
}

export default AutoPlayAudio;
