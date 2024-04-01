#NOTES: try using JWT idenitiy as the OBJECT ID of the user, makes it easier later on
from flask import Flask, request, jsonify
from pymongo.mongo_client import MongoClient
from dotenv import load_dotenv
import os
from passlib.hash import bcrypt
from bson import ObjectId
from flask_jwt_extended import JWTManager, create_access_token, jwt_required,get_jwt_identity
from datetime import datetime

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "PocketPedsUMDADC" #every access token will be signed with this
jwt = JWTManager(app)


#Authorization: even if a user is authenticated (i.e., they have a valid JWT token), you might still want to verify that they have the authority to perform certain operations


# Connect to MongoDB Atlas
load_dotenv()
connection_string = os.getenv('connectionString')
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

    if not user or not bcrypt.verify(password, user['hashed_password']):
        return jsonify({'error': 'Invalid username or password'}), 401
    
    # Generate access token
    access_token = create_access_token(identity=user['username'])

    return jsonify({'access_token': access_token}), 200

@app.route('/user-profiles/<username>', methods=['GET'])
@jwt_required() # Route requires authentication
def get_user_profile(username):
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    if current_user != username:
        # If the current user's username does not match the requested username,
        # it means they are not authorized to access this profile.
        return jsonify({'message': 'Unauthorized access to user profile'}), 403

    # Retrieve the user profile from the database
    user_profile = user_profiles.find_one({'username': current_user})
    
    if not user_profile:
        return jsonify({'message': 'User profile not found'}), 404
    
    # Remove hashed password from the response (security reasons)
    user_profile.pop('hashed_password', None)
    print("the user profile is:", user_profile)

    #converting into string so that it is JSON serializable
    user_profile['_id'] = str(user_profile['_id'])

    return user_profile, 200


# API endpoint for creating a new child profile
@app.route('/child-profiles',endpoint='createChild', methods=['POST']) 
@jwt_required() #Route requires authentication
def create_child_profile():
    # Add authentication and authorization logic here
    current_user = get_jwt_identity()
    
    # Validate incoming data
    data = request.get_json()
    if not data:
        return jsonify({'message': 'Invalid data'}), 400

    # Validate data format and content
    # The frontend will require it anyway
    if 'name' not in data or 'age' not in data or 'date_of_birth' not in data or 'weight' not in data or 'sex' not in data:
        return jsonify({'message': 'Missing required fields'}), 400
    
    #getting the parent username
    parent_profile = user_profiles.find_one({'username': current_user})
    if not parent_profile:
        return jsonify({'error': 'Parent profile not found'}), 404

    # Create a new child profile
    child_profile = {
        'parent_id' : parent_profile['_id'],
        'name': data['name'],
        'age': data['age'],
        'date_of_birth': datetime.strptime(data['date_of_birth'], "%Y-%m-%d"),
        'weight': data['weight'],
        'sex': data['sex'],
        'allergies': data.get('allergies', []),
        'medications': data.get('medications', []),
    }
    
    # Check if the child profile already exists
    if child_profiles.find_one(child_profile):
        return jsonify({'error': 'Child profile already exists'}), 400
    
    #adding the id of the child profile
    child_profile['_id'] = ObjectId()

    # Add the child profile to the database
    child_profiles.insert_one(child_profile)
    print("the parent of the child is:", user_profiles.find_one({'_id': parent_profile['_id']})['username'])
    return jsonify({'message': 'Child profile created successfully'}), 201

# API endpoint for retrieving a child profile
@app.route('/child-profiles/<child_name>',endpoint='getChild', methods=['GET'])
@jwt_required() #Route requires authentication
def get_child_profile(child_name):
    # Retrieve the child profile from the database
    username = get_jwt_identity()
    user_profile = user_profiles.find_one({'username': username})
    child_profile = child_profiles.find_one({'name': child_name, 'parent_id': user_profile['_id']})

    if not child_profile:
        return jsonify({'message': 'Child profile not found'}), 404

    child_profile['_id'] = str(child_profile['_id'])
    child_profile['parent_id'] = str(child_profile['parent_id'])
    return jsonify(child_profile), 200

# API endpoint for updating a child profile
@app.route('/child-profiles/<child_name>', endpoint='updateChild',methods=['PUT'])
@jwt_required() #Route requires authentication
def update_child_profile(child_name):
    #get user details
    current_user = get_jwt_identity()
    user_profile = user_profiles.find_one({'username': current_user})
    #get child profile
    child_profile = child_profiles.find_one({'name': child_name, 'parent_id': user_profile['_id']})
    # incoming data
    data = request.get_json()

    if not child_profile:
        return jsonify({'error': 'Child profile not found'}), 404

    # Check if the user is authorized to update the child profile (Maybe not needed whem working with JWT)
    if child_profile['parent_id'] != user_profile['_id']:
        return jsonify({'error': 'Unauthorized to update this child profile'}), 403

    # appending allergies and medications
    allergies = data.get('allergies', [])
    data['allergies'] = []
    for i in allergies: 
        if i not in child_profile['allergies']:
            data['allergies'].append(i)
    data['allergies'].extend(child_profile['allergies'])
    medications = data.get('medications', [])
    data['medications'] = []
    for i in medications: 
        if i not in child_profile['medications']:
            data['medications'].append(i)
    data['medications'].extend(child_profile['medications'])

    # Update the child profile in the database
    result = child_profiles.update_one({'name': child_name, 'parent_id': user_profile['_id']}, {'$set': data})

    if result.modified_count == 0:
        return jsonify({'message': 'Child profile not found'}), 404

    return jsonify({'message': 'Child profile updated successfully'}), 200

# API endpoint for deleting a child profile
@app.route('/child-profiles/<child_name>', endpoint='deleteChild',methods=['DELETE'])
@jwt_required() #Route requires authentication
def delete_child_profile(child_name):
    #get user details
    current_user = get_jwt_identity()
    user_profile = user_profiles.find_one({'username': current_user})
    #get child profile
    child_profile = child_profiles.find_one({'name': child_name, 'parent_id': user_profile['_id']})

    if not child_profile:
        return jsonify({'error': 'Unauthorized to delete this child profile'}), 403
    
    # Delete the child profile from the database
    result = child_profiles.delete_one({'name': child_name, 'parent_id': user_profile['_id']})

    if result.deleted_count == 0:
        return jsonify({'message': 'Child profile not found'}), 404

    return jsonify({'message': 'Child profile deleted successfully'}), 200

#for testing if mongoDb is connected or not
def try_ping():
    print(user_profiles.find_one({'username': 'example_user'}))
    print("Pinged your deployment. You successfully connected to MongoDB!")

if __name__ == '__main__':
    # try_ping()
    app.run(debug=True)
