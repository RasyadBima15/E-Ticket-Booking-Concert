from . import band_bp
from flask import request, jsonify
from Model.model import Band
from main import db

#BAND
# Rute untuk membuat band baru
@band_bp.route('/band', methods=['POST'])
def create_band():
    try:
        data = request.json
        name = data.get('Name')
        image_band = data.get('ImageBand')
        id_concert = data.get('IdConcert')

        new_band = Band(Name=name, ImageBand=image_band, IdConcert=id_concert)

        db.session.add(new_band)
        db.session.commit()

        return jsonify({'message': 'Band created successfully', 'band_id': new_band.IdBand}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to create band. Error: {str(e)}'}), 500
    
# Rute untuk mengambil data band berdasarkan IdBand tertentu
@band_bp.route('/band/<int:band_id>', methods=['GET'])
def get_band(band_id):
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
@band_bp.route('/band/concert/<int:concert_id>', methods=['GET'])
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
@band_bp.route('/band/<int:band_id>', methods=['PUT'])
def update_band(band_id):
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

        return jsonify({'message': 'Band updated successfully', 'band_id': band_id}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to update band. Error: {str(e)}'}), 500


# Rute untuk menghapus band berdasarkan ID
@band_bp.route('/band/<int:band_id>', methods=['DELETE'])
def delete_band(band_id):
    try:
        band = Band.query.get(band_id)

        if not band:
            return jsonify({'message': 'Band not found'}), 404

        db.session.delete(band)
        db.session.commit()

        return jsonify({'message': 'Band deleted successfully', 'band_id': band_id}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to delete band. Error: {str(e)}'}), 500