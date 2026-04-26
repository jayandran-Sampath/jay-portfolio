import os
import requests
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

supabase  = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SECRET_KEY"))
USE_LOCAL = os.getenv("USE_LOCAL", "true").lower() == "true"

# Local — Ollama
OLLAMA_EMBED_URL   = "http://localhost:11434/api/embeddings"
OLLAMA_EMBED_MODEL = "all-minilm:l6-v2"

# Production — HuggingFace Inference API
HF_EMBED_URL = "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction"
HF_API_KEY   = os.getenv("HF_API_KEY")


# ─── Embed Query ──────────────────────────────────────────────
def embed_query(text: str) -> list[float]:
    if USE_LOCAL:
        response = requests.post(OLLAMA_EMBED_URL, json={
            "model": OLLAMA_EMBED_MODEL,
            "prompt": text
        })
        response.raise_for_status()
        return response.json()["embedding"]
    else:
        response = requests.post(
            HF_EMBED_URL,
            headers={"Authorization": f"Bearer {HF_API_KEY}"},
            json={"inputs": text}
        )
        response.raise_for_status()
        return response.json()


# ─── Retrieve ─────────────────────────────────────────────────
def retrieve(query: str, match_count: int = 5, source: str = None) -> list[dict]:
    query_vector = embed_query(query)

    params = {
        "query_embedding": query_vector,
        "match_count": match_count,
    }
    if source:
        params["filter_source"] = source

    result = supabase.rpc("match_documents", params).execute()
    return result.data or []


# ─── Format Context ───────────────────────────────────────────
def format_context(chunks: list[dict]) -> str:
    if not chunks:
        return "No relevant information found."

    context_parts = []
    for i, chunk in enumerate(chunks, 1):
        context_parts.append(
            f"[Source {i}: {chunk['source']}]\n{chunk['content']}"
        )
    return "\n\n---\n\n".join(context_parts)