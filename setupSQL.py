import psycopg2
from psycopg2 import sql
from datetime import datetime, timedelta
import random
#user= password=[YOUR-PASSWORD] host=aws-0-ap-southeast-1.pooler.supabase.com port=6543 dbname=postgres
#Schema: 
#   history (sid INTEGER PRIMARY KEY, 
#            childid VARCHAR(24),
#            dosage FLOAT, 
#            time TIMESTAMP, 
#            UPC BIGINT)
engine = psycopg2.connect(
        database="postgres",
        user="postgres.ygdkqftijdifdikkmvrc",
        password="g!dq24ztgq!WmvX",
        host="aws-0-ap-southeast-1.pooler.supabase.com",
        port='6543'
    )
cursor = engine.cursor()
def connetSQL():
    cursor.execute("DROP TABLE IF EXISTS history;")
    create_table_query = """
    CREATE TABLE IF NOT EXISTS history (
        sid SERIAL PRIMARY KEY,
        childid VARCHAR(24),
        dosage FLOAT,
        time TIMESTAMP,
        UPC BIGINT,
        Name VARCHAR(120)
    )
    """
    cursor.execute(create_table_query)

    # Insert a sample entry into the 'history' table
    sample_entry = ('60c7c2879e2f610c989e4a81', 10.5, datetime(2024, 4, 25, 10, 0, 0), 123456789, "bruh")
    insert_query = sql.SQL("INSERT INTO history (childid, dosage, time, UPC, name) VALUES (%s, %s, %s, %s, %s)")
    cursor.execute(insert_query, sample_entry)
    cursor.execute("select * from history")
    rows = cursor.fetchall()
    engine.commit()
    print("Connected: ", rows)

def add_sample_data():
    def generate_upc_codes(num_codes):
    # Generate a list of 'num_codes' random UPC codes
        upc_codes = [random.randint(100000000000, 999999999999) for _ in range(num_codes)]
        return upc_codes
    def random_date(start_date, end_date):
        delta = end_date - start_date
        random_seconds = random.randint(0, int(delta.total_seconds()))
        return start_date + timedelta(seconds=random_seconds)


    medicine_names = [
        'Tylenol', 'Advil', 'Benadryl', 'Claritin', 'Robitussin',
        'Pepto-Bismol', 'Zantac', 'Mucinex', 'Motrin', 'Aleve'
    ]
    upc_codes = generate_upc_codes(len(medicine_names))
    childID = '60c7c2879e2f610c989e4a81'
# Function to generate a random datetime between start_date and end_date
   
    # Start and end dates
    start_date = datetime(2018, 1, 1)
    end_date = datetime(2024, 12, 31)

    # Generate 200 sample SQL queries
    sample_queries = []
    for _ in range(200):
        upc_code, name = random.choice(list(zip(upc_codes, medicine_names)))
        dosage = round(random.uniform(5.0, 20.0), 2)
        random_datetime = random_date(start_date, end_date)
        sample_entry = (childID, dosage, random_datetime.strftime('%Y-%m-%d %H:%M:%S'), upc_code, name)
        query = f"INSERT INTO history (childId,  dosage, time, UPC, Name) VALUES (%s, %s, %s, %s, %s);"
        sample_queries.append(query)
        sql_query = sql.SQL(query)
        cursor.execute(sql_query, sample_entry)
    engine.commit()
    print("Sample data added successfully")

connetSQL()
add_sample_data()