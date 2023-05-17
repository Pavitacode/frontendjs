import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Tabs, Tab, MenuItem, Select } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createTheme({
 typography: {
 h4: {
 fontFamily: 'Poppins',
 },
 },
});

function LoginForm() {
    const navigate = useNavigate();

    const isSessionActive = localStorage.getItem('isSessionActive');
    console.log(isSessionActive)

    
    useEffect(() => {
        // redirigir al usuario a la ruta / si no hay una sesión activa
        if (isSessionActive) {
            navigate('/main');
        }
    }, [isSessionActive, navigate]);

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [userName, setUserName] = React.useState('');
    const [name, setName] = React.useState('');
    const [gustos, setGustos] = React.useState('');
    const [sex, setSex] = React.useState('');
    const [tabValue, setTabValue] = React.useState(0);
    const [emailError, setEmailError] = React.useState({ error: false, message: '' });
    const [userNameError, setUserNameError] = React.useState({ error: false, message: '' });
    const [passwordError, setPasswordError] = React.useState({ error: false, message: '' });
    const [userLoginError, setUserLoginError] = React.useState({ error: false, message: '' });

    const handleSubmit = async (event) => {
        event.preventDefault();
        // manejar el envío del formulario
        let data;
        let url;
        if (tabValue === 0) {
          // Iniciar sesión
          data = { user: email, password };
          url = 'http://localhost:8000/Login';
        } else {
          // Registrarse
          data = { user: userName, password, name, email, gustos, sex };
          url = 'http://localhost:8000/Register';
        }
        try {
            const response = await axios.post(url, data);
            console.log(response.data);
            if (response.data.errorEmail) {
                setUserNameError({ error:false, message: response.data.mensaje });
              setEmailError({ error: true, message: response.data.mensaje });
            } else if (response.data.errorUser) {
                setEmailError({ error: false, message: response.data.mensaje });
              setUserNameError({ error: true, message: response.data.mensaje });
            }

            else if (response.data.errorPassword){
                setUserLoginError({ error: false, message: response.data.mensaje });
                setPasswordError({ error: true, message: response.data.mensaje });
            }

            else if (response.data.errorUserLogin){
                setPasswordError({ error: false, message: response.data.mensaje });
                setUserLoginError({ error: true, message: response.data.mensaje });
            }

            else {
                setUserNameError({ error:false, message: response.data.mensaje });
                setEmailError({ error: false, message: response.data.mensaje });
                setUserLoginError({ error: false, message: response.data.mensaje });
                setPasswordError({ error: false, message: response.data.mensaje });
            }
            if (response.data.login) {
                localStorage.setItem('userData', JSON.stringify(response.data.data));
                localStorage.setItem('isSessionActive', true);
                navigate('/main');
            }
            
            if (response.data.register) {
                localStorage.setItem('userData', JSON.stringify(response.data.data));
                localStorage.setItem('isSessionActive', true);
                navigate('/main');
            }
            
          } catch (error) {
            console.error(error);
          }
        };
 return (
 <ThemeProvider theme={theme}>
 <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
 <div style={{ width: '600px', height: '600px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)', background: 'linear-gradient(to bottom right, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)' }}>
 <Tabs value={tabValue} onChange={(event, newValue) => setTabValue(newValue)} centered>
 <Tab label="Iniciar sesión" />
 <Tab label="Registrarse" />
 </Tabs>
 {tabValue === 0 && (
 <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px' }}>
 <Typography variant="h4">Iniciar sesión</Typography>
 <TextField
 label="Correo electrónico"
 value={email}
 onChange={(event) => setEmail(event.target.value)}
 required
 style={{ margin: '8px 0' }}
 variant="outlined"
 error = {userLoginError.error}
 helperText={userLoginError.error && userLoginError.message}
 />
 <TextField
 label="Contraseña"
 type="password"
 value={password}
 onChange={(event) => setPassword(event.target.value)}
 required
 style={{ margin: '8px 0' }}
 variant="outlined"
 error = {passwordError.error}
 helperText={passwordError.error && passwordError.message}

 />
 <Button type="submit" variant="contained" color="primary" style={{ margin: '8px 0' }}>Iniciar sesión</Button>
 </form>
 )}
 {tabValue === 1 && (
  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px' }}>
  <Typography variant="h4">Registrarse</Typography>
  <TextField
    label="Correo electrónico"
    value={email}
    onChange={(event) => setEmail(event.target.value)}
    required
    style={{ margin: '8px 0' }}
    variant="outlined"
    error ={emailError.error}
    helperText={emailError.error && emailError.message}
  />
  <TextField
    label="Contraseña"
    type="password"
    value={password}
    onChange={(event) => setPassword(event.target.value)}
    required
    style={{ margin: '8px 0' }}
    variant="outlined"
  />
  <TextField
    label="Nombre de usuario"
    value={userName}
    onChange={(event) => setUserName(event.target.value)}
    required
    style={{ margin: '8px 0' }}
    variant="outlined"
    error ={userNameError.error}
    helperText={userNameError.error && userNameError.message}
  />
  <TextField
    label="Nombre"
    value={name}
    onChange={(event) => setName(event.target.value)}
    required
    style={{ margin: '8px 0' }}
    variant="outlined"
  />
  <Select
      labelId="gustos-label"
      id="gustos-select"
      value={gustos}
      onChange={(event) => setGustos(event.target.value)}
      required
      style={{ margin: '8px 0' }}
      variant="outlined"
  >
      <MenuItem value={"Heterosexual"}>Heterosexual</MenuItem>
      <MenuItem value={"Gay"}>Gay</MenuItem>
      <MenuItem value={"Bisexual"}>Bisexual</MenuItem>
      <MenuItem value={"Otros"}>Otros</MenuItem>
  </Select>
  <Select
                  labelId="sex-label"
                  id="sex-select"
                  value={sex}
                  onChange={(event) => setSex(event.target.value)}
                  required
                  style={{ margin: '8px 0' }}
                  variant="outlined"
                  >
      <MenuItem value={"Masculino"}>Masculino</MenuItem>
      <MenuItem value={"Femenino"}>Femenino</MenuItem>
      <MenuItem value={"Indefinido"}>Indefinido</MenuItem>
 
</Select>    <Button type="submit" variant="contained" color="primary" style={{ margin: '8px 0' }}>Register</Button>
</form>
 )}
 </div>
 </div>
 </ThemeProvider>
 );
}

export default LoginForm;