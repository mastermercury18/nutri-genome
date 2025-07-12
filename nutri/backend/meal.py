import openai
import guidance
from guidance import system, user, assistant, models, gen
from openai import OpenAI
import re
import tempfile
import os
import subprocess
import json

client = OpenAI()

gpt35 = models.OpenAI('gpt-4o-mini')

def process_genomic_file(file_path):
    """
    Process the uploaded genomic file using the QNN notebook logic
    Returns the liver label (HIGH/LOW)
    """
    try:
        # Import the QNN processor
        from qnn_processor import process_genomic_file_with_qnn
        return process_genomic_file_with_qnn(file_path)
    except ImportError:
        # Fallback to simple processing if QNN dependencies are not available
        try:
            with open(file_path, 'r') as file:
                genomic_data = file.read()
            
            lines = genomic_data.split('\n')
            snp_data = {}
            
            for line in lines[1:]:  # Skip header
                if line.startswith('rs'):
                    parts = line.split()
                    if len(parts) >= 6:
                        rs_id = parts[0]
                        effect_weight = float(parts[5])
                        snp_data[rs_id] = effect_weight
            
            if snp_data:
                return "HIGH"
            else:
                return "LOW"
                
        except Exception as e:
            print(f"Error processing genomic file: {e}")
            return "UNKNOWN"

def generate_response(text, question):
    llm = gpt35

    with system():
        llm += "You are an intelligent assistant."

    with user():
        llm += f"{question}\nText: {text}\n"

    with assistant():
        #llm += f'Answer: {gen("answer")}'
        response = gen("Answer: {answer}", max_tokens=5000)
        llm += response
    
    return llm

def ask_openai(conversation_history):
    response = client.chat.completions.create(
        messages=conversation_history,
        model="gpt-3.5-turbo",
        temperature=0,
    )
    return response.choices[0].message.content

def chatbot(text, response):
    conversation_history = [
        {'role': 'system', 'content':f'You will answer questions about {text} and {response}. Respond in structured, bulleted format with headings as needed.'}
    ]

    while True:
        query = input("Query: ")
        conversation_history.append({'role': 'user', 'content': query})
        answer = ask_openai(conversation_history)
        print(f"Answer: {answer}")
        conversation_history.append({'role': 'assistant', 'content': answer})


#REPORT CARD COMMENTS
def meal_plan(form_data):
    diabetes = form_data["Diabetes"] 
    lactose = form_data["Lactose"]
    calcium = form_data["Calcium"]
    ethnicity = form_data["Ethnicity"]
    special = form_data["Special Requests"]
    genomic_file_path = form_data.get("GenomicFilePath", None)

    # Process the uploaded genomic file to get the liver label
    if genomic_file_path and os.path.exists(genomic_file_path):
        liver_label = process_genomic_file(genomic_file_path)
    else:
        # Fallback to reading from the default file
        try:
            with open("liver_label.txt", "r") as f:
                liver_label = f.read().strip()
        except FileNotFoundError:
            liver_label = "UNKNOWN"  # fallback if file not found

    text = f"""
    risk of diabetes: {diabetes}
    lactose intolerance (y/n): {lactose}
    calcium intake: {calcium}
    intensity of liver cirrhosis: {liver_label}
    ethnicity (for food recommendations): {ethnicity}
    additional special recommendations: {special}
    """

    question = "Based on the text above, create a detailed, personalized meal plan for a patient. Include quantifiable percentages for each macronutrients."

    # Debug logging
    print("Form data received:", form_data)
    print("Text sent to OpenAI:", text)

    response = str(generate_response(text, question))
    print("Raw OpenAI response:", response)

    # TEMP: Return the full response for debugging
    return {'output' : response}

# Example test (can be removed in production)
# form_data = {"Diabetes": "High", "Lactose": "Yes", "Calcium": "Severely Low", "Ethnicity": "Indian", "Special Requests": "No nuts"}
# print(meal_plan(form_data))
