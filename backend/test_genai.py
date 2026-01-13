import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=KEY)

models_to_test = [
    "gemini-1.5-flash-001",
    "gemini-1.5-flash-latest",
    "gemini-1.0-pro",
    "gemini-pro"
]

for m in models_to_test:
    print(f"Testing {m}...")
    try:
        model = genai.GenerativeModel(m)
        response = model.generate_content("Short hello")
        print(f"SUCCESS {m}: ", response.text.strip())
        break # Stop on first success
    except Exception as e:
        print(f"FAILURE {m}: {e}")
