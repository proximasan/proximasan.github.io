"""
A small helper script to update the index.json from an ignored dir called "new"
"""

import datetime
import json
import os

# Get today's date in ISO format
today = datetime.date.today().isoformat()

# Define the directory to scan
directory = 'new'

# Load the existing index.json file
with open('index.json', 'r') as f:
    index = json.load(f)

# Initialize an empty dictionary to store the results
jpg_files = {}

# Loop over all files in the directory
for filename in os.listdir(directory):
    # Check if the file is a JPEG image
    if filename.endswith('.jpg'):
        # Add the file to the dictionary with today's date as the value
        jpg_files[filename] = today

# Update the "images" dictionary in the index
index['images'].update(jpg_files)

# Write the updated index back to the file with pretty formatting
with open('index.json', 'w') as f:
    json.dump(index, f, indent=4)