import React, { useState, useEffect } from 'react';

// Replace with your actual backend URL
const BACKEND_URL = import.meta.env.PROD 
  ? 'https://your-backend-deployment-url.vercel.app' 
  : 'http://localhost:5000'

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

  const handleVideoSelect = (event) => {
    setSelectedVideo(event.target.value);
    setVideoUrl('');
  };

  const streamVideo = () => {
    if (selectedVideo) {
      const streamUrl = `${BACKEND_URL}/video?videoName=${encodeURIComponent(selectedVideo)}`;
      setVideoUrl(streamUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Video Streamer</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4 flex space-x-2">
          <select 
            value={selectedVideo} 
            onChange={handleVideoSelect}
            className="flex-grow border rounded p-2"
          >
            <option value="">Select a Video</option>
            {videos.map((video) => (
              <option key={video} value={video}>{video}</option>
            ))}
          </select>
          
          <button 
            onClick={streamVideo}
            disabled={!selectedVideo}
            className="bg-blue-500 text-white px-4 py-2 rounded 
                       hover:bg-blue-600 disabled:bg-gray-300"
          >
            Stream Video
          </button>
        </div>

        {videoUrl && (
          <div className="mt-4">
            <video 
              controls 
              src={videoUrl} 
              className="w-full rounded-lg shadow-md"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoStreamer;