from flask import Flask, request, jsonify
from flask_cors import CORS 
import joblib
import pandas as pd
import numpy as np
from tensorflow.keras.models import load_model
import os


app = Flask(__name__)
CORS(app)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load model and preprocessors with full paths
model = load_model(os.path.join(BASE_DIR, "best_model.h5"))
preprocessor = joblib.load(os.path.join(BASE_DIR, "preprocessor.pkl"))
label_encoder = joblib.load(os.path.join(BASE_DIR, "label_encoder.pkl"))

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    try:
        # Extract input features
        tugas = int(data['Persentase Tugas'])
        absen = int(data['Jumlah Ketidakhadiran'])
        rata = int(data['Rata-rata'])

        # Convert to DataFrame
        df = pd.DataFrame([{
            'Persentase Tugas': tugas,
            'Jumlah Ketidakhadiran': absen,
            'Rata-rata': rata
        }])

        # Preprocess
        X_input = preprocessor.transform(df)

        # Predict
        y_pred_proba = model.predict(X_input)
        predicted_index = np.argmax(y_pred_proba, axis=1)[0]
        predicted_label = label_encoder.inverse_transform([predicted_index])[0]

        return jsonify({
            'predicted_label': predicted_label,
            'probabilities': y_pred_proba[0].tolist()
        })

    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=False)