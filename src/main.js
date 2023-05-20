import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Main() {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('userData'));
  let isSessionActive = localStorage.getItem('isSessionActive');

  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentUser = users[currentIndex];
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(userData.name);
  const [newUser, setNewUser] = useState(userData.user);
  const [newGender, setNewGender] = useState(userData.sex);
  const [newSexuality, setNewSexuality] = useState(userData.gustos);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [newProfilePicture, setNewProfilePicture] = useState(null);



  const handleDislike = () => {
    setCurrentIndex(currentIndex + 1);
  };

  const handleLike = () => {
    setCurrentIndex(currentIndex + 1);
  };

  const handleSuperLike = () => {
    setCurrentIndex(currentIndex + 1);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setNewProfilePicture(file)
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById("imagePreview").src = e.target.result;
    };
    reader.readAsDataURL(file);
  };
  

  useEffect(() => {
    const newSocket = io('https://tinderbackend.onrender.com/');
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  useEffect(() => {
    if (socket) {
      socket.emit('message', { gender: userData['sex'], sexuality: userData['gustos'], id: userData['id']});
      socket.on('message', (data) => {
        setUsers((prevUsers) => [...prevUsers, ...data]);
      });
    }
  }, [socket]);




if (isSessionActive == "false" || isSessionActive == null) {
return <Navigate to="/" />;
}

if (userData.image == null || userData.image == ""){
  return <Navigate to="/imageUploader" />;
}

const handleEditInformation = () => {
setIsEditing(true);
setPasswordError('');


};

const handleCancelEdit = () => {
setIsEditing(false);
setNewName(userData.name);
setNewUser(userData.user);
setNewGender(userData.sex);
setNewSexuality(userData.gustos);
setShowChangePassword(false);
setOldPassword('');
setNewPassword('');
setIsPasswordChanged(false);
setPasswordError('');

};

const handleLogout =  () => {
  navigate('/');
  localStorage.removeItem('userData');
  localStorage.setItem('isSessionActive', false);
}

const handleSaveChanges = async () => {
  console.log(userData['image'])
  try {
    let updateData = new FormData();
    updateData.append('name', newName);
    updateData.append('user',newUser);
    updateData.append('sex', newGender);
    updateData.append('gustos', newSexuality);
    updateData.append('isPasswordChanged', isPasswordChanged);
    updateData.append('lastPassword', oldPassword);
    updateData.append('newPassword', newPassword);
    if (newProfilePicture) {
      updateData.append('isNewPicture',true);
      updateData.append('profilePicture', newProfilePicture);
    }
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

} catch (err) {
if (err.response && err.response.status === 400) {
setPasswordError('La contraseña anterior no coincide');
} else {
console.error(err);
}
}
setIsEditing(false);
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
      User:{' '}
      <input
        type="text"
        value={newUser}
        onChange={(e) => setNewUser(e.target.value)}
      />
    </p>
    <p>
      Género:{' '}
      <select
        value={newGender}
        onChange={(e) => setNewGender(e.target.value)}
      >
        <option value="Masculino">Masculino</option>
        <option value="Femenino">Femenino</option>
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
        <option value="Gay">Gay</option>
        <option value="Bisexual">Bisexual</option>
        <option value="Otro">Otro</option>
      </select>
    </p>

    <p>
      Profile Picture:{' '}
      <input type="file" onChange={handleFileChange} />
    </p>
<div style={{display:'flex', alignItems: 'center', marginLeft:'80px', marginBottom:'40px'}}>
    <img id="imagePreview" width="150" height="150" />
    </div>
    {!showChangePassword && (
      <button onClick={() => setShowChangePassword(true)}>
        Editar contraseña
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
  
   

   <>
 
      <button onClick={handleSaveChanges}>Guardar cambios</button>{' '}
      <button onClick={handleCancelEdit}>Cancelar</button>{' '}

    </>
    </div>
    ) : (
      <>
        <p>Nombre: {newName}</p>{' '}
        <p>User: {newUser}</p>{' '}
        <p>Género: {newGender}</p>{' '}
        <p>Sexualidad: {newSexuality}</p>{' '}
        <img
         style={{height:'250px', width: '250px', borderRadius: '50px' }}
              src= {userData['image']}/>
       
        <button onClick={handleEditInformation}>Editar información</button>{' '}
        <button onClick={handleLogout} >Cerrar Sesion</button>{' '}
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
              src={currentUser['profilePicture']}
              alt="Imagen"
              style={{ width: '550px', height: '400px', borderRadius: '50px' }}
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
