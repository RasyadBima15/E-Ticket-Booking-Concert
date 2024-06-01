from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from flask_jwt_extended import JWTManager

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/e-ticket-concert'
app.config['JWT_SECRET_KEY'] = '09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7'

db = SQLAlchemy(app)
jwt = JWTManager(app)

if __name__ == '__main__':
    app.run(debug=True)
