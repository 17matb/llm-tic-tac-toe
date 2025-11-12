import json
import re
from fastapi import APIRouter
from utils.azure_client import client, deployment, client_gpt4, deployment_gpt4
from routes.play_ollama import PlayerRequest
from logs.logger import logs
from json import JSONDecodeError


router = APIRouter()


@router.post("/play-azure")
def play_azure(request: PlayerRequest):
    board = request.board
    available_cells = request.available_cells
    turn = request.turn
    size = len(board)
    logs.info(f"Board state: {board}")
    logs.info(f"Player Turn: {turn}")
    logs.info(f"Grid size: {size}")

    if turn.lower() == "x":
        client_model = client  # O4-mini
        deployment_model = deployment
    else:
        client_model = client_gpt4  # GPT-4
        deployment_model = deployment_gpt4

    prompt = f"""
You are an expert AI agent playing Tic-Tac-Toe on a dynamic {size}x{size} board.

Current board:
{board}

You are playing as '{turn}'.

Your task is to choose the strongest possible move.

-------------------------------------
STRATEGY (MANDATORY BEHAVIOR)
-------------------------------------
1. Win if possible
2. Block opponent's win
3. Create a fork
4. Prevent opponent forks
5. Center priority
6. Strong positional placement
7. Avoid losing moves

-------------------------------------
OUTPUT RULES (STRICT)
-------------------------------------
You must respond with EXACTLY one JSON object in this format:
{{"row": <row_index>, "col": <col_index>}}.
- row_index and col_index must be integers between 0 and {size - 1}.
- The chosen cell must be empty.
- The chosen cell MUST be empty. Here is a list of empty cells : {available_cells}. You WILL NOT choose any cell that is not in the provided list.
- DO NOT output explanations or extra text.
ONLY output the JSON object.
-------------------------------------
Now choose the best legal move and output ONLY the JSON object.
"""

    try:
        response = client_model.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            max_completion_tokens=700,
            model=deployment_model,
        )

        content = response.choices[0].message.content
        logs.info(f"[{deployment_model}] RAW MODEL CONTENT: {content!r}")

        if not content.strip():
            raise ValueError("Model returned empty content")

        match = re.search(r"\{[\s\S]*\}", content)
        if not match:
            raise ValueError(f"No JSON object found in response: {content}")

        move = json.loads(match.group(0))

        if "row" not in move or "col" not in move:
            raise ValueError(f"JSON missing required fields: {move}")

        logs.info(f"[{deployment_model}] Parsed move: {move}")
        logs.info("======= END OF TURN =======")
        return {"model_used": deployment_model, "move": move}

    except (AttributeError, IndexError) as e:
        logs.error(f"Error accessing model response content: {str(e)}")
        return {"error": "Invalid model response", "details": str(e)}

    except JSONDecodeError as e:
        logs.error(f"JSON parsing error: {str(e)}")
        return {"error": "Failed to parse JSON", "details": str(e)}

    except (ValueError, KeyError) as e:
        logs.error(f"Logical error or missing fields: {str(e)}")
        return {"error": "Invalid move data", "details": str(e)}

    except (
        # APIError, APIConnectionError, AuthenticationError, Timeout
    ) as e:
        logs.error(f"Model API error: {str(e)}")
        return {"error": "Model API error", "details": str(e)}

    except Exception as e:
        logs.error(f"Unexpected error: {str(e)}")
        return {"error": "Unexpected error", "details": str(e)}
