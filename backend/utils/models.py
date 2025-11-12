from pydantic import BaseModel


class PlayerRequest(BaseModel):
    board: list[list[str]]
    turn: str
    available_cells: list[dict]
