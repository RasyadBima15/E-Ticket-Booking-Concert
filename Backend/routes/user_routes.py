from . import user_bp
from flask import request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash, generate_password_hash
from Model.model import User
from main import db

#REGISTER
@user_bp.route('/register', methods=['POST'])
def register_user():
    data = request.json
    username = data.get('Username')
    password = data.get('Password')
    role = data.get('Role', 'User')

    existing_user = User.query.filter_by(Username=username).first()
    if existing_user:
        return jsonify({'message': 'Username already exists'}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(Username=username, Password=hashed_password, Role=role)
    try:
        db.session.add(new_user)
        db.session.commit()
    except:
        db.session.rollback()
        return jsonify({'message': 'Failed to register user. Please try again later.'}), 500

    access_token = create_access_token(identity=username)
    return jsonify({'message': 'User registered successfully', 'access_token': access_token}), 201
    
#LOGIN     
@user_bp.route('/login', methods=['POST'])
def login_user():
    data = request.json
    username = data.get('Username')
    password = data.get('Password')

    user = User.query.filter_by(Username=username).first()

    if user and check_password_hash(user.Password, password):
        access_token = create_access_token(identity=username)
        return jsonify({'message': 'Login successful', 'access_token': access_token}), 200
    else:
        return jsonify({'message': 'Invalid username or password'}), 401  

# Update the user's identity when filling out the order form
@user_bp.route('/user/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        data = request.json
        new_fullname = data.get('Fullname')
        new_email = data.get('Email')
        new_phone_number = data.get('NoTelp')
        new_gender = data.get('Gender')

        user = User.query.get(user_id)

        if not user:
            return jsonify({'message': 'User not found'}), 404

        if new_fullname:
            user.Fullname = new_fullname
        if new_email:
            user.Email = new_email
        if new_phone_number:
            user.NoTelp = new_phone_number
        if new_gender:
            user.Gender = new_gender

        db.session.commit()

        return jsonify({'message': 'User updated successfully', 'user_id': user_id}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to update user. Error: {str(e)}'}), 500
 