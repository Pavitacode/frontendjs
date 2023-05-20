import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ImageUploader() {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('userData'));
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setNewProfilePicture(file);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('imagePreview').src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveChanges = async () => {
    if (!newProfilePicture) {
      setError('Por favor selecciona una imagen antes de guardar.');
      return;
    }

    try {
      let updateData = new FormData();
      if (newProfilePicture) {
        updateData.append('isNewPicture', true);
        updateData.append('profilePicture', newProfilePicture);
        const response = await axios.put(
          `https://tinderbackend.onrender.com/update/${userData.id}`,
          updateData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        localStorage.setItem('userData', JSON.stringify(response.data.data));
        navigate('/main');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Seleccionar foto de perfil</h1>
      <div style={{ width: 300, height: 300, boxShadow: '0px 0px 10px #888888', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img alt="Selected" style={{ width:'280px', height:'280px' }} id="imagePreview" />
     
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input type="file" onChange={handleFileChange} style={{marginTop:'50px'}} />
      <button style={{ marginTop: 20 }} onClick={handleSaveChanges}>
        Save
      </button>
    </div>
  );
}

export default ImageUploader;
