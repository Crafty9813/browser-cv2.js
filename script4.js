let video = document.getElementById("videoInput");
let streaming = false;
let frame, cap;

document.getElementById("startButton").addEventListener("click", () => {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "user" }, audio: false })
    .then((stream) => {
      video.srcObject = stream;
      return video.play();
    })
    .catch((err) => {
      console.error("Camera error:", err);
    });

  // Instead of onloadedmetadata, use 'playing' event which is more reliable for mobile
  video.addEventListener("playing", () => {
    // Only start once streaming flag is false (avoid multiple starts)
    if (streaming) return;

    const width = video.videoWidth;
    const height = video.videoHeight;

    if (width === 0 || height === 0) {
      console.error("Video dimensions are zero on playing event");
      return;
    }

    const canvas = document.getElementById("canvasOutput");
    canvas.width = width;
    canvas.height = height;

    streaming = true;

    if (frame) frame.delete();

    frame = new cv.Mat(height, width, cv.CV_8UC4);
    cap = new cv.VideoCapture(video);

    startVideoProcessing();
  });
});

function startVideoProcessing() {
  function processVideo() {
    if (!streaming) {
      if (frame) frame.delete();
      return;
    }

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    // Check for zeros
    if (videoWidth === 0 || videoHeight === 0) {
      console.warn("Video dimensions are zero!!! :(");
      requestAnimationFrame(processVideo);
      return;
    }

    const canvas = document.getElementById("canvasOutput");

    if (frame.cols !== videoWidth || frame.rows !== videoHeight) {
      frame.delete();
      frame = new cv.Mat(videoHeight, videoWidth, cv.CV_8UC4);
      canvas.width = videoWidth;
      canvas.height = videoHeight;
    }

    cap.read(frame);

    cv.imshow("canvasOutput", frame);

    requestAnimationFrame(processVideo);
  }
  requestAnimationFrame(processVideo);
}
