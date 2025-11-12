from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from routes.play_ollama import router as ollama_router
from routes.play_azure import router as llm_router
from logs.logger import logs

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logs.info("API is starting up...")


@app.get("/")
def home():
    return {"message": "Hello, FastAPI!"}


app.include_router(ollama_router, prefix="/ollama", tags=["Ollama"])
app.include_router(llm_router, prefix="/azure-llm", tags=["Azure LLM"])
logs.info(" Loaded both Ollama and Azure LLM routes.")
