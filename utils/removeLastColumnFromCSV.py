import csv
import sys

filename = sys.argv[1]
outname = sys.argv[2]

with open(filename,"r") as fin:
    with open(outname,"w") as fout:
        writer=csv.writer(fout)
        for row in csv.reader(fin):
            writer.writerow(row[:-1])