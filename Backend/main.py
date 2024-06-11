#main.py
from datetime import datetime
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, current_user, jwt_required
from werkzeug.security import check_password_hash, generate_password_hash
from Model.model import User, Concert, Payment, Ticket, Band
from db import db
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins="http://localhost:3000")

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/e-ticket-concert'
app.config['JWT_SECRET_KEY'] = '09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 86400

jwt = JWTManager(app)
db.init_app(app)

@jwt.user_lookup_loader
def _user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.filter(User.Username==identity).first()

#REGISTER
@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    username = data.get('Username')
    password = data.get('Password')
    role = data.get('Role')

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

    return jsonify({'message': 'User registered successfully'}), 201
    
#LOGIN     
@app.route('/login', methods=['POST'])
def login_user():
    data = request.json
    username = data.get('Username')
    password = data.get('Password')

    user = User.query.filter_by(Username=username).first()

    if user and check_password_hash(user.Password, password):
        access_token = create_access_token(identity=username)
        return jsonify({'message': 'Login successful', 'access_token': access_token, 'role': user.Role}), 200
    else:
        return jsonify({'message': 'Invalid username or password'}), 401  

# Update the user's identity when filling out the order form
@app.route('/user/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    if current_user.Role == "Admin":
        return jsonify({'message': 'Hanya User yang bisa mengakses endpoint ini!'}), 404
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

        return jsonify({'message': 'User updated successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to update user. Error: {str(e)}'}), 500
    
#BAND
# Rute untuk membuat band baru
@app.route('/band', methods=['POST'])
@jwt_required()
def create_band():
    if current_user.Role == "User":
        return jsonify({'message': 'Hanya Admin yang bisa mengakses endpoint ini!'}), 404
    try:
        data = request.json
        name = data.get('Name')
        image_band = data.get('ImageBand')
        id_concert = data.get('IdConcert')

        new_band = Band(Name=name, ImageBand=image_band, IdConcert=id_concert)

        db.session.add(new_band)
        db.session.commit()

        return jsonify({'message': 'Band created successfully'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to create band. Error: {str(e)}'}), 500
    
# Rute untuk melihat semua concert
@app.route('/bands', methods=['GET'])
@jwt_required()
def get_all_bands():
    try:
        bands = Band.query.all()

        if not bands:
            return jsonify({'message': 'No bands found'}), 404

        bands_data = []
        for band in bands:
            bands_data.append({
                'IdBand': band.IdBand,
                'Name': band.Name,
                'ImageBand': band.ImageBand,
                'IdConcert': band.IdConcert,
            })

        return jsonify(bands_data), 200

    except Exception as e:
        return jsonify({'message': f'Failed to retrieve bands. Error: {str(e)}'}), 500
    
# Rute untuk mengambil data band berdasarkan IdBand tertentu
@app.route('/band/<int:band_id>', methods=['GET'])
@jwt_required()
def get_band(band_id):
    if current_user.Role == "User":
        return jsonify({'message': 'Hanya Admin yang bisa mengakses endpoint ini!'}), 404
    try:
        band = Band.query.get(band_id)

        if not band:
            return jsonify({'message': 'Band not found'}), 404

        return jsonify({
            'band_id': band.IdBand,
            'name': band.Name,
            'image_band': band.ImageBand,
            'id_concert': band.IdConcert
        }), 200

    except Exception as e:
        return jsonify({'message': f'Failed to retrieve band details. Error: {str(e)}'}), 500

# Rute untuk mengambil data band berdasarkan IdConcert tertentu
@app.route('/band/concert/<int:concert_id>', methods=['GET'])
@jwt_required()
def get_band_by_concert(concert_id):
    try:
        bands = Band.query.filter_by(IdConcert=concert_id).all()

        if not bands:
            return jsonify({'message': 'No bands found for the specified concert'}), 404

        bands_data = []
        for band in bands:
            bands_data.append({
                'band_id': band.IdBand,
                'name': band.Name,
                'image_band': band.ImageBand,
                'id_concert': band.IdConcert
            })

        return jsonify(bands_data), 200

    except Exception as e:
        return jsonify({'message': f'Failed to retrieve bands for the specified concert. Error: {str(e)}'}), 500

# Rute untuk mengupdate detail band berdasarkan ID
@app.route('/band/<int:band_id>', methods=['PUT'])
@jwt_required()
def update_band(band_id):
    if current_user.Role == "User":
        return jsonify({'message': 'Hanya Admin yang bisa mengakses endpoint ini!'}), 404
    try:
        data = request.json
        name = data.get('Name')
        image_band = data.get('ImageBand')
        id_concert = data.get('IdConcert')

        band = Band.query.get(band_id)

        if not band:
            return jsonify({'message': 'Band not found'}), 404

        if name:
            band.Name = name
        if image_band:
            band.ImageBand = image_band
        if id_concert:
            band.IdConcert = id_concert

        db.session.commit()

        return jsonify({'message': 'Band updated successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to update band. Error: {str(e)}'}), 500


# Rute untuk menghapus band berdasarkan ID
@app.route('/band/<int:band_id>', methods=['DELETE'])
@jwt_required()
def delete_band(band_id):
    if current_user.Role == "User":
        return jsonify({'message': 'Hanya Admin yang bisa mengakses endpoint ini!'}), 404
    try:
        band = Band.query.get(band_id)

        if not band:
            return jsonify({'message': 'Band not found'}), 404

        db.session.delete(band)
        db.session.commit()

        return jsonify({'message': 'Band deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to delete band. Error: {str(e)}'}), 500
    
#CONCERT
# Rute untuk menambahkan concert baru
@app.route('/concert', methods=['POST'])
@jwt_required()
def create_concert():
    if current_user.Role == "User":
        return jsonify({'message': 'Hanya Admin yang bisa mengakses endpoint ini!'}), 404
    try:
        data = request.json
        nama = data.get('Nama')
        lokasi = data.get('Lokasi')
        image_concert = data.get('ImageConcert')
        start_date = data.get('StartDate')
        end_date = data.get('EndDate')
        deskripsi = data.get('Deskripsi')

        new_concert = Concert(Nama=nama, Lokasi=lokasi, ImageConcert=image_concert, 
                              StartDate=start_date, EndDate=end_date, Deskripsi=deskripsi)

        db.session.add(new_concert)
        db.session.commit()

        return jsonify({'message': 'Concert created successfully'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to create concert. Error: {str(e)}'}), 500

@app.route('/concert/<int:concert_id>', methods=['GET'])
@jwt_required()
def get_concert(concert_id):
    if current_user.Role == "User":
        return jsonify({'message': 'Hanya Admin yang bisa mengakses endpoint ini!'}), 404
    try:
        concert = Concert.query.get(concert_id)

        if not concert:
            return jsonify({'message': 'Concert not found'}), 404

        return jsonify({
            'concert_id': concert.IdConcert,
            'nama': concert.Nama,
            'lokasi': concert.Lokasi,
            'image_concert': concert.ImageConcert,
            'start_date': concert.StartDate,
            'end_date': concert.EndDate,
            'deskripsi': concert.Deskripsi
        }), 200

    except Exception as e:
        return jsonify({'message': f'Failed to retrieve concert details. Error: {str(e)}'}), 500

# Rute untuk melihat semua concert
@app.route('/concert', methods=['GET'])
@jwt_required()
def get_all_concerts():
    try:
        concerts = Concert.query.all()

        if not concerts:
            return jsonify({'message': 'No concerts found'}), 404

        concerts_data = []
        for concert in concerts:
            concerts_data.append({
                'concert_id': concert.IdConcert,
                'nama': concert.Nama,
                'lokasi': concert.Lokasi,
                'image_concert': concert.ImageConcert,
                'start_date': concert.StartDate,
                'end_date': concert.EndDate,
                'deskripsi': concert.Deskripsi
            })

        return jsonify(concerts_data), 200

    except Exception as e:
        return jsonify({'message': f'Failed to retrieve concerts. Error: {str(e)}'}), 500

# Rute untuk mengedit detail concert berdasarkan ID
@app.route('/concert/<int:concert_id>', methods=['PUT'])
@jwt_required()
def update_concert(concert_id):
    if current_user.Role == "User":
        return jsonify({'message': 'Hanya Admin yang bisa mengakses endpoint ini!'}), 404
    try:
        data = request.json
        nama = data.get('Nama')
        lokasi = data.get('Lokasi')
        image_concert = data.get('ImageConcert')
        start_date = data.get('StartDate')
        end_date = data.get('EndDate')
        deskripsi = data.get('Deskripsi')

        concert = Concert.query.get(concert_id)

        if not concert:
            return jsonify({'message': 'Concert not found'}), 404
        
        if nama:
            concert.Nama = nama
        if lokasi:
            concert.Lokasi = lokasi
        if image_concert:
            concert.ImageConcert = image_concert
        if start_date:
            concert.StartDate = start_date
        if end_date:
            concert.EndDate = end_date
        if deskripsi:
            concert.Deskripsi = deskripsi

        db.session.commit()

        return jsonify({'message': 'Concert updated successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to update concert. Error: {str(e)}'}), 500


# Rute untuk menghapus concert berdasarkan ID
@app.route('/concert/<int:concert_id>', methods=['DELETE'])
@jwt_required()
def delete_concert(concert_id):
    if current_user.Role == "User":
        return jsonify({'message': 'Hanya Admin yang bisa mengakses endpoint ini!'}), 404
    try:
        concert = Concert.query.get(concert_id)

        if not concert:
            return jsonify({'message': 'Concert not found'}), 404

        db.session.delete(concert)
        db.session.commit()

        return jsonify({'message': 'Concert deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to delete concert. Error: {str(e)}'}), 500
    
#Post Ticket by Admin
@app.route('/ticket', methods=['POST'])
@jwt_required()
def create_ticket():
    if current_user.Role == "User":
        return jsonify({'message': 'Hanya Admin yang bisa mengakses endpoint ini!'}), 404
    try:
        data = request.json
        id_concert = data.get('IdConcert')
        ticket_type = data.get('TicketType')
        status = "Available"
        price = data.get('Price')

        new_ticket = Ticket(IdConcert=id_concert, TicketType=ticket_type, Status=status, Price=price)

        db.session.add(new_ticket)
        db.session.commit()

        return jsonify({'message': 'Ticket created successfully'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to create ticket. Error: {str(e)}'}), 500
    
#Get All Tickets
@app.route('/ticket', methods=['GET'])
@jwt_required()
def get_all_tickets():
    if current_user.Role == "User":
        return jsonify({'message': 'Hanya Admin yang bisa mengakses endpoint ini!'}), 404
    try:
        tickets = Ticket.query.all()

        if not tickets:
            return jsonify({'message': 'No tickets found'}), 404

        tickets_data = []
        for ticket in tickets:
            tickets_data.append({
                'ticket_id': ticket.IdTicket,
                'concert_id': ticket.IdConcert,
                'ticket_type': ticket.TicketType,
                'status': ticket.Status,
                'price': ticket.Price
            })

        return jsonify(tickets_data), 200

    except Exception as e:
        return jsonify({'message': f'Failed to retrieve tickets. Error: {str(e)}'}), 500
    
#Get Ticket By Concert
@app.route('/ticket/concert/<int:concert_id>', methods=['GET'])
@jwt_required()
def get_tickets_by_concert(concert_id):
    if current_user.Role == "User":
        return jsonify({'message': 'Hanya Admin yang bisa mengakses endpoint ini!'}), 404
    try:
        tickets = Ticket.query.filter_by(IdConcert=concert_id).all()

        if not tickets:
            return jsonify({'message': 'No tickets found for this concert'}), 404

        tickets_data = []
        for ticket in tickets:
            tickets_data.append({
                'ticket_id': ticket.IdTicket,
                'concert_id': ticket.IdConcert,
                'ticket_type': ticket.TicketType,
                'status': ticket.Status,
                'price': ticket.Price
            })

        return jsonify(tickets_data), 200

    except Exception as e:
        return jsonify({'message': f'Failed to retrieve tickets. Error: {str(e)}'}), 500


# Update Ticket Status if the User has purchased a ticket  
# @app.route('/ticket/<int:ticket_id>', methods=['PUT'])
# @jwt_required()
# def update_ticket(ticket_id):
#     if current_user.Role == "Admin":
#         return jsonify({'message': 'Hanya User yang bisa mengakses endpoint ini!'}), 404
#     try:
#         data = request.json
#         new_status = data.get('Status')

#         ticket = Ticket.query.get(ticket_id)

#         if not ticket:
#             return jsonify({'message': 'Ticket not found'}), 404

#         ticket.Status = new_status

#         db.session.commit()

#         return jsonify({'message': 'Ticket status updated successfully'}), 200

#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'message': f'Failed to update ticket status. Error: {str(e)}'}), 

# Create proof of payment
@app.route('/payment', methods=['POST'])
@jwt_required()
def create_payment():
    if current_user.Role == "Admin":
        return jsonify({'message': 'Hanya User yang bisa mengakses endpoint ini!'}), 404
    try:
        data = request.json
        user_id = data.get('IdUser')
        ticket_id = data.get('IdTicket')
        payment_date_str = data.get('PaymentDate')
        amount = data.get('Amount')

        payment_date = datetime.strptime(payment_date_str, "%Y-%m-%d").date()

        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404

        ticket = Ticket.query.get(ticket_id)
        if not ticket :
            return jsonify({'message': 'Ticket not found'}), 404
        
        if ticket.Status == "Soldout":
            return jsonify({'message': 'Ticket has been soldout'}), 404
        
        ticket.Status = "Soldout"

        if user.Balance < amount:
            return jsonify({'message': 'Insufficient balance'}), 400

        new_payment = Payment(IdUser=user_id, IdTicket=ticket_id, PaymentDate=payment_date, Amount=amount)

        user.Balance -= amount

        db.session.add(new_payment)
        db.session.commit()

        return jsonify({'message': 'Payment created successfully'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to create payment. Error: {str(e)}'}), 500
    
#get all payments
@app.route('/payment', methods=['GET'])
@jwt_required()
def get_all_payments():
    if current_user.Role == "User":
        return jsonify({'message': 'Hanya Admin yang bisa mengakses endpoint ini!'}), 404
    try:
        payments = Payment.query.all()

        if not payments:
            return jsonify({'message': 'No payments found'}), 404

        payments_data = []
        for payment in payments:
            payments_data.append({
                'payment_id': payment.IdPayment,
                'user_id': payment.IdUser,
                'ticket_id': payment.IdTicket,
                'payment_date': payment.PaymentDate,
                'amount': payment.Amount
            })

        return jsonify(payments_data), 200

    except Exception as e:
        return jsonify({'message': f'Failed to retrieve payments. Error: {str(e)}'}), 500

# Get payment by IdUser
@app.route('/payment/user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_payments_by_user(user_id):
    if current_user.Role == "Admin":
        return jsonify({'message': 'Hanya User yang bisa mengakses endpoint ini!'}), 404
    try:
        payments = Payment.query.filter_by(IdUser=user_id).all()

        if not payments:
            return jsonify({'message': 'No payments found for this user'}), 404

        payments_data = []
        for payment in payments:
            payments_data.append({
                'payment_id': payment.IdPayment,
                'user_id': payment.IdUser,
                'ticket_id': payment.IdTicket,
                'payment_date': payment.PaymentDate,
                'amount': payment.Amount
            })

        return jsonify(payments_data), 200

    except Exception as e:
        return jsonify({'message': f'Failed to retrieve payments. Error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
