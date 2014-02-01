from __future__ import division
import csv
import re
from collections import Counter
import sys

"""
Distribution of ID numbers
python ids.py <text file with ids>
"""

id_reg = re.compile("\d{13}")
ids = set()

def extract_age(id):
    year2 = int(id[0:2])
    return 2009 - (year2 + 1900)
    
def extract_age_range(id):
    age = extract_age(id)
    if age < 39:
        return "less than 39"
    elif age < 60:
        return "39 - 59"
    elif age < 80:
        return "60 - 79"
    return "80 and over"

def extract_starsigns(id):
    month = int(id[2:4])
    day = int(id[4:6])
    if (month == 3 and day >= 21) or (month == 4 and day <= 19):
        return "Aries"
    elif (month == 4 and day >= 20) or (month == 5 and day <= 20):
        return "Taurus"
    elif (month == 5 and day >= 21) or (month == 6 and day <= 20):
        return "Gemini"
    elif (month == 6 and day >= 21) or (month == 7 and day <= 22):
        return "Cancer"
    elif (month == 7 and day >= 23) or (month == 8 and day <= 22):
        return "Leo"
    elif (month == 8 and day >= 23) or (month == 9 and day <= 22):
        return "Virgo"
    elif (month == 9 and day >= 23) or (month == 10 and day <= 22):
        return "Libra"
    elif (month == 10 and day >= 23) or (month == 11 and day <= 21):
        return "Scorpio"
    elif (month == 11 and day >= 22) or (month == 12 and day <= 21):
        return "Sagittarius"
    elif (month == 12 and day >= 22) or (month == 1 and day <= 19):
        return "Capricorn"
    elif (month == 1 and day >= 20) or (month == 2 and day <= 18):
        return "Aquarius"
    elif (month == 2 and day >= 19) or (month == 3 and day <= 20):
        return "Pisces"

def extract_gender(id):
    val = int(id[6])
    if val < 4:
        return "Female"
    return "Male"

def histogram(hash, count):
    items = hash.items()
    sorted_items = sorted(items, key=lambda x: x[1])
    perc_items = [(key, val/count * 100) for key, val in sorted_items]
    for key, val in perc_items:
        print "%s: %.2f%%" % (key, val)

def print_output(title, hist, count):
    print ""
    print title
    print "=" * 20
    print ""
    histogram(hist, count)

class Parser(object):
    NEXT = "NEXT"
    SAME = "SAME"

    def __init__(self):
        self._type = ""
        self._state = self.state_wait_for_type
        self._province = None
        self._party = None
        self._type = None
        self.data = {
            "national" : [],
            "regional" : [],
        }
        self._national = []
        self._regional = []

    def state_wait_for_type(self, line):
        if "NATIONAL LIST" in line:
            self._type = "national"
            self._state = self.state_wait_for_party
        elif "REGIONAL LIST" in line:
            self._type = "regional"
            self._state = self.state_wait_for_province
        return Parser.NEXT

    def state_wait_for_province(self, line):
        if "Province:" in line:
            (_, province) = line.split(":")
            self._province = province.strip()
            self._state = self.state_wait_for_party
        return Parser.NEXT
    
    def state_wait_for_party(self, line):
        if "Party Name:" in line:
            (_, party) = line.split(":")
            self._party = party.strip()
            self._state = self.state_wait_for_table
        return Parser.NEXT

    def state_wait_for_table(self, line):
        def find_extent(label1, label2):
            return (line.find(label1), line.find(label2))

        if "" in line:
            self._party = None
            self._province = None
            self._type = None

            self._state = self.state_wait_for_type
            return Parser.SAME

        if "Party" in line and "Position" in line and "Full Name" in line:
            self._pos = [
                find_extent("Last Name", "Full Name"),
                find_extent("Full Name", "ID"),
                find_extent("ID", "AN"),
            ]

            self._state = self.state_process_candidate
        return Parser.NEXT

    def state_process_candidate(self, line):
        def extent(idx):
            e = self._pos[idx]
            return line[e[0]: e[1]]

        if not re.findall(id_reg, line):
            self._state = self.state_wait_for_table
            return Parser.NEXT
        else:
            last_name = extent(0).strip()
            first_name = extent(1).strip()
            id = extent(2).strip()
            if not id in ids:
                self.data[self._type].append([
                    "%s %s" % (first_name, last_name),
                    self._province or "National",
                    self._party,
                    extract_age(id),
                    extract_age_range(id),
                    extract_gender(id),
                ])
                ids.add(id)

            return Parser.NEXT

    def parse(self, line):
        while True:
            result = self._state(line)
            if result == parser.SAME:
                continue
            break

if __name__ == "__main__":
    writer = csv.writer(sys.stdout)
    parser = Parser()
    header = ["person", "province", "party", "age", "age_range", "gender"]
    writer.writerow(header) 
    for line in open(sys.argv[1]):
        parser.parse(line)

    for el in parser.data["regional"]:
        writer.writerow(el) 

    for el in parser.data["national"]:
        writer.writerow(el) 

#fp = open(sys.argv[1])
#party = sys.argv[2]
#text = fp.read()
#ids = set(re.findall(id_reg, text))
#count = len(ids)
#
#
#years = Counter()
#star_signs = Counter()
#gender = Counter()
#
#for id in ids:
#    years[extract_year(id)] +=1
#    star_signs[extract_starsigns(id)] +=1
#    gender[extract_gender(id)] +=1
#
#print "Party : %s" % party
#print "Number of Candidates: %d" % count
#print "=" * 20
#print ""
#
#print_output("Distribution by age", years, count)
#print_output("Distribution by star sign", star_signs, count)
#print_output("Distribution by gender", gender, count)
#
