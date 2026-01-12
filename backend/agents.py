import json
from youtube_search import YoutubeSearch # type: ignore

# MOCK LLM CALL - Replace this function with actual IBM Granite/WatsonX or OpenAI call
def call_llm(prompt):
    # INSTRUCTION: Connect IBM Granite or OpenAI API here.
    # For now, I will simulate a "smart" response for testing without API keys.
    
    # Real implementation example:
    # response = ibm_watsonx.generate(model="granite-13b-chat", input=prompt)
    # return response.text
    
    # Returning dummy data for the MVP to run immediately without keys:
    if "summary" in prompt.lower():
        return "This topic covers the fundamental principles of physics, focusing on Newton's laws."
    if "flashcard" in prompt.lower():
        return json.dumps([{"q": "What is Force?", "a": "Mass x Acceleration"}, {"q": "Unit of Force?", "a": "Newton"}])
    if "practice" in prompt.lower():
        return json.dumps([{"question": "Calculate force for 10kg at 2m/s^2", "type": "short"}, {"question": "Gravity is a force?", "type": "mcq"}])
    if "mermaid" in prompt.lower():
        return "graph TD; A[Force] --> B[Mass]; A --> C[Acceleration];"
    return "Error generating content."

def summary_agent(req):
    prompt = f"""
    Act as a teacher. Write a concise summary about '{req.topic}' 
    specifically for a student at {req.level} level in {req.language}.
    """
    return call_llm(prompt)

def flashcard_agent(req):
    prompt = f"""
    Create 3 flashcards for '{req.topic}' ({req.level}).
    Return ONLY raw JSON in this format: 
    [{{"q": "Question", "a": "Answer"}}]
    """
    response = call_llm(prompt)
    try:
        # Ensure we parse the string into a JSON object
        return json.loads(response) 
    except:
        return [{"q": "Error parsing AI", "a": "Try again"}]

def practice_agent(req):
    prompt = f"""
    Create 2 practice questions for '{req.topic}'.
    Return ONLY raw JSON in this format: 
    [{{"question": "The question text", "type": "short or mcq"}}]
    """
    response = call_llm(prompt)
    try:
        return json.loads(response)
    except:
        return [{"question": "Error parsing AI", "type": "short"}]

def diagram_agent(req):
    prompt = f"""
    Create a Mermaid.js diagram code for '{req.topic}'.
    Return ONLY the code starting with 'graph TD'. Do not include markdown ticks.
    """
    return call_llm(prompt)

def video_agent(req):
    # This actually searches YouTube!
    query = f"{req.topic} tutorial {req.level} level"
    results = YoutubeSearch(query, max_results=1).to_dict()
    
    if results:
        video = results[0]
        return {
            "title": video['title'],
            "url": f"https://www.youtube.com/watch?v={video['id']}",
            "thumbnail": video['thumbnails'][0]
        }
    else:
        return {
            "title": "No video found",
            "url": "https://www.youtube.com"
        }