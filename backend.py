
from flask import Flask, request, jsonify
from pymongo.mongo_client import MongoClient
app = Flask(__name__)

# Connect to MongoDB Atlas
client = MongoClient('mongodb+srv://swastikagrawal3:swastik@ctrlf.9wvxvoo.mongodb.net/')
db = client['PocketPeds']
child_profiles = db['child_profiles']


def try_ping():
    print(child_profiles.find_one({'name': 'timmy'}))
    print("Pinged your deployment. You successfully connected to MongoDB!")

# Dummy user ID for demonstration purposes
user_id = 1

# API endpoint for creating a new child profile
@app.route('/child-profiles', methods=['POST'])
def create_child_profile():
    # Add authentication and authorization logic here

    # Validate incoming data
    data = request.get_json()
    if not data:
        return jsonify({'message': 'Invalid data'}), 400

    # Validate data format and content
    if 'name' not in data or 'age' not in data:
        return jsonify({'message': 'Missing required fields'}), 400

    # Create a new child profile
    child_profile = {
        'user_id': user_id,
        'name': data['name'],
        'age': data['age']
    }

    # Add the child profile to the database
    child_profiles.insert_one(child_profile)

    return jsonify({'message': 'Child profile created successfully'}), 201

# API endpoint for retrieving a child profile
@app.route('/child-profiles/<child_profile_id>', methods=['GET'])
def get_child_profile(child_profile_id):
    # Check if user is authenticated and authorized
    # Add your authentication and authorization logic here

    # Retrieve the child profile from the database
    child_profile = child_profiles.find_one({'_id': child_profile_id, 'user_id': user_id})

    if not child_profile:
        return jsonify({'message': 'Child profile not found'}), 404

    return jsonify(child_profile), 200

# API endpoint for updating a child profile
@app.route('/child-profiles/<child_profile_id>', methods=['PUT'])
def update_child_profile(child_profile_id):
    # Check if user is authenticated and authorized
    # Add your authentication and authorization logic here

    # Validate incoming data
    data = request.get_json()
    if not data:
        return jsonify({'message': 'Invalid data'}), 400

    # Validate data format and content
    if 'name' not in data or 'age' not in data:
        return jsonify({'message': 'Missing required fields'}), 400

    # Update the child profile in the database
    result = child_profiles.update_one({'_id': child_profile_id, 'user_id': user_id}, {'$set': {'name': data['name'], 'age': data['age']}})

    if result.modified_count == 0:
        return jsonify({'message': 'Child profile not found'}), 404

    return jsonify({'message': 'Child profile updated successfully'}), 200

# API endpoint for deleting a child profile
@app.route('/child-profiles/<child_profile_id>', methods=['DELETE'])
def delete_child_profile(child_profile_id):
    # Check if user is authenticated and authorized
    # Add your authentication and authorization logic here

    # Delete the child profile from the database
    result = child_profiles.delete_one({'_id': child_profile_id, 'user_id': user_id})

    if result.deleted_count == 0:
        return jsonify({'message': 'Child profile not found'}), 404

    return jsonify({'message': 'Child profile deleted successfully'}), 200


if __name__ == '__main__':
    try_ping()
    # app.run()
