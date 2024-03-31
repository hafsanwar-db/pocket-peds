from flask import Flask, request, jsonify
from pymongo.mongo_client import MongoClient
from dotenv import load_dotenv
import os
from passlib.hash import bcrypt
from bson import ObjectId
from flask_jwt_extended import JWTManager, create_access_token, jwt_required,get_jwt_identity
app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "PocketPedsUMDADC" #every access token will be signed with this
jwt = JWTManager(app)


#Authorization: even if a user is authenticated (i.e., they have a valid JWT token), you might still want to verify that they have the authority to perform certain operations


# Connect to MongoDB Atlas
load_dotenv()
connection_string = os.getenv('connection_string')
client = MongoClient(connection_string)
db = client['PocketPeds']
child_profiles = db['child_profiles']
user_profiles = db['user_profiles']

#dummy userid
user_id = 1

# API endpoint for creating a new user profile
@app.route('/register',methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'Invalid data'}), 400

    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    if not username or not password or not email:
        return jsonify({'error': 'Missing required fields'}), 400

    # Check if the username or email already exists
    if user_profiles.find_one({'$or': [{'username': username}, {'email': email}]}):
        return jsonify({'error': 'Username or email already exists'}), 400

    # Hash the password
    hashed_password = bcrypt.hash(password)

    # Insert user into MongoDB
    user = {'_id': ObjectId(),'username': username, 'hashed_password': hashed_password, 'email': email}
    user_profiles.insert_one(user)

    return jsonify({'message': 'User registered successfully'}), 201

# API endpoint for logging in a new user profile.
@app.route('/login',methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'Invalid data'}), 400
    username = data.get('username')
    password = data.get('password')
    user = user_profiles.find_one({'username': username})

    if not user or not bcrypt.verify(password, user['password']):
        return jsonify({'error': 'Invalid username or password'}), 401
    
    # Generate access token
    access_token = create_access_token(identity=user['username'])

    return jsonify({'access_token': access_token}), 200

@app.route('/user-profiles/<username>', methods=['GET'])
@jwt_required # Route requires authentication
def get_user_profile(username):
    # Check if user is authenticated and authorized
    # Add your authentication and authorization logic here (**DONE**)

    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    if current_user['username'] != username:
        # If the current user's username does not match the requested username,
        # it means they are not authorized to access this profile.
        return jsonify({'message': 'Unauthorized access to user profile'}), 403

    # Retrieve the user profile from the database
    user_profile = user_profiles.find_one({'username': current_user['username']})
    
    if not user_profile:
        return jsonify({'message': 'User profile not found'}), 404
    
    # Remove hashed password from the response (security reasons)
    user_profile.pop('hashed_password', None)

    return jsonify(user_profile), 200


# API endpoint for creating a new child profile
@app.route('/child-profiles',endpoint='createChild', methods=['POST']) 
@jwt_required #Route requires authentication
def create_child_profile():
    # Add authentication and authorization logic here
    current_user = get_jwt_identity()
    
    # Validate incoming data
    data = request.get_json()
    if not data:
        return jsonify({'message': 'Invalid data'}), 400

    # Validate data format and content
    # The frontend will require it anyway
    if 'name' not in data or 'age' not in data or 'date_of_birth' not in data or 'weight' not in data:
        return jsonify({'message': 'Missing required fields'}), 400
    
    #getting the parent username
    parent_profile = user_profiles.find_one({'username': current_user['username']})
    if not parent_profile:
        return jsonify({'error': 'Parent profile not found'}), 404

    # Create a new child profile
    child_profile = {
        '_id': ObjectId(),
        'parent_id' : parent_profile['_id'],
        'name': data['name'],
        'age': data['age'],
        'date_of_birth': data['date_of_birth'],
        'weight': data['weight'],
        'allergies': data.get('allergies', []),
        'medications': data.get('medications', []),
    }

    # Add the child profile to the database
    child_profiles.insert_one(child_profile)
    print("the parent of the child is:", user_profiles.find_one({'_id': parent_profile['_id']})['username'])
    return jsonify({'message': 'Child profile created successfully'}), 201

# API endpoint for retrieving a child profile
@app.route('/child-profiles/<child_profile_id>',endpoint='getChild', methods=['GET'])
@jwt_required #Route requires authentication
def get_child_profile(child_profile_id):
    # Retrieve the child profile from the database
    child_profile = child_profiles.find_one({'_id': child_profile_id, 'user_id': user_id})

    current_user = get_jwt_identity()    
    if not child_profile:
        return jsonify({'message': 'Child profile not found'}), 404
    
    #only view child's profile if user is parent, just in case
    if child_profile['user_id'] != current_user['user_id']:
        return jsonify({'error': 'Unauthorized to view this child profile'}), 403

    return jsonify(child_profile), 200

# API endpoint for updating a child profile
@app.route('/child-profiles/<child_profile_id>', endpoint='updateChild',methods=['PUT'])
@jwt_required #Route requires authentication
def update_child_profile(child_profile_id):
    current_user = get_jwt_identity()

    # Validate incoming data
    data = request.get_json()
    if not data:
        return jsonify({'message': 'Invalid data'}), 400

    # Validate data format and content
    if 'name' not in data or 'age' not in data:
        return jsonify({'message': 'Missing required fields'}), 400

    child_profile = child_profiles.find_one({'_id': child_profile_id})

    if not child_profile:
        return jsonify({'error': 'Child profile not found'}), 404

    # Check if the user is authorized to update the child profile (Maybe not needed whem working with JWT)
    if child_profile['user_id'] != current_user['user_id']:
        return jsonify({'error': 'Unauthorized to update this child profile'}), 403

    # appending allergies and medications
    allergies = data.get('allergies', [])
    allergies.extend(child_profile['allergies'])
    data['allergies'] = allergies
    medications = data.get('medications', [])
    medications.extend(child_profile['medications'])
    data['medications'] = medications

    # Update the child profile in the database
    result = child_profiles.update_one({'_id': child_profile_id, 'user_id': user_id}, {'$set': data})

    if result.modified_count == 0:
        return jsonify({'message': 'Child profile not found'}), 404

    return jsonify({'message': 'Child profile updated successfully'}), 200

# API endpoint for deleting a child profile
@app.route('/child-profiles/<child_profile_id>', endpoint='deleteChild',methods=['DELETE'])
@jwt_required #Route requires authentication
def delete_child_profile(child_profile_id):
    #only the parent of the child can delete their profile
    current_user = get_jwt_identity()
    child_profile = child_profiles.find_one({'_id': child_profile_id})
    if child_profile['user_id'] != current_user['user_id']:
        return jsonify({'error': 'Unauthorized to delete this child profile'}), 403
    
    # Delete the child profile from the database
    result = child_profiles.delete_one({'_id': child_profile_id, 'user_id': user_id})

    if result.deleted_count == 0:
        return jsonify({'message': 'Child profile not found'}), 404

    return jsonify({'message': 'Child profile deleted successfully'}), 200

#for testing if mongoDb is connected or not
def try_ping():
    child_profiles = db['child_profiles']
    print(child_profiles.find_one({'name': 'timmy'}))
    print("Pinged your deployment. You successfully connected to MongoDB!")

if __name__ == '__main__':
    # try_ping()
    app.run()
