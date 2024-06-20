import React, { useRef, useEffect, useState } from 'react';

const Webcam = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [zoom, setZoom] = useState(1);
  const [capturedImage, setCapturedImage] = useState('');

  useEffect(() => {
    const getDevices = async () => {
      await navigator.mediaDevices.getUserMedia({ video: true });
      try {
        const deviceInfos = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = deviceInfos.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[videoDevices.length - 1].deviceId); // Default to first device
        }
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    getDevices();
  }, []);

  useEffect(() => {
    const startWebcam = async () => {
      if (selectedDeviceId) {
        try {
          const constraints = {
            video: {
              deviceId: { exact: selectedDeviceId },
              width: { ideal: 800 },
              height: { ideal: 600 },
              frameRate: { ideal: 30 }
            },
            audio: false
          };
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        } catch (error) {
          console.error('Error accessing the webcam:', error);
        }
      }
    };

    startWebcam();
  }, [selectedDeviceId]);



  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      // Ensure canvas dimensions match video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Calculate correct aspect ratio for drawing
      const aspectRatio = video.videoWidth / video.videoHeight;
      let sourceWidth, sourceHeight, sourceX, sourceY;

      // Calculate source dimensions based on video aspect ratio
      if (canvas.width >= canvas.height * aspectRatio) {
        sourceWidth = canvas.height * aspectRatio;
        sourceHeight = canvas.height;
      } else {
        sourceWidth = canvas.width;
        sourceHeight = canvas.width / aspectRatio;
      }

      // Calculate source position to center the video frame
      sourceX = (video.videoWidth - sourceWidth);
      sourceY = (video.videoHeight - sourceHeight);

      // Clear canvas and draw image with correct dimensions and position
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.imageSmoothingEnabled = true;
      // context.filter = 'blur(0.5px)';
      context.drawImage(video, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
      context.filter = 'none';

      // Convert canvas content to data URL and set it to state
      const imgData = canvas.toDataURL('image/png');
      setCapturedImage(imgData);
    }
  };

  return (
    <div>
      <div>
        <video ref={videoRef} autoPlay style={{ width: '100%' }} />
        <canvas ref={canvasRef} width="800" height="600" style={{ display: 'none' }} />
        <button onClick={captureImage}>Capture Image</button>
      </div>
      <div>
        {capturedImage && (
          <div>
            <h2>Captured Image</h2>
            <img src={capturedImage} alt="captured" style={{ maxWidth: '100%' }} />
          </div>
        )}
      </div>
      {/* <div>
        <label htmlFor="devices">Choose a camera:</label>
        <select id="devices" onChange={handleDeviceChange} value={selectedDeviceId}>
          {devices.map(device => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${device.deviceId}`}
            </option>
          ))}
        </select>
      </div> */}
    </div>
  );
};

export default Webcam;
