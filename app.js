const video = document.getElementById('video');

const startVideo = () => {

  navigator.mediaDevices.getUserMedia({
      video: true
    })
    .then((stream) => {
      video.srcObject = stream
    })
    .catch((err) => {
      console.error(err)
    })
}


Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('https://adsp16.github.io/face-recognition-app/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('https://adsp16.github.io/face-recognition-app/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('https://adsp16.github.io/face-recognition-app/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('https://adsp16.github.io/face-recognition-app/models')
]).then(startVideo)






video.addEventListener('play', () => {

  const canvas = faceapi.createCanvasFromMedia(video)

  document.body.append(canvas)

  const displaySize = {
    width: video.width,
    height: video.height
  }

  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {

    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()


    const resizeDetections = faceapi.resizeResults(detections, displaySize)

    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizeDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizeDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizeDetections)



  }, 100)

  console.log(faceapi);

})