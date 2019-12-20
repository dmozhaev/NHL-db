import datetime
import zipfile
from django.db import connection
from pathlib import Path
from timeit import default_timer as timer

SQL_FILE_PATH = 'nhl/load_data/data.sql'


def load_data():
    start = timer()
    print("Loading initial data from SQL file...")
    with open(Path(SQL_FILE_PATH), encoding='utf-8') as f:
        with connection.cursor() as c:
            c.execute(f.read())
    f.close()
    end = timer()
    print("Successfully loaded in " + str(end - start) + " seconds")
