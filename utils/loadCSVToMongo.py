from pymongo import MongoClient
import sys
import csv


client = MongoClient()
db = client[sys.argv[1]]
collecton = db[sys.argv[2]]
filename = sys.argv[3]

with open(filename,"r") as fin:
    for row in csv.reader(fin):
        time=row[0]
        price=row[1]
        record = {
            'time': time,
            'price': price
        }
        print record
        collecton.insert(record)
