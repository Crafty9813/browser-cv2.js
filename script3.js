// Based from the OpenCV.js documentation:
// https://docs.opencv.org/4.x/dd/d00/tutorial_js_video_display.html

let video = document.getElementById("videoInput");
let streaming = false;
let frame = null;
let cap = null;

document.getElementById("startButton").disabled = true; // Disable btn

//USED IN INDEX.HTML- onload
function onReady() {
  console.log("OpenCV ready! :D");
  document.getElementById("startButton").disabled = false; // Enable button if ocv ready
}

//Button testing...
document.getElementById("startButton").addEventListener("click", () => {
  //User webcam access request
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "user" }, audio: false })
    .then((stream) => {
      video.srcObject = stream;
      return video.play();
    })
    .catch((err) => {
      console.error("Camera error:", err);
    });

  // Wait for data like video width, height, etc. to load
  video.onloadedmetadata = () => {
    function waitForVideoDimensions() {
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        requestAnimationFrame(waitForVideoDimensions);
        return;
      }

      const width = video.videoWidth;
      const height = video.videoHeight;

      const canvas = document.getElementById("canvasOutput");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      streaming = true;

      if (frame) frame.delete();

      frame = new cv.Mat(height, width, cv.CV_8UC4);
      cap = new cv.VideoCapture(video);

      startVideoProcessing();
    }
    waitForVideoDimensions();
  };
});

function startVideoProcessing() {
  function processVideo() {
    if (!streaming) {
      if (frame) frame.delete();
      return;
    }

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    const canvas = document.getElementById("canvasOutput");

    // Resize frame & canvas if size changed
    if (frame.cols !== videoWidth || frame.rows !== videoHeight) {
      frame.delete();
      frame = new cv.Mat(videoHeight, videoWidth, cv.CV_8UC4);
      canvas.width = videoWidth;
      canvas.height = videoHeight;
    }

    cap.read(frame);

    let gray = new cv.Mat();
    let blurred = new cv.Mat();
    let edges = new cv.Mat();

    cv.cvtColor(frame, gray, cv.COLOR_RGBA2GRAY);
    cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
    cv.Canny(blurred, edges, 20, 120);

    cv.imshow("canvasOutput", edges); // DISPLAY OUTPUT (PROCESSED) FEED

    //Frees up memory
    gray.delete();
    blurred.delete();
    edges.delete();

    requestAnimationFrame(processVideo); // Updates frame to match screen refresh rate
  }
  requestAnimationFrame(processVideo);
}
