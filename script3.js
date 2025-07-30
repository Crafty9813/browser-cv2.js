// Based from the OpenCV.js documentation:
// https://docs.opencv.org/4.x/dd/d00/tutorial_js_video_display.html

let video = document.getElementById("videoInput");
let streaming = false;
let frame, cap;

//Button testing...
document.getElementById("startButton").addEventListener("click", () => {
  //User webcam access request
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
      return video.play();
    })
    .catch((err) => {
      console.error("Camera error:", err);
    });

  // Wait for data like video width, height, etc. to load
  video.onloadedmetadata = () => {
    streaming = true;

    let width = video.videoWidth;
    let height = video.videoHeight;

    // Set default to 640 x 480 px
    if (!width || !height) {
      width = 640;
      height = 480;
    }

    frame = new cv.Mat(height, width, cv.CV_8UC4);
    cap = new cv.VideoCapture(video);
    startVideoProcessing();
  };
});

function startVideoProcessing() {
  function processVideo() {
    if (!streaming) {
      frame.delete();
      return;
    }

    cap.read(frame);

    cv.imshow("canvasOutput", frame); // DISPLAY OUTPUT (PROCESSED) FEED

    requestAnimationFrame(processVideo); // Updates frame to match screen refresh rate
  }
  requestAnimationFrame(processVideo);
}
