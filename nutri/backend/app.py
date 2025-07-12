from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_cors import CORS
from meal import meal_plan
import openai
from openai import OpenAI
from typing import Dict, Any

client = OpenAI()

app = Flask(__name__)
CORS(app)

@app.route('/')
def main():
    return render_template('restorative_ref_input.html')

@app.route('/api/meal_plan_submit', methods=['POST'])
def api_meal_plan_submit():
    if request.method == 'POST':
        try:
            # Get the uploaded file
            file = request.files.get('genomicFile')
            if not file:
                return jsonify({"error": "No genomic file uploaded"}), 400

            # Save to a temp location
            import tempfile
            import os
            temp = tempfile.NamedTemporaryFile(delete=False, suffix=".txt")
            file.save(temp.name)
            genomic_file_path = temp.name

            diabetes = request.form.get('diabetes', '')
            lactose = request.form.get('lactose', '')
            calcium = request.form.get('calcium', '')
            ethnicity = request.form.get('ethnicity', '')
            special = request.form.get('special', '')

            input_dict = {
                "Diabetes": diabetes,
                "Lactose": lactose,
                "Calcium": calcium,
                "Ethnicity": ethnicity,
                "Special Requests": special,
                "GenomicFilePath": genomic_file_path
            }

            output_dict = meal_plan(input_dict)
            
            # Clean up the temporary file
            try:
                os.unlink(genomic_file_path)
            except:
                pass  # Ignore cleanup errors
                
            return jsonify(output_dict)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Method not allowed"}), 405

def ask_openai(conversation_history):
    response = client.chat.completions.create(
        messages=conversation_history,
        model="gpt-3.5-turbo",
        temperature=0,
    )
    return response.choices[0].message.content

@app.route('/meal_plan_submit', methods=['POST'])
def meal_plan_submit():
    if request.method == 'POST':
        try:
            diabetes = request.form.get('diabetes', '')
            lactose = request.form.get('lactose', '')
            calcium = request.form.get('calcium', '')
            ethnicity = request.form.get('ethnicity', '')
            special = request.form.get('special', '')

            input_dict = {
                "Diabetes": diabetes,
                "Lactose": lactose,
                "Calcium": calcium,
                "Ethnicity": ethnicity,
                "Special Requests": special
            }

            output_dict = meal_plan(input_dict)
            return render_template('restorative_ref_output.html', output=output_dict['output'])
        except Exception as e:
            return render_template('restorative_ref_output.html', output=f"Error: {str(e)}")
    return "Method not allowed", 405
    
@app.route('/chatbot', methods=['POST'])
def chatbot():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
            
        conversation_history = data.get("conversation_history", [])
        previous_output = data.get("previous_output", "")
        input_instructions = data.get("input_instructions", "")
        user_message = data.get("message", "")
        
        conversation_history.append({'role': 'system', 'content': f'You answer questions about "{previous_output}" and "{input_instructions}" to help teachers. Respond in structured, bulleted format with headings as needed.'})

        conversation_history.append({'role': 'user', 'content': user_message})
        answer = ask_openai(conversation_history)
        conversation_history.append({'role': 'assistant', 'content': answer})
        return jsonify({"answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)


