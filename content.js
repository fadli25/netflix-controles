// Netflix Video Controller Content Script
class NetflixController {
  constructor() {
    this.video = null;
    this.controlPanel = null;
    this.isVisible = false;
    this.hideTimeout = null;
    this.init();
  }

  init() {
    this.waitForVideo();
    this.createControlPanel();
    this.setupEventListeners();
    this.setupKeyboardShortcuts();
  }

  waitForVideo() {
    const checkForVideo = () => {
      this.video = document.querySelector("video");
      if (this.video) {
        console.log("Netflix video found");
        this.updateControlPanel();
      } else {
        setTimeout(checkForVideo, 1000);
      }
    };
    checkForVideo();
  }

  createControlPanel() {
    this.controlPanel = document.createElement("div");
    this.controlPanel.id = "netflix-controller";
    this.controlPanel.innerHTML = `
      <div class="controller-header">
        <span class="controller-title">Advanced Video Controls</span>
        <button class="toggle-btn" id="toggleController">×</button>
      </div>
      <div class="controller-content">
        <div class="playback-controls">
          <button class="control-btn" id="playPause">
            <span class="play-icon">▶</span>
            <span class="pause-icon" style="display: none;">⏸</span>
          </button>
          <button class="control-btn" id="restart">⏮</button>
          <button class="control-btn" id="skipBack">⏪</button>
          <button class="control-btn" id="skipForward">⏩</button>
          <button class="control-btn" id="loopToggle" title="Toggle Loop">🔄</button>
        </div>
        
        <div class="seek-controls">
          <button class="control-btn small" id="seek5back">-5s</button>
          <button class="control-btn small" id="seek10back">-10s</button>
          <button class="control-btn small" id="seek30back">-30s</button>
          <button class="control-btn small" id="seek30forward">+30s</button>
          <button class="control-btn small" id="seek60forward">+60s</button>
        </div>
        
        <div class="volume-controls">
          <button class="control-btn" id="muteToggle">
            <span class="volume-icon">🔊</span>
            <span class="mute-icon" style="display: none;">🔇</span>
          </button>
          <input type="range" id="volumeSlider" min="0" max="1" step="0.01" value="1">
          <span class="volume-display">100%</span>
        </div>
        
        <div class="speed-controls">
          <label>Speed:</label>
          <select id="speedSelect">
            <option value="0.25">0.25x</option>
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1" selected>1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="1.75">1.75x</option>
            <option value="2">2x</option>
            <option value="2.5">2.5x</option>
            <option value="3">3x</option>
          </select>
          <div class="speed-buttons">
            <button class="control-btn small" id="speedDown">-</button>
            <button class="control-btn small" id="speedUp">+</button>
            <button class="control-btn small" id="resetSpeed">1x</button>
          </div>
        </div>
        
        <div class="progress-controls">
          <input type="range" id="progressSlider" min="0" max="100" value="0" step="0.1">
          <div class="time-display">
            <span id="currentTime">0:00</span> / <span id="duration">0:00</span>
          </div>
          <div class="buffer-display">
            <span id="bufferInfo">Buffer: 0%</span>
            <span id="readyState">Ready: No</span>
          </div>
        </div>
        
        <div class="advanced-controls">
          <button class="control-btn" id="autoplayToggle" title="Toggle Autoplay">⏯</button>
          <button class="control-btn" id="controlsToggle" title="Show/Hide Native Controls">🎛</button>
          <button class="control-btn" id="pipDisableToggle" title="Toggle PiP Availability">📺</button>
          <button class="control-btn" id="qualityInfo" title="Video Quality Info">ℹ️</button>
        </div>
        
        <div class="extra-controls">
          <button class="control-btn" id="fullscreen">⛶</button>
          <button class="control-btn" id="pipToggle">⧉</button>
          <button class="control-btn" id="screenshot">📷</button>
          <button class="control-btn" id="frameStep" title="Frame Step">⏭</button>
        </div>
        
        <div class="info-panel" id="infoPanel" style="display: none;">
          <div class="info-content">
            <div><strong>Duration:</strong> <span id="infoDuration">--</span></div>
            <div><strong>Current Time:</strong> <span id="infoCurrentTime">--</span></div>
            <div><strong>Playback Rate:</strong> <span id="infoPlaybackRate">--</span></div>
            <div><strong>Volume:</strong> <span id="infoVolume">--</span></div>
            <div><strong>Ready State:</strong> <span id="infoReadyState">--</span></div>
            <div><strong>Network State:</strong> <span id="infoNetworkState">--</span></div>
            <div><strong>Video Size:</strong> <span id="infoVideoSize">--</span></div>
            <div><strong>Buffered:</strong> <span id="infoBuffered">--</span></div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.controlPanel);
    this.setupControlEvents();
  }

  setupControlEvents() {
    // Toggle controller visibility
    document
      .getElementById("toggleController")
      .addEventListener("click", () => {
        this.toggleController();
      });

    // Playback controls
    document.getElementById("playPause").addEventListener("click", () => {
      this.togglePlayPause();
    });

    document.getElementById("restart").addEventListener("click", () => {
      if (this.video) this.video.currentTime = 0;
    });

    document.getElementById("skipBack").addEventListener("click", () => {
      if (this.video) this.video.currentTime -= 10;
    });

    document.getElementById("skipForward").addEventListener("click", () => {
      if (this.video) this.video.currentTime += 10;
    });

    document.getElementById("loopToggle").addEventListener("click", () => {
      this.toggleLoop();
    });

    // Seek controls
    document.getElementById("seek5back").addEventListener("click", () => {
      if (this.video) this.video.currentTime -= 5;
    });

    document.getElementById("seek10back").addEventListener("click", () => {
      if (this.video) this.video.currentTime -= 10;
    });

    document.getElementById("seek30back").addEventListener("click", () => {
      if (this.video) this.video.currentTime -= 30;
    });

    document.getElementById("seek30forward").addEventListener("click", () => {
      if (this.video) this.video.currentTime += 30;
    });

    document.getElementById("seek60forward").addEventListener("click", () => {
      if (this.video) this.video.currentTime += 60;
    });

    // Volume controls
    document.getElementById("muteToggle").addEventListener("click", () => {
      this.toggleMute();
    });

    document.getElementById("volumeSlider").addEventListener("input", (e) => {
      if (this.video) {
        this.video.volume = parseFloat(e.target.value);
        this.updateVolumeDisplay();
      }
    });

    // Speed controls
    document.getElementById("speedSelect").addEventListener("change", (e) => {
      if (this.video) this.video.playbackRate = parseFloat(e.target.value);
    });

    document.getElementById("speedDown").addEventListener("click", () => {
      this.adjustSpeed(-0.25);
    });

    document.getElementById("speedUp").addEventListener("click", () => {
      this.adjustSpeed(0.25);
    });

    document.getElementById("resetSpeed").addEventListener("click", () => {
      if (this.video) {
        this.video.playbackRate = 1;
        document.getElementById("speedSelect").value = "1";
      }
    });

    // Progress control
    document.getElementById("progressSlider").addEventListener("input", (e) => {
      if (this.video) {
        const time = (parseFloat(e.target.value) / 100) * this.video.duration;
        this.video.currentTime = time;
      }
    });

    // Advanced controls
    document.getElementById("autoplayToggle").addEventListener("click", () => {
      this.toggleAutoplay();
    });

    document.getElementById("controlsToggle").addEventListener("click", () => {
      this.toggleNativeControls();
    });

    document
      .getElementById("pipDisableToggle")
      .addEventListener("click", () => {
        this.togglePiPDisable();
      });

    document.getElementById("qualityInfo").addEventListener("click", () => {
      this.toggleInfoPanel();
    });

    // Extra controls
    document.getElementById("fullscreen").addEventListener("click", () => {
      this.toggleFullscreen();
    });

    document.getElementById("pipToggle").addEventListener("click", () => {
      this.togglePiP();
    });

    document.getElementById("screenshot").addEventListener("click", () => {
      this.takeScreenshot();
    });

    document.getElementById("frameStep").addEventListener("click", () => {
      this.frameStep();
    });
  }

  setupEventListeners() {
    // Update controls when video state changes
    document.addEventListener("DOMContentLoaded", () => {
      this.waitForVideo();
    });

    // Listen for video events
    setInterval(() => {
      if (this.video) {
        this.updateProgress();
        this.updatePlayPauseIcon();
      }
    }, 1000);
  }

  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      // Only work when not typing in input fields
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;

      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault();
          this.togglePlayPause();
          break;
        case "m":
          this.toggleMute();
          break;
        case "f":
          this.toggleFullscreen();
          break;
        case "arrowleft":
          if (this.video) this.video.currentTime -= 10;
          break;
        case "arrowright":
          if (this.video) this.video.currentTime += 10;
          break;
        case "arrowup":
          e.preventDefault();
          if (this.video)
            this.video.volume = Math.min(1, this.video.volume + 0.1);
          this.updateVolumeDisplay();
          break;
        case "arrowdown":
          e.preventDefault();
          if (this.video)
            this.video.volume = Math.max(0, this.video.volume - 0.1);
          this.updateVolumeDisplay();
          break;
        case "c":
          this.toggleController();
          break;
      }
    });
  }

  toggleController() {
    this.isVisible = !this.isVisible;
    this.controlPanel.style.transform = this.isVisible
      ? "translateX(0)"
      : "translateX(100%)";
  }

  togglePlayPause() {
    if (!this.video) return;

    if (this.video.paused) {
      this.video.play();
    } else {
      this.video.pause();
    }
  }

  toggleMute() {
    if (!this.video) return;

    this.video.muted = !this.video.muted;
    this.updateVolumeDisplay();
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  async togglePiP() {
    if (!this.video) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await this.video.requestPictureInPicture();
      }
    } catch (error) {
      console.log("PiP not supported or failed:", error);
    }
  }

  takeScreenshot() {
    if (!this.video) return;

    const canvas = document.createElement("canvas");
    canvas.width = this.video.videoWidth;
    canvas.height = this.video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `netflix-screenshot-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  updateProgress() {
    if (!this.video) return;

    const progress = (this.video.currentTime / this.video.duration) * 100;
    document.getElementById("progressSlider").value = progress || 0;

    document.getElementById("currentTime").textContent = this.formatTime(
      this.video.currentTime
    );
    document.getElementById("duration").textContent = this.formatTime(
      this.video.duration
    );

    // Update buffer info
    this.updateBufferInfo();

    // Update info panel if visible
    const infoPanel = document.getElementById("infoPanel");
    if (infoPanel && infoPanel.style.display !== "none") {
      this.updateInfoPanel();
    }
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  updatePlayPauseIcon() {
    if (!this.video) return;

    const playIcon = document.querySelector(".play-icon");
    const pauseIcon = document.querySelector(".pause-icon");

    if (this.video.paused) {
      playIcon.style.display = "inline";
      pauseIcon.style.display = "none";
    } else {
      playIcon.style.display = "none";
      pauseIcon.style.display = "inline";
    }
  }

  updateVolumeDisplay() {
    if (!this.video) return;

    const volumeSlider = document.getElementById("volumeSlider");
    const volumeDisplay = document.querySelector(".volume-display");
    const volumeIcon = document.querySelector(".volume-icon");
    const muteIcon = document.querySelector(".mute-icon");

    volumeSlider.value = this.video.volume;
    volumeDisplay.textContent = Math.round(this.video.volume * 100) + "%";

    if (this.video.muted || this.video.volume === 0) {
      volumeIcon.style.display = "none";
      muteIcon.style.display = "inline";
    } else {
      volumeIcon.style.display = "inline";
      muteIcon.style.display = "none";
    }
  }

  updateControlPanel() {
    if (this.video) {
      this.updateProgress();
      this.updatePlayPauseIcon();
      this.updateVolumeDisplay();
    }
  }

  // New advanced methods using the video API
  toggleLoop() {
    if (!this.video) return;
    this.video.loop = !this.video.loop;
    const btn = document.getElementById("loopToggle");
    btn.style.background = this.video.loop
      ? "rgba(76, 175, 80, 0.3)"
      : "rgba(255, 255, 255, 0.1)";
    btn.title = this.video.loop ? "Loop: ON" : "Loop: OFF";
  }

  adjustSpeed(delta) {
    if (!this.video) return;
    const newRate = Math.max(
      0.25,
      Math.min(3, this.video.playbackRate + delta)
    );
    this.video.playbackRate = newRate;
    document.getElementById("speedSelect").value = newRate.toString();
  }

  toggleAutoplay() {
    if (!this.video) return;
    this.video.autoplay = !this.video.autoplay;
    const btn = document.getElementById("autoplayToggle");
    btn.style.background = this.video.autoplay
      ? "rgba(76, 175, 80, 0.3)"
      : "rgba(255, 255, 255, 0.1)";
    btn.title = this.video.autoplay ? "Autoplay: ON" : "Autoplay: OFF";
  }

  toggleNativeControls() {
    if (!this.video) return;
    this.video.controls = !this.video.controls;
    const btn = document.getElementById("controlsToggle");
    btn.style.background = this.video.controls
      ? "rgba(76, 175, 80, 0.3)"
      : "rgba(255, 255, 255, 0.1)";
    btn.title = this.video.controls
      ? "Native Controls: ON"
      : "Native Controls: OFF";
  }

  togglePiPDisable() {
    if (!this.video) return;
    this.video.disablePictureInPicture = !this.video.disablePictureInPicture;
    const btn = document.getElementById("pipDisableToggle");
    btn.style.background = this.video.disablePictureInPicture
      ? "rgba(244, 67, 54, 0.3)"
      : "rgba(255, 255, 255, 0.1)";
    btn.title = this.video.disablePictureInPicture
      ? "PiP: DISABLED"
      : "PiP: ENABLED";
  }

  frameStep() {
    if (!this.video) return;
    // Step forward by approximately 1/30th of a second (1 frame at 30fps)
    this.video.currentTime += 1 / 30;
  }

  toggleInfoPanel() {
    const infoPanel = document.getElementById("infoPanel");
    const isVisible = infoPanel.style.display !== "none";
    infoPanel.style.display = isVisible ? "none" : "block";

    if (!isVisible) {
      this.updateInfoPanel();
    }
  }

  updateInfoPanel() {
    if (!this.video) return;

    // Update all info fields
    document.getElementById("infoDuration").textContent = this.formatTime(
      this.video.duration
    );
    document.getElementById("infoCurrentTime").textContent = this.formatTime(
      this.video.currentTime
    );
    document.getElementById("infoPlaybackRate").textContent =
      this.video.playbackRate + "x";
    document.getElementById("infoVolume").textContent =
      Math.round(this.video.volume * 100) + "%";
    document.getElementById("infoReadyState").textContent =
      this.getReadyStateText(this.video.readyState);
    document.getElementById("infoNetworkState").textContent =
      this.getNetworkStateText(this.video.networkState);
    document.getElementById(
      "infoVideoSize"
    ).textContent = `${this.video.videoWidth}x${this.video.videoHeight}`;
    document.getElementById("infoBuffered").textContent =
      this.getBufferedText();
  }

  getReadyStateText(state) {
    const states = {
      0: "HAVE_NOTHING",
      1: "HAVE_METADATA",
      2: "HAVE_CURRENT_DATA",
      3: "HAVE_FUTURE_DATA",
      4: "HAVE_ENOUGH_DATA",
    };
    return states[state] || "Unknown";
  }

  getNetworkStateText(state) {
    const states = {
      0: "NETWORK_EMPTY",
      1: "NETWORK_IDLE",
      2: "NETWORK_LOADING",
      3: "NETWORK_NO_SOURCE",
    };
    return states[state] || "Unknown";
  }

  getBufferedText() {
    if (!this.video || !this.video.buffered.length) return "0%";

    const buffered = this.video.buffered;
    const duration = this.video.duration;
    let bufferedSeconds = 0;

    for (let i = 0; i < buffered.length; i++) {
      bufferedSeconds += buffered.end(i) - buffered.start(i);
    }

    const percentage = Math.round((bufferedSeconds / duration) * 100);
    return `${percentage}%`;
  }

  updateBufferInfo() {
    if (!this.video) return;

    const bufferInfo = document.getElementById("bufferInfo");
    const readyState = document.getElementById("readyState");

    if (bufferInfo) {
      bufferInfo.textContent = `Buffer: ${this.getBufferedText()}`;
    }

    if (readyState) {
      const isReady = this.video.readyState >= 3;
      readyState.textContent = `Ready: ${isReady ? "Yes" : "No"}`;
      readyState.style.color = isReady ? "#4caf50" : "#ff5722";
    }
  }
}

// Initialize the controller when the page loads
if (window.location.hostname.includes("netflix.com")) {
  const controller = new NetflixController();
}
