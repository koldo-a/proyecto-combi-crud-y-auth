import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

import './styles/App.scss';
import Home from './home';

const App = () => {
  const [email, setEmail] = useState('');
  const [idusers, setIdUsers] = useState(null); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [items, setItems] = useState([]);
  const [editMode] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [registerMessage, setregisterMessage] = useState('');
  const navigate = useNavigate();


  const showLoginMessage = (message) => {
    setLoginMessage(message);

    setTimeout(() => {
      setLoginMessage('');
    }, 5000); 
  };
  const showregisterMessage = (message) => {
    setregisterMessage(message);

    setTimeout(() => {
      setregisterMessage('');
    }, 5000);
  };


  const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:5000/login', { email: email });
    if (response.status === 200) {
      console.log(response.status);
      showLoginMessage(response.data.message); 
      setIsLoggedIn(true);
      setIdUsers(response.data.idusers); 
      fetchItems();
    }
  } catch (error) {
      showLoginMessage(error.response.data.message); 
      console.error(error.response.data.message);
  }
  };

  const handleLogout = async () => {
  try {
    const response = await axios.get('http://localhost:5000/logout');
    console.log(response.data.message);
    setIsLoggedIn(false); 
    setItems([]); 
    navigate('/login');
    setEmail('');
    setIdUsers(null);
  } catch (error) {
    console.error(error.response.data.message);
  }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/register', { email: email });
      if (response.status === 200) {
        showregisterMessage(response.data.message);
        setEmail('');
      }
    } catch (error) {
        showregisterMessage(error.response.data.message);
        console.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (idusers !== null) {
      fetchItems();
    }
  }, [idusers]);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/items');
      setItems(response.data.filter(item => item.itemiduser === idusers));
      console.log(response.data);
      console.log(email)
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };  

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddItem = async () => {
    if (inputValue) {
      try {
        const response = await axios.post('http://localhost:5000/items', { name: inputValue, itemiduser: idusers });
        setInputValue('');
        fetchItems();
        console.log(response.data.message);
      } catch (error) {
        console.error('Error adding item:', error);
      }
    }
  };

  const handleEditItem = (id) => {
    const newName = prompt('Enter the new name');
    if (newName) {
      try {
        axios.put(`http://localhost:5000/items/${id}`, { name: newName })
          .then(() => fetchItems()) 
          .catch((error) => console.error('Error editing item:', error));
      } catch (error) {
        console.error('Error editing item:', error);
      }
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/items/${id}`);
      fetchItems();
      console.log(response.data.message);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };


  return (
    <div className='container1'>
      <Home />
      <div className='messages'>
        <div className={`login-msg ${registerMessage ? 'visible' : ''}`}>{registerMessage}</div>
        <div className={`login-msg ${loginMessage ? 'visible' : ''}`}>{loginMessage}</div>
      </div>
      {isLoggedIn ? (
        <div className='container'>
          <div className='container-heading'>
            <p>Bienvenido <b>{email}</b>! Estás autenticado.</p>
            <button className='cerrar-button' onClick={handleLogout}>Cerrar sesión</button>
          </div>
          <div className='subcontainer'>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter an item"
            />
            <button onClick={handleAddItem}>{editMode ? 'Save' : 'Add'}</button>

            <button onClick={fetchItems}>Read from Database</button>
          </div>
          <ul className='listado-items'>
            {items.map((item) => (
              <li key={item.id}>
                <div className='texto-li'>{item.id} - {item.name}</div> 
                <div className='li-buttons'>
                  <button className='button-edit' onClick={() => handleEditItem(item.id)}>Edit</button>
                  <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
                </div>
              </li>
            ))}


          </ul>
          
        </div>
      ) : (
        <div className='login'>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
          />
          <button onClick={handleLogin}>Iniciar sesión</button>
          <button onClick={handleRegister}>Registrar</button>
        </div>
      )}

        <div className='author'>Author:&nbsp;<a href='koldo.arretxea@gmail.com>'>koldo.arretxea@gmail.com</a></div>
    </div>
  );
};

export default App;
