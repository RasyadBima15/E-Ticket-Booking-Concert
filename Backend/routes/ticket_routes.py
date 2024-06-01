from . import ticket_bp
from flask import request, jsonify
from Model.model import Ticket
from main import db

#Post Ticket by Admin
@ticket_bp.route('/ticket', methods=['POST'])
def create_ticket():
    try:
        data = request.json
        id_concert = data.get('IdConcert')
        ticket_type = data.get('TicketType')
        status = data.get('Status')
        price = data.get('Price')

        new_ticket = Ticket(IdConcert=id_concert, TicketType=ticket_type, Status=status, Price=price)

        db.session.add(new_ticket)
        db.session.commit()

        return jsonify({'message': 'Ticket created successfully', 'ticket_id': new_ticket.IdTicket}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to create ticket. Error: {str(e)}'}), 500
    
#Get All Tickets
@ticket_bp.route('/ticket', methods=['GET'])
def get_all_tickets():
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
@ticket_bp.route('/ticket/<int:concert_id>', methods=['GET'])
def get_tickets_by_concert(concert_id):
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


#Update Ticket Status if the User has purchased a ticket  
@ticket_bp.route('/ticket/<int:ticket_id>', methods=['PUT'])
def update_ticket(ticket_id):
    try:
        data = request.json
        new_status = data.get('Status')

        ticket = Ticket.query.get(ticket_id)

        if not ticket:
            return jsonify({'message': 'Ticket not found'}), 404

        ticket.Status = new_status

        db.session.commit()

        return jsonify({'message': 'Ticket status updated successfully', 'ticket_id': ticket_id}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to update ticket status. Error: {str(e)}'}), 500