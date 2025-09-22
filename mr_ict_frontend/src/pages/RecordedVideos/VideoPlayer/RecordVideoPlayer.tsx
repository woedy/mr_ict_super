// RecordVideoPlayer.jsx
import React, { useRef, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../../../images/logo/mrict_logo.jpg';
import api from '../../../services/apiClient';
import RecDraggableWindow from '../../RecordLesson/Components/RecDraggableWindow';
import DraggableVideoWindow from '../Components/DraggableVideoWindow';
import TutorialPage from './Editor/TutorialPage';

const RecordVideoPlayer = () => {
  // State for video and code data
  const [videoUrl, setVideoUrl] = useState('');
  const [codeTimelineData, setCodeTimelineData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoError, setVideoError] = useState(null);

  // Player state
  const [currentCode, setCurrentCode] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const requestAnimationRef = useRef(null);

  // HTML Preview state
  const [htmlOutput, setHtmlOutput] = useState('');
  const [showPreviewWindow, setShowPreviewWindow] = useState(true);

  // Editor state with precise tracking
  const [editedCode, setEditedCode] = useState(null);
  const [cursorPosition, setCursorPosition] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(null);

  // Important refs for synchronization
  const lastSyncTimeRef = useRef(0);
  const forceScrollSyncRef = useRef(false);



  const location = useLocation();
  const navigate = useNavigate();
  // Fetch data from server
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams(location.search);
        const id = params.get('id');
        if (!id) {
          setError('Missing recording id');
          setIsLoading(false);
          return;
        }

        const response = await api.get(`recordings/${id}/`);
        const data = response.data?.data || {};

        const url = data.video_url || '';
        const fullUrl = url.startsWith('http')
          ? url
          : ((import.meta as any).env?.VITE_MEDIA_BASE || '') + url;
        setVideoUrl(fullUrl);

        const sortedSnippets = [...(data.code_snippets || [])].sort(
          (a, b) => a.timestamp - b.timestamp,
        );
        setCodeTimelineData(sortedSnippets);

        if (sortedSnippets.length > 0) {
          setCurrentCode(sortedSnippets[0].code_content);
          setHtmlOutput(sortedSnippets[0].code_content);
          setEditedCode(sortedSnippets[0].code_content);
          setCursorPosition(sortedSnippets[0].cursor_position);
          setScrollPosition(sortedSnippets[0].scroll_position);
        }

        setIsLoading(false);
      } catch (err) {
        setError('Failed to load recording');
        setIsLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [location.search]);









  // Update HTML output when current code changes
  useEffect(() => {
    setHtmlOutput(currentCode);
  }, [currentCode]);





  // Enhanced code sync with interpolation
  const syncCodeWithTime = (time) => {
    if (!codeTimelineData.length) return;

    let appropriateSnippet = codeTimelineData[0];
    let nextSnippet = null;

    // Find the most recent snippet and the next one for interpolation
    for (let i = 0; i < codeTimelineData.length; i++) {
      const snippet = codeTimelineData[i];
      if (snippet.timestamp <= time) {
        appropriateSnippet = snippet;
        if (i + 1 < codeTimelineData.length) {
          nextSnippet = codeTimelineData[i + 1];
        }
      } else {
        nextSnippet = snippet;
        break;
      }
    }

    // Update code and cursor
    setCurrentCode(appropriateSnippet.code_content);
    setEditedCode(appropriateSnippet.code_content);
    setCursorPosition(appropriateSnippet.cursor_position);

    // Enhanced scroll position interpolation
    let scrollPos = { ...appropriateSnippet.scroll_position };

    // Only interpolate if we have a next snippet and we're between two timestamps
    if (
      nextSnippet &&
      time > appropriateSnippet.timestamp &&
      time < nextSnippet.timestamp
    ) {
      const timeDiff = nextSnippet.timestamp - appropriateSnippet.timestamp;

      // Only interpolate if the time difference is meaningful
      if (timeDiff > 0.1) {
        const progress = (time - appropriateSnippet.timestamp) / timeDiff;

        // Apply easing function for more natural scrolling
        const easeProgress =
          progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        // Ensure scroll positions are numbers before interpolation
        const startTop = appropriateSnippet.scroll_position.scrollTop || 0;
        const endTop = nextSnippet.scroll_position.scrollTop || 0;
        const startLeft = appropriateSnippet.scroll_position.scrollLeft || 0;
        const endLeft = nextSnippet.scroll_position.scrollLeft || 0;

        scrollPos = {
          scrollTop: startTop + (endTop - startTop) * easeProgress,
          scrollLeft: startLeft + (endLeft - startLeft) * easeProgress,
          timestamp: time, // Add timestamp for debugging
        };
      }
    }

    setScrollPosition(scrollPos);

    // Force sync with the editor's scroll position
    // This is the key to making the scroll sync work reliably
    forceScrollSyncRef.current = true;
    lastSyncTimeRef.current = time;

    console.log(`[syncCodeWithTime] time: ${time.toFixed(2)}, scrollPos: ${JSON.stringify(scrollPos)}`); // Add logging
    setScrollPosition(scrollPos);
  };
  

  // Animation frame loop for smooth time tracking
  const updateTimeDisplay = () => {
    if (videoRef.current && isPlaying) {
      const newTime = videoRef.current.currentTime;
      setCurrentTime(newTime);

      // Sync more frequently (lower threshold)
      if (Math.abs(newTime - lastSyncTimeRef.current) >= 0.05) {
        syncCodeWithTime(newTime);
      }

      requestAnimationRef.current = requestAnimationFrame(updateTimeDisplay);
    }
  };

  // Start/stop animation frame loop
  useEffect(() => {
    if (isPlaying) {
      requestAnimationRef.current = requestAnimationFrame(updateTimeDisplay);
    } else if (requestAnimationRef.current) {
      cancelAnimationFrame(requestAnimationRef.current);
    }

    return () => {
      if (requestAnimationRef.current) {
        cancelAnimationFrame(requestAnimationRef.current);
      }
    };
  }, [isPlaying]);

  // Handle play/pause
  const togglePlayPause = () => {
    if (!videoRef.current || !canPlay) return;

    try {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        syncCodeWithTime(videoRef.current.currentTime);
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setVideoError(null))
            .catch((err) => {
              setVideoError(`Failed to play video: ${err.message}`);
              setIsPlaying(false);
              console.error('Video playback error:', err);
            });
        }
      }
      setIsPlaying(!isPlaying);
    } catch (err) {
      setVideoError(`Error controlling video: ${err.message}`);
      console.error('Video control error:', err);
    }
  };

  // Enhanced seeking handler
  const handleSeek = (e) => {
    if (!videoRef.current) return;

    const seekTime = parseFloat(e.target.value);
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
    syncCodeWithTime(seekTime);
  };

  // Video event handlers
  const handleVideoPlay = () => setIsPlaying(true);
  const handleVideoPause = () => setIsPlaying(false);
  const handleVideoEnded = () => setIsPlaying(false);
  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const videoTime = videoRef.current.currentTime;
      setCurrentTime(videoTime);
      syncCodeWithTime(videoTime); // Sync immediately
      console.log(`[handleTimeUpdate] videoTime: ${videoTime.toFixed(2)}`); // Add logging
    }
  };

  const handleCanPlay = () => {
    setCanPlay(true);
    setVideoError(null);
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      syncCodeWithTime(videoRef.current?.currentTime || 0);
    }
  };

  const handleVideoError = (e) => {
    const video = videoRef.current;
    let errorMessage = 'Unknown video error';
    if (video && video.error) {
      switch (video.error.code) {
        case 1:
          errorMessage = 'Video loading aborted';
          break;
        case 2:
          errorMessage = 'Network error, check your connection';
          break;
        case 3:
          errorMessage = 'Video decoding failed - format may not be supported';
          break;
        case 4:
          errorMessage = 'Video not found or access denied';
          break;
        default:
          errorMessage = `Video error: ${video.error.message}`;
      }
    }
    setVideoError(errorMessage);
    setCanPlay(false);
    console.error('Video error:', errorMessage);
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === null || seconds === undefined)
      return '00:00';
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Calculate seek bar gradient percentage
  const calculateSeekPercentage = () => {
    if (duration <= 0) return 0;
    return (currentTime / duration) * 100;
  };

  const pauseVideo = () => {
    if (videoRef.current && isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleCodeChange = (newCode) => {
    setEditedCode(newCode);
  };

  const runCode = () => {
    setHtmlOutput(editedCode);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="text-lg text-gray-600">Loading tutorial...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      <header className="bg-boxdark text-white px-4 py-2 h-16 flex justify-between items-center absolute top-0 left-0 right-0 z-20">
        <div className="flex items-center space-x-4 flex-1">
          <Link to="/dashboard">
            <img className="h-10 rounded-md" src={Logo} alt="Logo" />
          </Link>
        </div>
      </header>

      <div className="flex-grow relative overflow-hidden">
        <div className="absolute inset-0 translate-y-[-24px]">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src={videoUrl}
            onPlay={handleVideoPlay}
            onPause={handleVideoPause}
            onEnded={handleVideoEnded}
            onCanPlay={handleCanPlay}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onError={handleVideoError}
            controls={false}
            playsInline
            preload="auto"
          >
            Your browser does not support the video tag.
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="video/webm" />
            <source src={videoUrl} type="video/ogg" />
          </video>
        </div>

        {videoError && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-30">
            <div className="text-white text-center">
              <p className="font-medium mb-2">Video Error</p>
              <p className="text-sm">{videoError}</p>
              <p className="text-xs mt-2">
                Try a different browser or check the video format
              </p>
              <button
                className="mt-3 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.load();
                    setVideoError(null);
                  }
                }}
              >
                Try reloading
              </button>
            </div>
          </div>
        )}

        <div
          className={`absolute inset-0 z-20 ${
            isPlaying ? 'opacity-25' : 'opacity-100'
          } transition-opacity duration-300`}
        >
          <TutorialPage
            value={editedCode}
            onEditorInteraction={pauseVideo}
            onCodeChange={handleCodeChange}
            cursorPosition={cursorPosition}
            scrollPosition={scrollPosition}
            forceScrollSync={forceScrollSyncRef.current}
            onScrollSyncComplete={() => {
              forceScrollSyncRef.current = false;
            }}
            onScrollChange={(scrollPos) => {
              // Store user scroll positions for potential future features
              console.log('Editor scrolled:', scrollPos);
            }}
          />
        </div>
      </div>

      <div className="bg-black bg-opacity-50 px-2 py-1 flex items-center space-x-4 z-30 relative">
        <button
          className={`px-4 py-1 rounded font-medium text-xs flex items-center ${
            !canPlay
              ? 'bg-white text-white cursor-not-allowed'
              : isPlaying
              ? 'bg-green text-white'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          onClick={togglePlayPause}
          disabled={!canPlay}
        >
          {isPlaying ? (
            <>
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Pause
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
              Play
            </>
          )}
        </button>

        <div className="flex-1 flex items-center space-x-2">
          <span className="text-white text-xs">{formatTime(currentTime)}</span>
          <div className="flex-1">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-400 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #4caf50 ${calculateSeekPercentage()}%, #808080 ${calculateSeekPercentage()}%)`,
              }}
              disabled={!canPlay}
              step="0.01"
            />
          </div>
          <span className="text-white text-xs">{formatTime(duration)}</span>
        </div>

        <button
          className="px-4 py-2 rounded text-xs font-medium flex items-center bg-green-600 text-white hover:bg-green-700"
          onClick={runCode}
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Run
        </button>

        <button
          className="px-4 py-1 rounded font-medium text-xs flex items-center bg-slate-50 text-gray-700 hover:bg-gray-400"
          onClick={() => setShowPreviewWindow(!showPreviewWindow)}
        >
          {showPreviewWindow ? 'Hide Preview' : 'Show Preview'}
        </button>

        <DraggableVideoWindow video={videoUrl} />
      </div>

      {showPreviewWindow && (
        <div className="absolute z-30">
          <RecDraggableWindow htmlContent={htmlOutput} title="HTML Preview" />
        </div>
      )}
    </div>
  );
};

export default RecordVideoPlayer;
