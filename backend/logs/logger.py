import logging
from logging.handlers import RotatingFileHandler
import os

# ===============================
#  Toggle: ON = save logs to file
#          OFF = console only
# ===============================
ENABLE_FILE_LOGS = False  # Change when need to save logs

# Ensure log folder exists if file logging is enabled
log_folder = "logs"
if ENABLE_FILE_LOGS:
    os.makedirs(log_folder, exist_ok=True)

# Logger instance
logs = logging.getLogger("tic_tac_toe")
logs.setLevel(logging.INFO)

# Formatter (common for all handlers)
formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")

# -------- Console handler (always active) --------
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
console_handler.setFormatter(formatter)
logs.addHandler(console_handler)

# -------- File handler  --------
if ENABLE_FILE_LOGS:
    file_handler = RotatingFileHandler(
        os.path.join(log_folder, "app.log"),
        maxBytes=5 * 1024 * 1024,  # 5 MB
        backupCount=3,
    )
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(formatter)
    logs.addHandler(file_handler)

# Export "logs" so you can import it everywhere
__all__ = ["logs"]
