const express = require('express');
const readline = require('readline');

// const ffmpeg = require('fluent-ffmpeg');
const server = express();
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const path = require('path');

//ffmpeg
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;//multi platfom ffmpeg  
const ffmpeg = require('fluent-ffmpeg'); //fleunet ffmpeg module//
ffmpeg.setFfmpegPath(ffmpegPath);//set ffmpegt path

var ffprobe_static = require('ffprobe-static'); //ffmpeg probe module
ffmpeg.setFfprobePath(ffprobe_static.path);//module path



server.use('/', (req, res) => {
  res.send('Your Live Streaming Is All Ready Live');
});

async function startStreaming() {
  try {
    const streamkey = 'channel_stream_key_here'; 

    const video = path.join(__dirname, 'video_name_here.mp4'); // Assuming video.mp4 is in the same directory as your script

    console.log(video);


    const command = ffmpeg()
      .input(video)
      .videoCodec('libx264')
      // .outputOptions(['-pix_fmt', 'yuvj420p', '-maxrate', '2048k', '-preset', 'ultrafast', '-r', '12', '-framerate', '1', '-g', '50', '-crf', '51'])
      .outputOptions(['-pix_fmt', 'yuvj420p', '-maxrate', '6800k', '-bufsize', '6800k', '-preset', 'ultrafast', '-r', '12', '-framerate', '1', '-g', '50', '-crf', '51'])
      .audioCodec('aac')
      .audioBitrate('128k')
      .audioFrequency(44100)
      .audioCodec('aac')
      .outputFormat('flv')
      .output(`rtmp://a.rtmp.youtube.com/live2/${streamkey}`);

    command.on('start', (commandLine) => console.log('ffmpeg command:', commandLine));
    command.on('stderr', (stderr) => console.error('ffmpeg stderr:', stderr));
    command.on('end', () => console.log('Streaming ended.'));
    command.run();

    console.log('Live stream is ready');
  } catch (error) {
    console.error('Error starting the stream:', error);
  }
}



// Start streaming when the server starts
startStreaming();

server.listen(3000, () => console.log('Express server is running on http://localhost:3000'));
