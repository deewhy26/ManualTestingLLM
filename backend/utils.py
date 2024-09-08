
import google.generativeai as genai
import json 
import os 
from dotenv import load_dotenv

load_dotenv()
def clear_files():
    files = genai.list_files()
    for file in files: 
        genai.delete_file(file.name)
    
def output_json(out_dir, files, responses):
        # Convert the JSON string to a Python dictionary
    os.makedirs(out_dir, exist_ok=True)
    for file, response in zip(files, responses):
        data = json.loads(response)
        # Write the dictionary to a JSON file
        
        with open(os.path.join(out_dir, file+".json"), 'w') as json_file:
            json.dump(data, json_file, indent=4)

def send_json(files, responses):
    result = {}
    for file, response in zip(files, responses):
        data = json.loads(response)
        result[file] = data
    return json.dumps(result, indent = 4) 
        