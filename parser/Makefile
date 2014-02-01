all: 2009_lists.txt candidates.csv

2009_lists.txt:
	pdftotext -layout "2009 National and Provincial Election candidate lists.pdf" "2009_lists.txt"

candidates.csv: 2009_lists.txt
	python ids.py 2009_lists.txt > candidates.csv

