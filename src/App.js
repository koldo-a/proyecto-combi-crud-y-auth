import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './styles/App.scss';

const App = () => {
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [items, setItems] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

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

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/items');
      setItems(response.data);
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
        await axios.post('http://localhost:5000/items', { name: inputValue });
        setInputValue('');
        fetchItems();
      } catch (error) {
        console.error('Error adding item:', error);
      }
    }
  };

  const handleEditItem = (id) => {
    const newName = prompt('Enter the new name');
    if (newName) {
      try {
        axios.put(`http://localhost:5000/items/${id}`, { name: newName });
        fetchItems();
      } catch (error) {
        console.error('Error editing item:', error);
      }
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/items/${id}`);
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', { email: email });
      console.log(response.data.message);
      setIsLoggedIn(true); // Establecer el estado isLoggedIn a true cuando se inicia sesión correctamente
      fetchItems(); // Cargar los elementos desde el servidor después de iniciar sesión
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get('http://localhost:5000/logout');
      console.log(response.data.message);
      setIsLoggedIn(false); // Establecer el estado isLoggedIn a false cuando se cierra sesión correctamente
      setItems([]); // Borrar la lista de elementos después de cerrar sesión
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
                {item.id} - {item.name}
                <button className='button-edit' onClick={() => handleEditItem(item.id)}>Edit</button>
                <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
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
        </div>
      )}
    </div>
  );
};

export default App;
