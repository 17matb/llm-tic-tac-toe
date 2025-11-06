from fastapi import FastAPI
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware
import requests
import json
from dotenv import load_dotenv
import os

load_dotenv()
model_api_url=os.getenv("MODEL_API_URL")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

X_MODEL = "llama3.2"
O_MODEL= "gemma3:1b"

class PlayerRequest(BaseModel):
    board: list[list[str]]
    turn: str

@app.post("/play/")
def play(request: PlayerRequest):
    board = request.board
    turn = request.turn

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
    3. The move must be on an empty cell only and verfiy before making the move that the other player is not going to win if you do your move.
    4. Do NOT include any explanations, text, backticks, quotes, or markdown—**ONLY the JSON object**.
    5. Do NOT write anything before or after the JSON.
    6. Respond with exactly **one JSON object** containing the next move.
    """
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False,
    }
    print(prompt)
    r = requests.post(f"{model_api_url}/api/generate", json=payload)
    try:
        response_json = r.json()
        move_text = response_json.get("response", "{}")
        print("RAW MODEL OUTPUT:", move_text)
        move = json.loads(move_text.replace("'", '"'))
        print(move)
        print("Raw completion:", response_json.get("response"))   
        return {
                "model_used": model,
                "move": move
            }
    except Exception as e:
        return {"error": "Failed to parse model response", "details": str(e)}