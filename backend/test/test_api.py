from fastapi import FastAPI
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware
import requests
import json
import requests
import os
from dotenv import load_dotenv

load_dotenv()
model_api_url=os.getenv("MODEL_API_URL")

url = "http://localhost:8000/play"
board2 = {
    "board": [
        [".", "X", ".", "."],
        ["O", ".", ".", "."],
        [".", ".", "X", "."],
        [".", "O", ".", "."]
    ],
    "turn": "O"
}
response = requests.post(url, json=board2)
app = FastAPI()

O_MODEL= "gemma3:1b"
X_MODEL = "llama3.2"

class PlayerRequest(BaseModel):
    board: dict
    turn: str

def play(board, turn): 
    size = len(board)
    model = O_MODEL if turn == "X" else X_MODEL   

    prompt = f"""
    You are an expert AI agent playing Tic-Tac-Toe on a dynamic {size}x{size} board.

    Current board:
    {board}

    Your turn: '{turn}'.

    Rules:
    1. Return your next move strictly as JSON in this exact format: {{"row": <row_index>, "col": <col_index>}}.
    2. Row and column must be integers between 0 and {size - 1}.
    3. The move must be on an empty cell only.
    4. Do NOT include any explanations, text, backticks, quotes, or markdown—**ONLY the JSON object**.
    5. Do NOT write anything before or after the JSON.
    6. Respond with exactly **one JSON object** containing the next move.

    """
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False,
    }
    r = requests.post(f"{model_api_url}/api/generate", json=payload)
    response_json = r.json()
    move_text = response_json.get("response", "{}")
    print("RAW MODEL OUTPUT:", move_text)
    move = json.loads(move_text.replace("'", '"'))
    print("Raw completion:", response_json.get("response"))   
    return {
            "model_used": model,
            "move": move
        }
