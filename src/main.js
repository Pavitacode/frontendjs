import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';

function Main() {
  const userData = JSON.parse(localStorage.getItem('userData'));
  let isSessionActive = localStorage.getItem('isSessionActive');

  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentUser = users[currentIndex];
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(userData['name']);
  const [newGender, setNewGender] = useState(userData['sex']);
  const [newSexuality, setNewSexuality] = useState(userData['gustos']);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  // Estado para el modo de edición de imágenes
  const [isEditingImages, setIsEditingImages] = useState(false);
  // Estado para el índice de la imagen que se está editando
  const [editingImageIndex, setEditingImageIndex] = useState(null);
  // Estado para la imagen seleccionada por el usuario
  const [selectedImage, setSelectedImage] = useState(null);

  const handleDislike = () => {
    setCurrentIndex(currentIndex + 1);
  };

  const handleLike = () => {
    setCurrentIndex(currentIndex + 1);
  };

  const handleSuperLike = () => {
    setCurrentIndex(currentIndex + 1);
  };

  useEffect(() => {
    const newSocket = io('http://localhost:8080/');
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  useEffect(() => {
    if (socket) {
      socket.emit('message', { gender: userData['sex'], sexuality: userData['gustos'] });
      socket.on('message', (data) => {
        setUsers((prevUsers) => [...prevUsers, ...data]);
      });
    }
  }, [socket]);

// Función para manejar la selección de una imagen por parte del usuario
const handleSelectImage = (e) => {
setSelectedImage(e.target.files[0]);
};

if (!isSessionActive || isSessionActive == null) {
return <Navigate to="/" />;
}

const handleEditInformation = () => {
setIsEditing(true);
setPasswordError('');
setIsEditingImages(false); // Desactivar el modo de edición de imágenes
setEditingImageIndex(null); // Restablecer el índice de la imagen que se está editando
setSelectedImage(null); // Restablecer la imagen seleccionada por el usuario
};

const handleCancelEdit = () => {
setIsEditing(false);
setNewName(userData['name']);
setNewGender(userData['sex']);
setNewSexuality(userData['gustos']);
setShowChangePassword(false);
setOldPassword('');
setNewPassword('');
setIsPasswordChanged(false);
setPasswordError('');
setIsEditingImages(false); // Desactivar el modo de edición de imágenes
setEditingImageIndex(null); // Restablecer el índice de la imagen que se está editando
setSelectedImage(null); // Restablecer la imagen seleccionada por el usuario
};

const handleSaveChanges = async () => {
try {
let updateData = {
name: newName,
sex: newGender,
gustos: newSexuality,
isPasswordChanged,
lastPassword: oldPassword,
newPassword,
};
// Si se está editando una imagen específica y se ha seleccionado una nueva imagen
if (isEditingImages && editingImageIndex !== null && selectedImage) {
updateData.imageBuffer = true;
updateData.images = [];
updateData.images[editingImageIndex] = selectedImage;
}
// Si se está agregando una nueva imagen y se ha seleccionado una nueva imagen
if (isEditingImages && editingImageIndex === null && selectedImage) {
updateData.imageBuffer = true;
updateData.images = [];
updateData.images.push(selectedImage);
}
const response = await axios.put(`http://localhost:8000/update/${userData.id}`, updateData);
setIsEditing(false);
setShowChangePassword(false);
setOldPassword('');
setNewPassword('');
setIsPasswordChanged(false);
setPasswordError('');
localStorage.setItem('userData', JSON.stringify(response.data.data));
setNewName(response.data.data.name);
setNewGender(response.data.data.sex);
setNewSexuality(response.data.data.gustos);
setIsEditingImages(false); // Desactivar el modo de edición de imágenes
setEditingImageIndex(null); // Restablecer el índice de la imagen que se está editando
setSelectedImage(null); // Restablecer la imagen seleccionada por el usuario
} catch (err) {
if (err.response && err.response.status === 400) {
setPasswordError('La contraseña anterior no coincide');
} else {
console.error(err);
}
}
};

return (  <div>
  <div
    style={{
      float: 'left',
      marginLeft: '20px',
      boxShadow: '0px 0px 5px #888888',
      padding: '10px',
      height: '700px',
    }}
  >
    <h2>Información del usuario</h2>
    {isEditing ? (
  <div>
    <p>
      Nombre:{' '}
      <input
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />
    </p>
    <p>
      Género:{' '}
      <select
        value={newGender}
        onChange={(e) => setNewGender(e.target.value)}
      >
        <option value="Hombre">Masculino</option>
        <option value="Mujer">Femenino</option>
        <option value="Otro">Indefinido</option>
      </select>
    </p>
    <p>
      Sexualidad:{' '}
      <select
        value={newSexuality}
        onChange={(e) => setNewSexuality(e.target.value)}
      >
        <option value="Heterosexual">Heterosexual</option>
        <option value="Homosexual">Homosexual</option>
        <option value="Bisexual">Bisexual</option>
        <option value="Otro">Otro</option>
      </select>
    </p>
    {!showChangePassword && (
      <button onClick={() => setShowChangePassword(true)}>
        Editar contraseña
      </button>
    )}
    {isEditing && (
  <button onClick={() => setIsEditingImages(true)}>
    Editar imágenes
  </button>
)}

    {showChangePassword && (
      <>
        <p>
          Contraseña anterior:{' '}
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            style={{ borderColor: passwordError ? 'red' : '' }}
          />
          {passwordError && (
            <span style={{ color: 'red', marginLeft: '10px' }}>
              {passwordError}
            </span>
          )}
        </p>
        <p>
          Nueva contraseña:{' '}
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </p>
      </>
    )}
    {isEditingImages && (
      <>
        {userData['images']?.length >= 5 ? (
          <select
            onChange={(e) =>
              setEditingImageIndex(parseInt(e.target.value))
            }
          >
            <option value={null}>
              Selecciona una imagen para editar
            </option>{' '}
            {userData['images']?.map((image, index) => (
              <option key={index} value={index}>
                Imagen {index + 1}
              </option>
            ))}
          </select>
        ) : (
          <>
            <label htmlFor="imageInput">Agregar imagen:</label>{' '}
            <input
              type="file"
              id="imageInput"
              onChange={handleSelectImage}
            />{' '}
            
            <button onClick={() => setIsEditingImages(false)}>
              Cancelar
            </button>{' '}
            <button
              onClick={() => {
                setSelectedImage(null);
                setEditingImageIndex(null);
              }}
            >
              Editar Imagen Especifica{' '}
            </button>{' '}
          </>
        )}
        {editingImageIndex !== null && (
          <>
            <label htmlFor="imageInput">
              Selecciona una nueva imagen:
            </label>{' '}
            <input
              type="file"
              id="imageInput"
              onChange={handleSelectImage}
            />{' '}
         
            <button
              onClick={() => {
                setIsEditingImages(false);
                setSelectedImage(null);
                setEditingImageIndex(null);
              }}
            >
              Cancelar
            </button>{' '}
          </>
        )}
      </>
    )}
   

   <>
      <button onClick={handleSaveChanges}>Guardar cambios</button>{' '}
      <button onClick={handleCancelEdit}>Cancelar</button>{' '}
    </>
    </div>
    ) : (
      <>
        <p>Nombre: {newName}</p>{' '}
        <p>Género: {newGender}</p>{' '}
        <p>Sexualidad: {newSexuality}</p>{' '}
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {userData['images']?.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Imagen ${index + 1}`}
              style={{
                width: '50px',
                height: '50px',
                marginRight: '10px',
              }}
            />
          ))}
        </div>{' '}
        <button onClick={handleEditInformation}>Editar información</button>{' '}
      </>
    )}
  </div>
      <div
        style={{
          margin: '0 auto',
          marginTop: '100px',
          width: '30%',
          boxShadow: '0px 0px 5px #888888',
          padding: '10px',
          border: '1px solid white',
        }}
      >
        {currentUser ? (
          <>
            <h2>@{currentUser['user']}</h2>
            <p>{currentUser['name']}</p>
            <p>{currentUser['sex']}</p>
            <img
              src={currentUser['image']}
              alt="Imagen"
              style={{ width: '100%', borderRadius: '50px' }}
            />
            <button onClick={() => handleDislike()}>DisLike</button>
            <button onClick={() => handleLike()}>Like</button>
            <button onClick={() => handleSuperLike()}>SuperLike</button>
          </>
        ) : (
          <p>No hay más usuarios para mostrar.</p>
        )}
      </div>
    </div>
  );
}

export default Main;
