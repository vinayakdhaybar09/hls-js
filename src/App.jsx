import { useEffect, useRef } from "react";
// import "./App.css";
// import sampleVideo from "./assets/samplevideo.m3u8";
import Hls from "hls.js";
// import Plyr from "plyr";

function App() {
  const videoRef = useRef(null);
  const Plyr = window.Plyr;

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      const defaultOptions = {};
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource("https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8");

        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          const availableQualities = hls.levels.map((l) => l.height);

          // from plyr
          defaultOptions.controls = [    
            "play-large", // The large play button in the center
            "restart", // Restart playback
            "rewind", // Rewind by the seek time (default 10 seconds)
            "play", // Play/pause playback
            "fast-forward", // Fast forward by the seek time (default 10 seconds)
            "progress", // The progress bar and scrubber for playback and buffering
            "current-time", // The current time of playback
            "duration", // The full duration of the media
            "mute", // Toggle mute
            "volume", // Volume control
            "captions", // Toggle captions
            "settings", // Settings menu
            "pip", // Picture-in-picture (currently Safari only)
            "airplay", // Airplay (currently Safari only)
            "download", // Show a download button with a link to either the current source or a custom URL you specify in your options
            "fullscreen", // Toggle fullscreen
          ];
          defaultOptions.quality = {
            default: availableQualities[0],      // will choose first quality
            options: availableQualities,          // all qualities
            forced: true,
            onchange: (e) => updateQuality(e),
          };
          new Plyr(video, defaultOptions);
          // video.play();
        });
        hls.attachMedia(video);
        window.hls = hls;
      }
    }
  }, [Plyr]);

  //changing video quality
  const updateQuality = (newQuality) => {
    window.hls.levels.forEach((level, levelIndex) => {
      if (level.height === newQuality) {
        window.hls.currentLevel = levelIndex;
      }
    });
  };

  return (
    <div>
      <h1>sample video</h1>
      <div style={{ width: "750px", height: "500px" }}>
        <video width="100%" height="100%" controls ref={videoRef}></video>
      </div>
    </div>
  );
}

export default App;
