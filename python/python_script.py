#!/usr/bin/env python3
import glob

with open('../python_diary.txt', 'w') as outfile:
	for filename in glob.glob('../Desktop/diary/*-2020.txt'):
		with open(filename) as infile:
			for line in infile:
				outfile.write(line)

