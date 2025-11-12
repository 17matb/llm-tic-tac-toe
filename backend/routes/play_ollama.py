import json
import os
import re
import requests
from logs.logger import logs
from dotenv import load_dotenv
from fastapi import APIRouter
from pydantic import BaseModel
from json import JSONDecodeError
from requests.exceptions import RequestException, HTTPError, Timeout, ConnectionError


load_dotenv()
model_ollama_api_url = os.getenv("MODEL_OLLAMA_API_URL")


router = APIRouter()
X_MODEL = "llama3.2"
O_MODEL = "gemma3:1b"


class PlayerRequest(BaseModel):
    board: list[list[str]]
    turn: str
    available_cells: list[dict]


@router.post("/play-ollama")
def play_ollama(request: PlayerRequest):
    board = request.board
    available_cells = request.available_cells
    turn = request.turn
    size = len(board)
    model = O_MODEL if turn == "x" else X_MODEL
    logs.info(f"Board state: {board}")
    logs.info(f"Player Turn: {turn}")
    logs.info(f"Model Name: {model}")
    logs.info(f"Grid size: {size}")
    prompt = f"""
You are an expert AI agent playing Tic-Tac-Toe on a dynamic {size}x{size} board.

Current board:
{board}

You are playing as '{turn}'.

Your task is to choose the strongest possible move.

-------------------------------------
STRATEGY (MANDATORY BEHAVIOR)
-------------------------------------
You must follow this strategic hierarchy:

1. **Win if possible**  
    - If there is any move that immediately wins the game, you must choose it.

2. **Block opponent's win**  
    - If the opponent can win on their next turn, you MUST block that position.

3. **Create a fork (multiple winning threats)**  
    - Choose moves that generate two or more winning possibilities in future turns.

4. **Prevent opponent forks**  
    - Avoid moves that allow the opponent to create multiple winning threats.

5. **Center priority**  
    - If the center is empty, take it.

6. **Strong positional placement**  
    - Prefer corners over edges when no tactical threats exist.

7. **Avoid losing moves**  
    - You must verify that your chosen move does NOT allow the opponent to win immediately on their next turn.

-------------------------------------
OUTPUT RULES (STRICT)
-------------------------------------
1. You must respond with EXACTLY one JSON object in this format:
    {{"row": <row_index>, "col": <col_index>}}.

2. <row_index> and <col_index> must be integers between 0 and {size - 1}.

3. The chosen cell MUST be empty. Here is a list of empty cells : {available_cells}. You WILL NOT choose any cell that is not in the provided list.
4. Do NOT output any explanations, reasoning, comments, markdown, text, quotes, or backticks.
    ONLY output the JSON object.

5. Do NOT output anything before or after the JSON.
    The response must contain only the JSON object.

-------------------------------------
Now choose the best legal move following the full strategy above, 
and output ONLY the JSON object.
"""

    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False,
    }
    r = requests.post(f"{model_ollama_api_url}/api/generate", json=payload)
    try:
        response_json = r.json()
        move_text = response_json.get("response", "{}")
        logs.info(f"Raw model output: {move_text}")
        match = re.search(r"\{[^{}]*\}", move_text)
        if not match:
            raise ValueError(f"No JSON object found in response {move_text}")
        move = json.loads(match.group(0))
        logs.info(f"Parsed move: {move}")
        logs.info("======= END OF TURN =======")
        return {"model_used": model, "move": move}
    # Handle network or request-related errors
    except (HTTPError, Timeout, ConnectionError, RequestException) as e:
        logs.error(f"API request error: {str(e)}")
        return {"error": "API request failed", "details": str(e)}

    # Handle JSON decoding errors
    except JSONDecodeError as e:
        logs.error(f"JSON parsing error: {str(e)}")
        return {"error": "Failed to parse JSON", "details": str(e)}

    # Handle logical errors or missing fields
    except (ValueError, KeyError) as e:
        logs.error(f"Logical error or missing fields: {str(e)}")
        return {"error": "Invalid move data", "details": str(e)}

    # Catch-all for any unexpected errors
    except Exception as e:
        logs.error(f"Unexpected error: {str(e)}")
        return {"error": "Unexpected error", "details": str(e)}
