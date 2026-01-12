import google.generativeai as genai
import os

# PASTE YOUR KEY HERE
GENAI_API_KEY = "AIzaSyC3GxNBc1VqlD2d89_lj5Ca36igM2y9IH0"
genai.configure(api_key=GENAI_API_KEY)

print("Searching for available models...")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"- {m.name}")
except Exception as e:
    print(f"Error: {e}")