from . import payment_bp
from flask import request, jsonify
from Model.model import Payment
from main import db

# Create proof of payment
@payment_bp.route('/payment', methods=['POST'])
def create_payment():
    try:
        data = request.json
        user_id = data.get('IdUser')
        ticket_id = data.get('IdTicket')
        payment_date = data.get('PaymentDate')
        amount = data.get('Amount')

        new_payment = Payment(IdUser=user_id, IdTicket=ticket_id, PaymentDate=payment_date, Amount=amount)

        db.session.add(new_payment)
        db.session.commit()

        return jsonify({'message': 'Payment created successfully', 'payment_id': new_payment.IdPayment}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to create payment. Error: {str(e)}'}), 500
    
#get all payments
@payment_bp.route('/payment', methods=['GET'])
def get_all_payments():
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
@payment_bp.route('/payment/user/<int:user_id>', methods=['GET'])
def get_payments_by_user(user_id):
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


