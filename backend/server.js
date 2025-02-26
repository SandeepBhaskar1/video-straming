const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['https://video-straming-frontend.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'OPTIONS']
}));
app.use(express.json());

app.get('/video', (req, res) => {
  const videoPath = path.join(__dirname, 'videos', req.query.videoName);
  
  if (!fs.existsSync(videoPath)) {
    return res.status(404).send('Video not found');
  }

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});

app.get('/videos', (req, res) => {
  const videoDir = path.join(__dirname, 'videos');
  
  fs.readdir(videoDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read video directory' });
    }
    
    const videoFiles = files.filter(file => 
      ['.mp4', '.avi', '.mov', '.mkv'].includes(path.extname(file).toLowerCase())
    );
    
    res.json(videoFiles);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;