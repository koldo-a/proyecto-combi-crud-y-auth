from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# Configura la conexión a la base de datos MySQL
db = mysql.connector.connect(
    host='127.0.0.1',
    port='3306',
    user='root',
    password='estibaliZ1.',
    database='fullstack_bottega'
)

# Ruta para el registro de usuarios
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data['email']
    
    # Verifica si el usuario ya está registrado
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE email_users=%s", (email,))
    result = cursor.fetchone()
    
    if result is not None:
        return jsonify({'message': 'El usuario ya está registrado'}), 400
    
    # Inserta el nuevo usuario en la base de datos
    cursor.execute("INSERT INTO users (email_users) VALUES (%s)", (email,))
    db.commit()
    
    return jsonify({'message': 'Registro exitoso'}), 200

# Ruta para la autenticación de usuarios
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    
    # Verifica si el usuario existe en la base de datos
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE email_users=%s", (email,))
    result = cursor.fetchone()
    if result is None:
        return jsonify({'message': 'Usuario no encontrado'}), 404
    idusers = result[0]
    success_message = f'Inicio de sesión exitoso para el usuario con id: {idusers} y el email:{email}'
    # Retornar el mensaje de éxito junto con el id_users en la respuesta JSON
    return jsonify({'message': success_message }), 200

# Ruta para el cierre de sesión
@app.route('/logout', methods=['GET'])
def logout():
    # Realiza las acciones necesarias para cerrar sesión, como limpiar las cookies o el estado de autenticación
    return jsonify({'message': 'Sesión cerrada exitosamente'}), 200

# Ruta para verificar el estado de autenticación
@app.route('/check-authentication', methods=['GET'])
def check_authentication():
    # Aquí puedes realizar la lógica para verificar si el usuario está autenticado o no
    # Puedes usar cookies, tokens u otros métodos de autenticación según tu implementación
    # En este ejemplo, simplemente devolvemos un estado de autenticación aleatorio para demostración
    is_authenticated = True  # Aquí debes implementar tu propia lógica de autenticación
    
    return jsonify({'isLoggedIn': is_authenticated}), 200

# Rutas para las operaciones CRUD
@app.route('/items', methods=['GET', 'POST'])
def handle_items():
    if request.method == 'GET':
        # Consulta SQL para obtener todos los registros de la tabla
        query = 'SELECT * FROM items'

        # Ejecutar la consulta
        cursor = db.cursor()
        cursor.execute(query)

        # Obtener los resultados y construir la lista de elementos
        items = []
        for item in cursor.fetchall():
            item_data = {
                'id': item[0],
                'name': item[1]
            }
            items.append(item_data)

        return jsonify(items)

    elif request.method == 'POST':
        item = request.json.get('name')
        if item:
            # Consulta SQL para insertar un nuevo registro en la tabla
            query = 'INSERT INTO items (name) VALUES (%s)'

            # Datos del nuevo elemento
            item_data = (item,)

            # Ejecutar la consulta
            cursor = db.cursor()
            cursor.execute(query, item_data)
            db.commit()

            return jsonify({'message': 'Item added successfully'})
        else:
            return jsonify({'error': 'Invalid item'})

#----------------------------------------------------------------
# Rutas para las operaciones CRUD
@app.route('/users', methods=['GET'])
def handle_users():
    if request.method == 'GET':
        # Consulta SQL para obtener todos los registros de la tabla
        query = 'SELECT * FROM users ORDER BY idusers'

        # Ejecutar la consulta
        cursor = db.cursor()
        cursor.execute(query)

        # Obtener los resultados y construir la lista de elementos
        users = []
        for u in cursor.fetchall():
            u_data = {
                'idusers': u[0],
                'name': u[1]
            }
            users.append(u_data)

        return jsonify(users)


#----------------------------------------------------------------



@app.route('/items/<int:index>', methods=['DELETE', 'PUT'])
def handle_item_by_index(index):
    if request.method == 'DELETE':
        # Consulta SQL para eliminar un registro de la tabla
        query = 'DELETE FROM items WHERE id = %s'

        # Datos del índice del elemento a eliminar
        item_index = (index,)

        # Ejecutar la consulta
        cursor = db.cursor()
        cursor.execute(query, item_index)
        db.commit()

        return jsonify({'message': 'Item deleted successfully'})

    elif request.method == 'PUT':
        new_name = request.json.get('name')
        if new_name:
            # Consulta SQL para actualizar un registro de la tabla
            query = 'UPDATE items SET name = %s WHERE id = %s'

            # Datos del nuevo nombre y el índice del elemento a editar
            item_data = (new_name, index)

            # Ejecutar la consulta
            cursor = db.cursor()
            cursor.execute(query, item_data)
            db.commit()

            return jsonify({'message': 'Item edited successfully'})
        else:
            return jsonify({'error': 'Invalid item'})

if __name__ == '__main__':
    app.run(debug=True)
