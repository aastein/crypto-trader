import csv
import sys
import os

filename = sys.argv[1]
outname = sys.argv[2]

def countLines(fin):
    l = 0
    for row in csv.reader(fin):
        l = l + 1
    return l


with open(filename,"r") as fin:
    length = countLines(fin)
    print length

with open(filename,"r") as fin:
    with open(outname,"w") as fout:
        fout.write('[')
        c = 0
        for row in csv.reader(fin):
            if c != length - 1:
                row = str(row) + ','
            else:
                row = str(row)
            fout.write(row)
            c = c + 1
        fout.write(']')
