import React, { useCallback, useEffect, useState } from 'react';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

function CameraComponent() {
  const [photo, setPhoto] = useState(null);
  const [hint, setText] = useState('');

  const [message, setMessage] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [url, setUrl] = useState('https://calcam-service.onrender.com/api');
  const [urltest, setUrltest] = useState('https://calcam-service.onrender.com/api/test');
  const [serverResponse, setServerResponse] = useState(null);
  const [count, setCount] = useState(0);


  const handleTakePhoto = (dataUri) => {
    // Resize the photo to 150x150 pixels
    const img = new Image();
    img.src = dataUri;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 150;
      canvas.height = 150;
      ctx.drawImage(img, 0, 0, 150, 150);
      const resizedDataUri = canvas.toDataURL('image/jpeg', 0.5);
      setPhoto(resizedDataUri);
      console.log('Resized photo taken:', resizedDataUri);
    };
  };

  const handleSendPhoto = async () => {
    if (photo) {
      try {
        const response = await fetch('/api/sendphoto', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: photo, hint }),
        });

        const data = await response.json();
        setServerResponse(data);
        console.log('Response from API:', data);
      } catch (error) {
        console.error('Error sending photo:', error);
      }
    } else {
      alert('No photo to send');
    }
  };

  const fetchData = useCallback(() => {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        setMessage(json.message);
        setIsFetching(false);
      }).catch(e => {
        setMessage(`API call failed: ${e}`);
        setIsFetching(false);
      })
  }, [url]);

  const handletestbackend = async()=>{
    setCount(count + 1);
    fetch(urltest)
    .then(response => {
     
      if (!response.ok) {
        throw new Error(`status ${response.status}`);
      }
      return response.json();
    })
    .then(json => {
      setMessage(count + "|" + json.message);
      setIsFetching(false);
    }).catch(e => {
      setMessage(`API call failed: ${e}`);
      setIsFetching(false);
    })
  }

  useEffect(() => {
    setIsFetching(true);
    fetchData();
  }, [fetchData]);
 
  return (
    <div>
       <p>{'« '}<strong>
        {isFetching
        ? 'Fetching message from API'
        : message}
       </strong>{' »'}</p>
      <h1>React HTML5 Camera Photo</h1>
      <h1>Counter: {count}</h1>
      <button onClick={handletestbackend}>test backend</button>
      <Camera
        onTakePhoto={(dataUri) => { handleTakePhoto(dataUri); }}
        idealFacingMode={FACING_MODES.ENVIRONMENT}
        idealResolution={{ width: 300, height: 300 }}
        imageType={IMAGE_TYPES.JPG}
        imageCompression={0.97}
        isMaxResolution={true}
        isImageMirror={false}
        isDisplayStartCameraError={true}
        sizeFactor={1}
      />
      <div>
        <input
        type="text"
        value={hint}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text"
        />
      </div>
      {photo && (
        <div>
          <h2>Preview</h2>
          <img src={photo} alt="Preview" />
          <button onClick={handleSendPhoto}>Send Photo</button>
        </div>
      )}
      {serverResponse && (
        <div>
          <h2>Server Response</h2>
          <pre>{JSON.stringify(serverResponse, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default CameraComponent;
