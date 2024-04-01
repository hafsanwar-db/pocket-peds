from flask import Flask, request, jsonify
from pymongo.mongo_client import MongoClient
from dotenv import load_dotenv
import os
import requests
import xmltodict
import json


app = Flask(__name__)

# Connect to MongoDB Atlas
load_dotenv()
connection_string = os.getenv('connection_string')
client = MongoClient(connection_string)
db = client['PocketPeds']
child_profiles = db['child_profiles']
parent_profiles = db['parent_profiles']

#dummy userid
user_id = 1

# API endpoint for creating a new child profile
@app.route('/child-profiles', methods=['POST']) #
def create_child_profile():
    # Add authentication and authorization logic here
    # the data might have user details which can be matched with the parent profile

    # Validate incoming data
    data = request.get_json()
    if not data:
        return jsonify({'message': 'Invalid data'}), 400

    # Validate data format and content
    if 'name' not in data or 'age' not in data:
        return jsonify({'message': 'Missing required fields'}), 400
    
    #getting the parent Object_id
    user_details = data['user']['username']
    parent_id = parent_profiles.find_one({'username': user_details})['_id']

    # Create a new child profile
    child_profile = {
        'name': data['name'],
        'age': data['age'],
        'parent' : parent_id
    }

    # Add the child profile to the database
    child_profiles.insert_one(child_profile)
    print("the parent of the child is:", parent_profiles.find_one({'_id': parent_id})['username'])
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

@app.route('/process-upc', methods=['GET'])
def process_upc():
    upc = request.args.get('upc')
    # Make a GET request to the given endpoint
    upc_response = requests.get('https://api.fda.gov/drug/ndc.json?search={}'.format(upc))
    upc_json = upc_response.json()

    ndc = upc_json['results'][0]['product_ndc']
    setId = requests.get("https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json?ndc={}".format(ndc)).json()['data'][0]['setid']

    spl = requests.get("https://dailymed.nlm.nih.gov/dailymed/services/v2/spls/{}.xml".format(setId))
    spl_xml = spl.text
    # spl_dict = xmltodict.parse(spl_xml)
    # spl_json = json.dumps(spl_dict)
    return spl_xml

def try_ping():
    child_profiles = db['child_profiles']
    print(child_profiles.find_one({'name': 'timmy'}))
    print("Pinged your deployment. You successfully connected to MongoDB!")

if __name__ == '__main__':
    # try_ping()
    app.run(debug = True)
