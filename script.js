// Mostly from the OpenCV.js documentation: https://docs.opencv.org/4.x/dd/d00/tutorial_js_video_display.html

let video = document.getElementById("videoInput");
let streaming = false;
let frame, cap;

function onReady() {
  // Ask for camera access, mediaDevices = part of Media Capture and Streams API
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
      // CSS MAKES SURE TO NOT DISPLAY THIS INPUT VIDEO FEED
      video.play();
      streaming = true;

      video.addEventListener("loadeddata", () => {
        // Convert to opencv matrix
        frame = new cv.Mat(video.videoHeight, video.videoWidth, cv.CV_8UC4);
        cap = new cv.VideoCapture(video);

        startVideoProcessing();
      });
    })
    .catch((err) => {
      console.error("Camera error:", err);
    });
}

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
