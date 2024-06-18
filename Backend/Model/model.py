#Model/model
from db import db

#class models
class User(db.Model):
    __tablename__ = 'User'

    idUser = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Username = db.Column(db.String(50), nullable=False, unique=True)
    Password = db.Column(db.String(255), nullable=False)
    Fullname = db.Column(db.String(100))
    Email = db.Column(db.String(100), unique=True)
    NoTelp = db.Column(db.String(15))
    Gender = db.Column(db.String(10))
    Role = db.Column(db.Enum('User', 'Admin'), nullable=False)
    Balance = db.Column(db.Integer, default=100000)

class Band(db.Model):
    __tablename__ = 'Band'

    IdBand = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Name = db.Column(db.String(100), nullable=False)
    ImageBand = db.Column(db.String(255), nullable=False)
    IdConcert = db.Column(db.Integer, db.ForeignKey('Concert.IdConcert'))
 
class Concert(db.Model):
    __tablename__ = 'Concert'

    IdConcert = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Nama = db.Column(db.String(100), nullable=False)
    Lokasi = db.Column(db.String(150), nullable=False)
    ImageConcert = db.Column(db.String(255), nullable=False)
    StartDate = db.Column(db.Date, nullable=False)
    EndDate = db.Column(db.Date, nullable=False)
    Deskripsi = db.Column(db.Text, nullable=False)

class Ticket(db.Model):
    __tablename__ = 'Ticket'
    
    IdTicket = db.Column(db.Integer, primary_key=True, autoincrement=True)
    IdConcert = db.Column(db.Integer, db.ForeignKey('Concert.IdConcert'))
    TicketType = db.Column(db.Enum('VIP', 'Umum'), nullable=False)
    Status = db.Column(db.Enum('Available', 'Soldout'), nullable=False)
    Price = db.Column(db.Integer, nullable=False)

class Payment(db.Model):
    __tablename__ = 'Payment'

    IdPayment = db.Column(db.Integer, primary_key=True, autoincrement=True)
    IdUser = db.Column(db.Integer, db.ForeignKey('User.idUser'))
    IdTicket = db.Column(db.Integer, db.ForeignKey('Ticket.IdTicket'))
    PaymentDate = db.Column(db.Date, nullable=False)
    Amount = db.Column(db.Integer, nullable=False)