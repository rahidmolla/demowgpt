import os

from dotenv import load_dotenv


load_dotenv()


PRACTICE_API_KEY = os.getenv(
    "PRACTICE_API_KEY"
)


if not PRACTICE_API_KEY:
    raise ValueError(
        "PRACTICE_API_KEY is not set"
    )

print("API Key loaded:", PRACTICE_API_KEY)