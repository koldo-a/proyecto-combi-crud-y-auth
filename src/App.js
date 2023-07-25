import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importa el hook useHistory

import './styles/App.scss';

const App = () => {
  const [email, setEmail] = useState('');
  const [idusers, setIdUsers] = useState(null); // Nuevo estado para almacenar el id del usuario
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [items, setItems] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [loginMessage, setLoginMessage] = useState('');
  const [registerMessage, setregisterMessage] = useState('');
  const navigate = useNavigate(); // Obtén el objeto de historial


  useEffect(() => {
    // Verificar el estado de autenticación al cargar el componente
/*     const checkAuthentication = async () => {
      try {
        const response = await axios.get('http://localhost:5000/check-authentication');
        setIsLoggedIn(response.data.isLoggedIn);
        if (response.data.isLoggedIn) {
          fetchItems();
        }
      } catch (error) {
        console.error('Error al verificar la autenticación:', error);
      }
    };

    checkAuthentication(); */
  }, []);

    // Función para mostrar el mensaje de inicio de sesión y luego ocultarlo después de 2 segundos
const showLoginMessage = (message) => {
  setLoginMessage(message);

  setTimeout(() => {
    setLoginMessage('');
  }, 5000); // 5000 milisegundos 
};
const showregisterMessage = (message) => {
  setregisterMessage(message);

  setTimeout(() => {
    setregisterMessage('');
  }, 5000); // 5000 milisegundos
};

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
/*     const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/items');
      const itemsWithUserEmail = await Promise.all(
        response.data.map(async (item) => {
          // Obtener el email del usuario correspondiente al itemiduser
          const userResponse = await axios.get(`http://localhost:5000/user/${item.itemiduser}`);
          const userEmail = userResponse.data.email_users;
          
          return {
            ...item,
            email: userEmail,
          };
        })
      );

      console.log('itemsWithUserEmail:', itemsWithUserEmail);

      setItems(itemsWithUserEmail);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };   */
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  
  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/register', { email: email });
      if (response.status === 200) {
        showregisterMessage(response.data.message); // Actualizar el mensaje de inicio de sesión en el estado
        setEmail('');
      }
    } catch (error) {
        showregisterMessage(error.response.data.message); // Actualizar el mensaje de error en caso de error de inicio de sesión
        console.error(error.response.data.message);
    }
  };


  const handleAddItem = async () => {
    if (inputValue) {
      try {
        const response = await axios.post('http://localhost:5000/items', { name: inputValue, itemiduser: idusers });
        setInputValue('');
        fetchItems();
        console.log(response.data.message); // Muestra el mensaje del servidor en la consola
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
          .then(() => fetchItems()) // Asegúrate de actualizar la lista de elementos después de editar
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
      console.log(response.data.message); // Muestra el mensaje del servidor en la consola
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', { email: email });
      if (response.status === 200) {
        showLoginMessage(response.data.message); // Mostrar el mensaje de inicio de sesión
        setIsLoggedIn(true);
        setIdUsers(response.data.idusers); // Almacena el id del usuario en el estado
        fetchItems();
      }
    } catch (error) {
        showLoginMessage(error.response.data.message); // Actualizar el mensaje de error en caso de error de inicio de sesión
        console.error(error.response.data.message);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get('http://localhost:5000/logout');
      console.log(response.data.message);
      setIsLoggedIn(false); // Establecer el estado isLoggedIn a false cuando se cierra sesión correctamente
      setItems([]); // Borrar la lista de elementos después de cerrar sesión
      // Redirige al usuario a la página de inicio de sesión después del cierre de sesión
      navigate('/login');
      setEmail('');
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <div className='container'>
      {isLoggedIn ? (
        <div>
          <p>Bienvenido {email}! Estás autenticado.</p>
          <button onClick={handleLogout}>Cerrar sesión</button>

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
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                {item.id} - {item.name} <div className='by-user'>by user: {email}</div>
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
    <div className={`login-msg ${registerMessage ? 'visible' : ''}`}>{registerMessage}</div>
    <div className={`login-msg ${loginMessage ? 'visible' : ''}`}>{loginMessage}</div>
    </div>

  );
};

export default App;
