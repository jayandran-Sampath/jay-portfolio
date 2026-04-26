from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv
from rag.retriever import retrieve, format_context

load_dotenv()

app       = FastAPI()
USE_LOCAL = os.getenv("USE_LOCAL", "true").lower() == "true"

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://jaidg2012.github.io"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Local — Ollama llama3.2
OLLAMA_CHAT_URL  = "http://localhost:11434/api/chat"
OLLAMA_LLM_MODEL = "llama3.2"

# Production — Claude Haiku
CLAUDE_API_URL = "https://api.anthropic.com/v1/messages"
CLAUDE_MODEL   = "claude-haiku-4-5-20251001"
ANTHROPIC_KEY  = os.getenv("ANTHROPIC_API_KEY")


# ─── Models ───────────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str
    history: list[dict] = []

class ChatResponse(BaseModel):
    reply: str
    sources: list[str] = []


# ─── System Prompt ────────────────────────────────────────────
SYSTEM_PROMPT = """You are Jarvis, an AI assistant on Jayandran Sampath's portfolio website.
You are friendly, professional and a little witty — like a smart colleague.

Your job is to answer questions about Jay — his experience, skills, projects, and blogs.

Rules:
- For greetings like "hello", "hi", "how are you" — respond warmly and naturally
- For questions about Jay — answer ONLY using the context provided below
- For questions not about Jay — politely say you're focused on Jay's portfolio
- If the answer is not in the context, say "I don't have that detail — you can reach Jay at jaidg2012@gmail.com"
- Keep answers concise and friendly
- Never make up experience or skills Jay doesn't have
- Refer to Jay in third person ("Jay has...", "He worked on...")

--- CONTEXT ---
{context}
--- END CONTEXT ---"""


# ─── Health Check ─────────────────────────────────────────────
@app.get("/")
def health():
    mode = "local (Ollama + llama3.2)" if USE_LOCAL else "production (HuggingFace + Claude Haiku)"
    return {"status": "Jarvis is online 🤖", "mode": mode}


# ─── Local Generation — Ollama ────────────────────────────────
def generate_local(system: str, messages: list[dict]) -> str:
    payload  = [{"role": "system", "content": system}] + messages
    response = requests.post(OLLAMA_CHAT_URL, json={
        "model": OLLAMA_LLM_MODEL,
        "messages": payload,
        "stream": False
    }, timeout=60)
    response.raise_for_status()
    return response.json()["message"]["content"]


# ─── Production Generation — Claude Haiku ─────────────────────
def generate_production(system: str, messages: list[dict]) -> str:
    response = requests.post(
        CLAUDE_API_URL,
        headers={
            "x-api-key": ANTHROPIC_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        },
        json={
            "model": CLAUDE_MODEL,
            "max_tokens": 1000,
            "system": system,
            "messages": messages
        },
        timeout=30
    )
    response.raise_for_status()
    return response.json()["content"][0]["text"]


# ─── Chat Endpoint ────────────────────────────────────────────
@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):

    # Step 1: Retrieve relevant chunks
    chunks  = retrieve(req.message, match_count=5)
    context = format_context(chunks)
    sources = list(set([c["source"] for c in chunks]))

    # Step 2: Build system prompt with RAG context
    system = SYSTEM_PROMPT.format(context=context)

    # Step 3: Build message history
    messages = req.history + [{"role": "user", "content": req.message}]

    # Step 4: Generate — local or production
    try:
        if USE_LOCAL:
            reply = generate_local(system, messages)
        else:
            reply = generate_production(system, messages)
    except requests.exceptions.Timeout:
        raise HTTPException(status_code=504, detail="Model timed out")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return ChatResponse(reply=reply, sources=sources)