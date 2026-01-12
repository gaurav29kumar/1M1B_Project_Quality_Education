import os
import json
import google.generativeai as genai
from googleapiclient.discovery import build
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# --- CONFIGURATION ---
GENAI_API_KEY = "AIzaSyCm3VjRxT7e0YA7aw09Uvl_xCfmMakNtgY" 
YOUTUBE_API_KEY = "AIzaSyDZYP_eb24o10bz9PaUPTz8-YFQa8tlaxo"

genai.configure(api_key=GENAI_API_KEY)
youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StudyRequest(BaseModel):
    topic: str
    domain: str
    level: str
    language: str

class MoreRequest(BaseModel):
    topic: str
    current_context: str
    type: str

class VideoRequest(BaseModel):
    topic: str
    domain: str
    level: str

# --- ENDPOINT 1: GENERATE STUDY PLAN ---
@app.post("/study")
async def generate_study_plan(request: StudyRequest):
    print(f"Asking Gemini about: {request.topic}...")
    prompt = f"""
    Act as an expert tutor. I need to learn about "{request.topic}" in the domain of "{request.domain}".
    The level is "{request.level}" and the language is "{request.language}".

    Return valid JSON ONLY.
    Follow this exact structure:
    {{
        "deep_dive": {{
            "summary": "A detailed summary of the topic.",
            "key_points": ["Key concept 1", "Key concept 2"],
            "formulas": ["Formula 1", "Formula 2"]
        }},
        "flashcards": [
            {{"q": "Q1?", "a": "A1"}},
            {{"q": "Q2?", "a": "A2"}}
        ],
        "practice": [
            {{"question": "Problem 1"}},
            {{"question": "Problem 2"}}
        ],
        "assignment": {{
            "title": "Homework Title",
            "tasks": ["Task 1", "Task 2"]
        }},
        "diagram": "Valid Mermaid.js flowchart code. IMPORTANT: Wrap ALL node labels in double quotes. Example: A(\"Node\") --> B(\"Text\"). Do NOT use curly braces."
    }}
    """
    try:
        model = genai.GenerativeModel('gemini-2.5-flash-preview-09-2025')
        response = model.generate_content(prompt)
        clean_text = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(clean_text)
    except Exception as e:
        print(f"Error: {e}")
        return {"error": str(e)}

# --- ENDPOINT 2: GET MORE CONTENT ---
@app.post("/more")
async def get_more_content(request: MoreRequest):
    prompt = ""
    if request.type == "deep_dive":
        prompt = f"Provide MORE details on {request.topic}. Current summary: {request.current_context[:100]}. Return JSON: {{ \"new_content\": \"New paragraph.\" }}"
    elif request.type == "questions":
        prompt = f"Generate 2 NEW questions for {request.topic}. Return JSON: {{ \"new_data\": [ {{\"q\": \"Q\", \"a\": \"A\"}} ] }}"
    elif request.type == "practice":
        prompt = f"Generate 2 NEW practice problems for {request.topic}. Return JSON: {{ \"new_data\": [ {{\"question\": \"Problem\"}} ] }}"
    elif request.type == "assignment":
        prompt = f"Generate 2 NEW assignment tasks for {request.topic}. Return JSON: {{ \"new_data\": [\"Task 1\", \"Task 2\"] }}"

    try:
        model = genai.GenerativeModel('gemini-2.5-flash-preview-09-2025')
        response = model.generate_content(prompt)
        text = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(text)
    except Exception as e:
        return {"new_content": "Error", "new_data": []}

# --- ENDPOINT 3: GET YOUTUBE LECTURES (UPDATED) ---
@app.post("/videos")
async def get_videos(request: VideoRequest):
    # Added 'Full Course' and 'Lecture' to the query to force educational content
    smart_query = f"{request.topic} in {request.domain} full lecture course {request.level}"
    
    print(f"Searching YouTube for: {smart_query}...")
    try:
        response = youtube.search().list(
            q=smart_query,
            part="snippet",
            maxResults=6,
            order="relevance",  # Relevance is better for lectures than viewCount
            type="video",
            videoDuration="long" # <--- THIS FIXES THE REELS ISSUE (>20 mins only)
        ).execute()

        videos = []
        for item in response['items']:
            videos.append({
                "title": item['snippet']['title'],
                "videoId": item['id']['videoId'],
                "channel": item['snippet']['channelTitle'],
                "description": item['snippet']['description']
            })
        return {"videos": videos}
    except Exception as e:
        return {"videos": [], "error": str(e)}