import os
from dotenv import load_dotenv
from openai import AzureOpenAI

load_dotenv()

client = AzureOpenAI(
    api_version=os.getenv("AZURE_O4MINI_API_VERSION"),
    azure_endpoint=os.getenv("AZURE_O4MINI_ENDPOINT"),  # type: ignore
    api_key=os.getenv("AZURE_O4MINI_API_KEY"),
)
deployment = os.getenv("AZURE_O4MINI_DEPLOYMENT")

# GPT-4 client
client_gpt4 = AzureOpenAI(
    api_version=os.getenv("AZURE_GPT4_API_VERSION"),
    azure_endpoint=os.getenv("AZURE_GPT4_ENDPOINT"),  # type: ignore
    api_key=os.getenv("AZURE_GPT4_API_KEY"),
)

deployment_gpt4 = os.getenv("AZURE_GPT4_DEPLOYMENT")
