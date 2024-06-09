from flask import Flask, request, render_template, jsonify
import numpy as np
import tensorflow as tf
import cv2
from werkzeug.utils import secure_filename

app = Flask(__name__)

model = tf.keras.models.load_model('./model/T3C.h5')

img_height = 224
img_width = 224

class_labels = ['kabel', 'casing', 'cpu', 'gpu', 'hdd', 'headset', 'keyboard', 'microphone', 'monitor', 'motherboard', 'mouse', 'ram', 'speakers', 'webcam']

def preprocess_image(image):
    img = cv2.imdecode(np.frombuffer(image, np.uint8), cv2.IMREAD_COLOR)
    img = cv2.resize(img, (img_height, img_width))
    img = img.astype('float32') / 255.0
    img = np.expand_dims(img, axis=0)
    return img

def predict_image(image):
    img_array = preprocess_image(image)
    predictions = model.predict(img_array)
    predicted_class_index = np.argmax(predictions[0])
    predicted_class_name = class_labels[predicted_class_index]
    return predicted_class_name

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    file = request.files['file'].read()
    prediction = predict_image(file)
    return jsonify({'prediction': prediction})

if __name__ == '__main__':
    app.run(debug=False)
