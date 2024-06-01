from . import concert_bp
from flask import request, jsonify
from Model.model import Concert
from main import db

#CONCERT
# Rute untuk menambahkan concert baru
@concert_bp.route('/concert', methods=['POST'])
def create_concert():
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

        return jsonify({'message': 'Concert created successfully', 'concert_id': new_concert.IdConcert}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to create concert. Error: {str(e)}'}), 500

@concert_bp.route('/concert/<int:concert_id>', methods=['GET'])
def get_concert(concert_id):
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
@concert_bp.route('/concert', methods=['GET'])
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
@concert_bp.route('/concert/<int:concert_id>', methods=['PUT'])
def update_concert(concert_id):
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

        return jsonify({'message': 'Concert updated successfully', 'concert_id': concert_id}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to update concert. Error: {str(e)}'}), 500


# Rute untuk menghapus concert berdasarkan ID
@concert_bp.route('/concert/<int:concert_id>', methods=['DELETE'])
def delete_concert(concert_id):
    try:
        concert = Concert.query.get(concert_id)

        if not concert:
            return jsonify({'message': 'Concert not found'}), 404

        db.session.delete(concert)
        db.session.commit()

        return jsonify({'message': 'Concert deleted successfully', 'concert_id': concert_id}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to delete concert. Error: {str(e)}'}), 500
