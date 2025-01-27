import React, { useState, useEffect } from 'react';
import '../App.css';  

const BACKEND_URL = import.meta.env.PROD 
  ? 'https://video-straming-backend.vercel.app' 
  : 'http://localhost:5000' || 'http://localhost:2999'

function VideoStreamer() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/videos`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }
        
        const data = await response.json();
        setVideos(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to fetch videos');
      }
    };

    fetchVideos();
  }, []);

  const handleVideoSelect = (videoName) => {
    setSelectedVideo(videoName);
    const streamUrl = `${BACKEND_URL}/video?videoName=${encodeURIComponent(videoName)}`;
    setVideoUrl(streamUrl);
  };

  const videoNameMap = {
    'the-fast-and-furious.mp4': 'The Fast and Furious',
    '2-fast-furious.mp4': '2 Fast 2 Furious',
    'tokyo-drift.mp4': 'Tokyo Drift',
    'fast-furious-4.mp4': 'Fast & Furious',
    'fast-5.mp4': 'Fast Five',
    'fast-furious-6.mp4': 'Fast & Furious 6',
    'furious-7.mp4': 'Furious 7',
    'furious-8.mp4': 'The Fate of the Furious',
    'fast-furious-9.mp4': 'F9',
    'fast-x.mp4': 'Fast X',
  };

  const customOrder = [
    'the-fast-and-furious.mp4',
    '2-fast-furious.mp4',
    'tokyo-drift.mp4',
    'fast-furious-4.mp4',
    'fast-5.mp4',
    'fast-furious-6.mp4',
    'furious-7.mp4',
    'furious-8.mp4',
    'fast-furious-9.mp4',
    'fast-x.mp4',
  ];

  const orderedVideos = customOrder.filter(video => videos.includes(video));

  return (
    <div className="video-container">
      <h1 className="video-title">The Fast And Furious Movie Series Trailers</h1>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {videoUrl && (
        <div className="video-player-container">
          <video 
            controls 
            src={videoUrl} 
            className="video-player"
            autoPlay 
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      <div className="video-button-container">
        {orderedVideos.map((video) => (
          <button 
            key={video}
            onClick={() => handleVideoSelect(video)}
            className="video-button"
          >
            {videoNameMap[video] || video.replace('.mp4', '').replace('-', ' ').toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

export default VideoStreamer;
