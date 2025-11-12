from logs.logger import logs


def game_handler(board, available_cells, turn, model=None):
    """
    Prepares board data and logs relevant information.
    Can be used for any model or endpoint.

    Args:
        board (list): Current state of the board
        available_cells (list): List of available cells
        turn (str): Current player's turn ('x' or 'o')
        model (str, optional): Model name if applicable

    Returns:
        dict: Prepared data for further processing
    """

    size = len(board)
    logs.info(f"Board state: {board}")
    logs.info(f"Player Turn: {turn}")
    logs.info(f"Model Name: {model}")
    logs.info(f"Grid size: {size}")
    if model:
        logs.info(f"Model Name: {model}")
        logs.info(f"Grid size: {size}")
    return {
        "board": board,
        "available_cells": available_cells,
        "turn": turn,
        "model": model,
        "size": size,
    }
