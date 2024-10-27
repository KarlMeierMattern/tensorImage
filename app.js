// app.js
const fileInput = document.getElementById("file-input");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let detector;

fileInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    const inputImage = new Image();
    inputImage.src = e.target.result;

    inputImage.onload = async () => {
      const desiredWidth = 600;
      const aspectRatio = inputImage.height / inputImage.width;
      const newHeight = desiredWidth * aspectRatio;

      canvas.width = desiredWidth;
      canvas.height = newHeight;

      ctx.drawImage(inputImage, 0, 0, desiredWidth, newHeight);
      console.log(
        "Image drawn on canvas with new dimensions:",
        desiredWidth,
        newHeight
      );

      const faces = await detector.estimateFaces(inputImage, {
        flipHorizontal: false,
      });
      console.log("Faces detected:", faces);

      if (faces.length > 0) {
        faces.forEach((face) => {
          console.log("Face keypoints:", face.keypoints);
          // lips, faceOval, rightEye, leftEye, rigthEyebrow, leftEyebrow
          face.keypoints.forEach((coordinate) => {
            if (
              coordinate.name === "lips" ||
              coordinate.name === "faceOval" ||
              coordinate.name === "rightEye" ||
              coordinate.name === "leftEye" ||
              coordinate.name === "rightEyebrow" ||
              coordinate.name === "leftEyebrow"
            ) {
              console.log(coordinate);
            }
          });
          face.keypoints.forEach((point) => {
            ctx.beginPath();
            ctx.arc(
              point.x * (desiredWidth / inputImage.width),
              point.y * (newHeight / inputImage.height),
              2,
              0,
              2 * Math.PI
            );
            ctx.fillStyle = "red";
            ctx.fill();
          });
        });
      } else {
        console.log("No faces detected.");
      }
    };
  };

  reader.readAsDataURL(file);
});

// Load the face detection model
async function loadModel() {
  const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
  const detectorConfig = {
    runtime: "tfjs",
    maxFaces: 5,
  };
  detector = await faceLandmarksDetection.createDetector(model, detectorConfig);
  console.log("Detector initialized:", detector); // Check if the detector is initialized
}

loadModel();

const testFunction = async () => {
  setTimeout(() => {
    console.log("time expired");
  }, 3000);
};
