import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Confetti from 'react-confetti';

import { AppBar, Tabs, Tab } from '@material-ui/core';

function Main() {
 let isMatch = false;
 const [activeTab, setActiveTab] = useState(0);

 const handleTabChange = (event, newValue) => {
 setActiveTab(newValue);
 };

 const navigate = useNavigate();
 const userData = JSON.parse(localStorage.getItem('userData'));
 let isSessionActive = localStorage.getItem('isSessionActive');

 const [socket, setSocket] = useState(null);
 const [users, setUsers] = useState([]);
 const [likesYou, setLikesYou] = useState([]);
 const [likes, setLikes] = useState([]);
 const [matches, setMatches] = useState([]);
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


 const [showMatchAnimation, setShowMatchAnimation] = useState(false);


 const handleMatchAnimation = () => {
 setShowMatchAnimation(true);
 setTimeout(() => {
 setShowMatchAnimation(false);
 }, 2000);
 };


 const handleLikeOrDislike = async (isLike) => {
 getMyLikes();
 console.log(isLike, currentUser['_id']);

 try {

 const updateData = {
 otherUserId: currentUser['_id'],
 isLike: isLike,
 };


 const response = await axios.put(
 `https://tinderbackend.onrender.com/addLikeOrDislike/${userData.id}`,
 updateData
 );
 console.log(response);


 isMatch = response.data.isMatch;


 if (isMatch) {
 handleMatchAnimation();
 }
 } catch (err) {
 console.error(err);
 }
 };


 const handleDislike = () => {
 setCurrentIndex(currentIndex + 1);
 handleLikeOrDislike(false);
 };

 
 const handleLike = () => {
 setCurrentIndex(currentIndex + 1);
 handleLikeOrDislike(true);
 };


 const handleSuperLike = () => {
 setCurrentIndex(currentIndex + 1);
 };
 const handleFileChange = (event) => {
 
  const file = event.target.files[0];
  setNewProfilePicture(file);
 
  
  const reader = new FileReader();
  reader.onload = (e) => {
  document.getElementById('imagePreview').src = e.target.result;
  };
  reader.readAsDataURL(file);
 };

 const getMyLikes = async () => {
  try {

  const response = await axios.get(
  `https://tinderbackend.onrender.com/getMyLikes/${userData.id}`
  );
  console.log(response);
 

  const likedUsers = response.data.likedUsers;
  setLikes(likedUsers);
  } catch (err) {
  console.error(err);
  }
 };
 

 getMyLikes();
 

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
 
 useEffect(() => {
  const newSocket = io('https://tinderbackend.onrender.com/');
  setSocket(newSocket);
  return () => newSocket.close();
  }, [setSocket]);
 
  useEffect(() => {
  if (socket) {
  socket.emit('posts', { gender: userData['sex'], sexuality: userData['gustos'], id: userData['id']});
  socket.on('posts', (data) => {
  setUsers((prevUsers) => [...prevUsers, ...data]);
  });
  }
  }, [socket]);
 
 
 
  useEffect(() => {
  if (socket) {
  console.log("hola")
  socket.emit('likeUsers', { id: userData['id']});
  console.log("holaa")
  socket.on('likeUsers', (data) => {
  console.log(data)
  setLikesYou((prevUsers) => [...prevUsers, ...data]);
  });
  }
  }, [socket]);
 
  useEffect(() => {
  if (socket) { 
  socket.emit('matches', { id: userData['id']});
  socket.on('matches', (data) => {
  console.log(data)
  setMatches((prevUsers) => [...prevUsers, ...data]);
  });
  }
  }, [socket]);

 const handleLogout = () => {
  navigate('/');
  localStorage.removeItem('userData');
  localStorage.setItem('isSessionActive', false);
 };
 

 const handleSaveChanges = async () => {
  console.log(userData['image']);
  try {

  let updateData = new FormData();
  updateData.append('name', newName);
  updateData.append('user', newUser);
  updateData.append('sex', newGender);
  updateData.append('gustos', newSexuality);
  updateData.append('isPasswordChanged', isPasswordChanged);
  updateData.append('lastPassword', oldPassword);
  updateData.append('newPassword', newPassword);
 

  if (newProfilePicture) {
  updateData.append('isNewPicture', true);
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
 

 if (isSessionActive == 'false' || isSessionActive == null) {
  return <Navigate to="/" />;
 }
 

 if (userData.image == null || userData.image == '') {
  return <Navigate to="/imageUploader" />;
 }
 
 return (

  
  <div style={{ background: '#a5cbd8', height: '100vh', position: 'relative', top: '0px' }}>
  {showMatchAnimation && (
  <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999 }}>
  <Confetti width={window.innerWidth} height={window.innerHeight} />
  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
  <h1 style={{ fontSize: '72px', color: '#fff' }}>¡Match!</h1>
  </div>
  </div>
  )}

  <div
    style={{
      float: 'left',
      marginLeft: '20px',
      marginTop:'100px',
      boxShadow: '15px 15px 5px #888888',
      padding: '10px',
      height: '520px',
      background:'#e8f3f7',
      borderRadius:'15px'
    }}
  >
    
    <h2 style={{marginLeft:'20px'}}>Información del usuario</h2>
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
      <button onClick={() => setShowChangePassword(true)} style={{ position:'relative',top:'-30px', left:'-5px'}}>
        Editar contraseña
      </button>
    )}


    {showChangePassword && (
      <>
        <p  style={{ position:'relative',top:'-25px'}}>
          Contraseña anterior:{' '}
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            style={{borderColor: passwordError ? 'red' : '' }}
          />
          {passwordError && (
            <span style={{ color: 'red', marginLeft: '10px' }}>
              {passwordError}
            </span>
          )}
        </p>
        <p  style={{ position:'relative',top:'-35px'}}>
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
 
      <button onClick={handleSaveChanges} style={{ position:'relative',top:'-30px'}}>Guardar cambios</button>{' '}
      <button onClick={handleCancelEdit}  style={{ position:'relative',top:'-30px'}}>Cancelar</button>{' '}

    </>
    
    </div>
    ) : (
      <>
        <p style={{fontSize:'20px',marginLeft:'20px'}}>Nombre: <p style={{fontSize:'15px',color:'#f97e66',}}>{newName}</p></p>{' '}
        <p style={{fontSize:'20px',marginLeft:'20px'}}>User: <p style={{fontSize:'15px',color:'#f97e66',}}>{newUser}</p></p>{' '}
        <p style={{fontSize:'20px',marginLeft:'20px'}}>Género:<p style={{fontSize:'15px',color:'#f97e66',}}>{newGender}</p></p>{' '}
        <p style={{fontSize:'20px',marginLeft:'20px'}}>Sexualidad:<p style={{fontSize:'15px',color:'#f97e66',}}> {newSexuality}</p></p>{' '}
        <img
         style={{height:'250px', width: '250px', borderRadius: '50px',position:'relative',left:'150px',top:'-300px' }}
              src= {userData['image']}/>
       
        <button onClick={handleEditInformation} style={{ margin: '8px 0', background:'white', color:'black',borderRadius:'5px',position:'relative',top:'-180px',left:'-250px' }}>Editar información</button>{' '}
        <button onClick={handleLogout} style={{ margin: '8px 0', background:'white', color:'black',borderRadius:'5px',position:'relative',top:'-180px',left:'-10px'  }} >Cerrar Sesion</button>{' '}
      </>
    )}   
    <div style={{
 boxShadow: '15px 15px 5px #888888',
 width: '500px',
 background: '#e8f3f7',
 borderRadius: '50px',
 position: 'relative',
 overflow: 'auto',
 top: '-610px',
 left: '1310px',
 }}>
 <Tabs
 value={activeTab}
 onChange={handleTabChange}
 indicatorColor="primary"
 textColor="primary"
 variant="fullWidth"
 >
 <Tab label="Likes Recibidos" />
 <Tab label="Likes Dados" />
 <Tab label="Matches" />
 </Tabs>
 </div>
 
 <div
 style={{
 boxShadow: '15px 15px 5px #888888',
 padding: '10px',
 width: '500px',
 height: '430px',
 background: '#e8f3f7',
 borderRadius: '15px',
 position: 'relative',
 overflow: 'auto',
 height: '100%',
 top: '-600px',
 left: '1300px',
 }}
 >
 <h2 style={{ marginLeft: '20px' }}>
 {activeTab === 0 && "Personas que te han dado like"}
 {activeTab === 1 && "Tus Likes"}
 {activeTab === 2 && "Matches"}
 </h2>
 <div>
 {(activeTab === 0 ? likesYou : activeTab === 1 ? likes : matches).map((user) => (
 <div
 key={user._id}
 style={{
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between',
 boxShadow: '0 0 5px #888888',
 padding: '10px',
 margin: '10px 0',
 }}
 >
 <div style={{ display: 'flex', alignItems: 'center' }}>
 <img
 src={user.profilePicture}
 alt={user.name}
 style={{
 width: '50px',
 height: '50px',
 borderRadius: '50%',
 marginRight: '10px',
 }}
 />
 <div>
 <p>{user.name}</p>
 <p>@{user.user}</p>
 </div>
 </div>
 {activeTab === 0 && <p>Le has gustado a {user.name}</p>}
 {activeTab === 1 && <p>Te ha gustado {user.name}</p>}
 {activeTab === 2 && <p>Tienes un match con {user.name}</p>}
 </div>
 ))}
 </div>
 </div>





  </div>
  
  <div
  style={{
    marginLeft: '650px',
    height: '100vh'
  }}
>
  <div
    style={{
      
      width: '530px',
      boxShadow: '15px 15px 5px #888888',
      padding: '10px',
      border: '1px solid white',
      backgroundColor: 'white'
    }}
  >
    {currentUser ? (
      <>
        <div style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
          <h2>@{currentUser['user']}</h2>
          <p>{currentUser['name']}</p>
          <p>{currentUser['sex']}</p>
        </div>
        <img
          src={currentUser['profilePicture']}
          alt="Imagen"
          style={{ width: '100%', height: '400px', borderRadius: '50px' }}
        />
        <button
        className="like-button"
          onClick={() => handleDislike()}
          style={{
   
            margin: '8px 0',
            background: 'white',
            color: 'black',
            borderRadius: '50%',
            width: '50px',
            height: '50px'
            
          }}
        >
          <i  class="fas fa-thumbs-down"></i>
        </button>
        <button 
          className="dislike-button"
          onClick={() => handleLike()}
          style={{
     margin: '8px 0',
            background: 'white',
            color: 'black',
            borderRadius: '50%',
            width: '50px',
            height: '50px'
          }}
        >
          <i class="fas fa-thumbs-up"></i>
        </button>
      </>
    ) : (
      <p>No hay más usuarios para mostrar.</p>
    )}
  </div>
</div>


    </div>
  );
}

export default Main;
