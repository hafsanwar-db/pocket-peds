#fastAPI and MongoDB dependencies
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pymongo.mongo_client import MongoClient
from pydantic import BaseModel
from typing import Annotated
from jose import JWTError, jwt
from passlib.hash import bcrypt
from bson import ObjectId
import psycopg2
from psycopg2 import sql
import uvicorn

#miscellaneous dependencies
from datetime import datetime, timedelta, timezone
import requests
import xmltodict
import json
from dotenv import load_dotenv
import os

app = FastAPI()
SECRET_KEY = "70b15e4e47fcc13b26223aa4e0091688d652564cc3ea5afa0653427cce3a7139"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")#change tokenUrl later

# Connect to MongoDB Atlas
load_dotenv()
connection_string = os.getenv('connectionString')
client = MongoClient(connection_string)
db = client['PocketPeds']
child_profiles = db['child_profiles']
user_profiles = db['user_profiles']

#loading the SQL database
engine = psycopg2.connect(
        database="postgres",
        user="mcersi",
        password="pocketpeds123",
        host="pocket-peds.c10qkoguai68.us-east-2.rds.amazonaws.com",
        port='5432'
    )

class User(BaseModel):
    username: str
    password: str | None = None
    email: str | None = None

#creating JWT access token
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    return encoded_jwt

#to authorize the user for different endpoints
def get_userID(token: str) -> ObjectId:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return ObjectId(user_id)

# API endpoint for creating a new user profile
@app.post('/register')
def register(data: dict):
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    if not username or not password or not email:
        raise HTTPException(status_code=400, detail='Missing required fields')

    # Check if the username or email already exists
    if user_profiles.find_one({'$or': [{'username': username}, {'email': email}]}):
        raise HTTPException(status_code=400, detail='Username or email already exists')

    # Hash the password
    hashed_password = bcrypt.hash(password)

    # Insert user into MongoDB
    user = {'_id': ObjectId(),'username': username, 'hashed_password': hashed_password, 'email': email, 'children': []}
    user_profiles.insert_one(user)

    return {'message': 'User registered successfully'}

# API endpoint for logging in a new user profile.
@app.post('/login')
def login(data: dict) -> dict :
    username = data.get("username")
    password = data.get("password")
    user = user_profiles.find_one({'username': username})
    if not user or not bcrypt.verify(password, user['hashed_password']):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={ "sub": str(user['_id'])}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get('/user-profile/')
async def get_user_profile(token: Annotated[str, Depends(oauth2_scheme)]):
    # Access the identity of the current user with credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    user_profile = user_profiles.find_one({'_id': get_userID(token)})
    
    # Remove hashed password from the response (security reasons)
    user_profile.pop('hashed_password', None)
    print("the user profile is:", user_profile)

    #converting into string so that it is JSON serializable
    user_profile['_id'] = str(user_profile['_id'])
    return user_profile

@app.post('/child-profiles/')
async def create_child_profile(data: dict, token: Annotated[str, Depends(oauth2_scheme)]):
    # Add authentication and authorization logic here
    user_id = get_userID(token)
    
    # Validate incoming data
    if 'name' not in data or 'age' not in data or 'date_of_birth' not in data or 'weight' not in data or 'sex' not in data:
        raise HTTPException(status_code=400, detail='Missing required fields')

    # Create a new child profile
    child_profile = {
        'parent_id' : user_id,
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
        raise HTTPException(status_code=400, detail='Child profile already exists')
    
    #adding the id of the child profile
    child_profile['_id'] = ObjectId()

    # Add the child profile to the database
    child_profiles.insert_one(child_profile)
    return {'message': 'Child profile created successfully'}

@app.get('/child-profiles/{child_name}')
async def get_child_profile(child_name: str, token: Annotated[str, Depends(oauth2_scheme)]):
    # Retrieve the child profile from the database
    user_id = get_userID(token)
    child_profile = child_profiles.find_one({'name': child_name, 'parent_id': user_id})

    if not child_profile:
        raise HTTPException(status_code=404, detail='Child profile not found')

    child_profile['_id'] = str(child_profile['_id'])
    child_profile['parent_id'] = str(child_profile['parent_id'])
    return child_profile

@app.put('/child-profiles/{child_name}')
async def update_child_profile(child_name: str, data: dict, token: Annotated[str, Depends(oauth2_scheme)]):
    #get user details
    user_id = get_userID(token)
    child_profile = child_profiles.find_one({'name': child_name, 'parent_id': user_id})

    if not child_profile:
        raise HTTPException(status_code=404, detail='Child profile not found')
    
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
    result = child_profiles.update_one({'_id': child_profile['_id']}, {'$set': data})

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail='Child profile not found')

    return {'message': 'Child profile updated successfully'}

@app.delete('/child-profiles/{child_name}')
async def delete_child_profile(child_name: str, token: Annotated[str, Depends(oauth2_scheme)]):
    #get user details
    user_id = get_userID(token)
    #get child profile
    child_profile = child_profiles.find_one({'name': child_name, 'parent_id': user_id})

    if not child_profile:
        raise HTTPException(status_code=403, detail='Unauthorized to delete this child profile')
    
    # Delete the child profile from the database
    result = child_profiles.delete_one({'_id': child_profile['_id']})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail='Child profile not found')

    return {'message': 'Child profile deleted successfully'}

@app.get('/process-upc')
async def process_upc(upc: str):
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

@app.get('/medication-history-all/{childID}')
async def process_upc(childID: str):
    #the times come in as "January 2022", "December 2019", etc
    try: cursor = engine.cursor()
    except psycopg2.InterfaceError: 
        #this is in case the connection is timed out
        new_engine = psycopg2.connect(
        database="postgres",
        user="mcersi",
        password="pocketpeds123",
        host="pocket-peds.c10qkoguai68.us-east-2.rds.amazonaws.com",
        port='5432')
        cursor = new_engine.cursor()
    cursor.execute("SELECT dosage, upc, time, name FROM history WHERE childid = %s", (childID,))
    rows = cursor.fetchall()
    data = {}
    for row in rows:
        formattedDate = row[2].strftime("%Y-%m-%d")
        formattedTime = row[2].strftime("%H:%M")
        if data.get(formattedDate):
            data[formattedDate].append({'startingDay':True, 'endingDay': True, 'color': '#FDB623', 'dosage': row[0], 'upc': row[1], 'name': row[3], "time": formattedTime})
        else: data[formattedDate] = [{'startingDay':True, 'endingDay': True, 'color': '#FDB623', 'dosage': row[0], 'upc': row[1], 'name': row[3], "time": formattedTime}]
    print(data['2024-05-16'])
    return data

#for specfic time period, not currently being used anywhere
@app.get('/medication-history/{childID}')
async def process_upc(childID: str, data: dict):
    #the times come in as "January 2022", "December 2019", etc
    start_time= format_date(data.get('start_time'))
    end_time= format_date(data.get('end_time'))
    cursor = engine.cursor()
    cursor.execute("select * from history where childid = %s and time between %s and %s", (childID, start_time, end_time))
    rows = cursor.fetchall()
    print(len(rows))
    return {'message': 'Got the data successfully'}

#helper method for specific time period fetching, again not being used anywhere
def format_date(string_date) -> datetime:
    month_name, year_str = string_date.split(" ")
    month = datetime.strptime(month_name, "%B").month
    print(month, type(month))
    year = int(year_str)
    date = datetime(year, month, 1, 0, 1)
    return date


def try_ping():
    print(user_profiles.find_one({'username': 'example_user'}))
    print("Pinged your deployment. You successfully connected to MongoDB!")

# if __name__ == '__main__':
#     uvicorn.run(app, host='0.0.0.0', port=8000)
