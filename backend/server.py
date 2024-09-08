import shutil
from flask import Flask, jsonify, request, render_template
from werkzeug.utils import secure_filename
import os
from flask_cors import CORS, cross_origin
from query import invoke_chain
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['UPLOAD_FOLDER'] = 'uploads/'  # Directory where images will be uploaded

# Create the upload directory if it doesn't exist
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])



@app.route('/', methods=['GET', 'POST'])
def upload_files():
    if request.method == 'POST':
        # Get the text input
        text_input = request.form['text_input']

        
        # Get the list of uploaded images
        uploaded_files = request.files.getlist("images")
        
        processed_images = []
        for file in uploaded_files:
            if file and file.filename != '':
                # Save the uploaded image to the server
                filename = secure_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                
                # Process the image
                processed_images.append(filepath)
        results, heirarchies = invoke_chain(app.config['UPLOAD_FOLDER'], text_input)
       
        response = {
        'results': results,         # JSON of file -> list of JSONs
        'heirarchies': heirarchies  # JSON of file -> list of JSONs (or None)
        }
        shutil.rmtree(app.config['UPLOAD_FOLDER'])
        
        # Return as JSON
        return jsonify(response)


    
    # return render_template('upload.html')

if __name__ == '__main__':
    app.run(debug=True)
