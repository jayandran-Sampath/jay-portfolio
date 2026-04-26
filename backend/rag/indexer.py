import os
import requests
from dotenv import load_dotenv
from supabase import create_client
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter

load_dotenv()

supabase    = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SECRET_KEY"))
USE_LOCAL   = os.getenv("USE_LOCAL", "true").lower() == "true"

# Local — Ollama
OLLAMA_EMBED_URL   = "http://localhost:11434/api/embeddings"
OLLAMA_EMBED_MODEL = "all-minilm:l6-v2"

# Production — HuggingFace Inference API (same model, same 384 dims)
HF_EMBED_URL = "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction"
HF_API_KEY   = os.getenv("HF_API_KEY")


# ─── Embedding ────────────────────────────────────────────────
def get_embedding(text: str) -> list[float]:
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


def get_embeddings_batch(texts: list[str]) -> list[list[float]]:
    if USE_LOCAL:
        embeddings = []
        for i, text in enumerate(texts):
            embeddings.append(get_embedding(text))
            if (i + 1) % 10 == 0:
                print(f"  ⏳ Embedded {i + 1}/{len(texts)} chunks...")
        return embeddings
    else:
        # HuggingFace supports batch input
        response = requests.post(
            HF_EMBED_URL,
            headers={"Authorization": f"Bearer {HF_API_KEY}"},
            json={"inputs": texts}
        )
        response.raise_for_status()
        return response.json()


# ─── PDF Parsing ──────────────────────────────────────────────
def parse_pdf(path: str) -> str:
    reader = PdfReader(path)
    text   = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    print(f"✅ Parsed PDF: {len(text)} characters")
    return text


# ─── Chunking ─────────────────────────────────────────────────
def chunk_text(text: str, source: str) -> list[dict]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=75,
        separators=["\n\n", "\n", " ", ""]
    )
    raw_chunks = splitter.split_text(text)
    chunks = []
    for i, chunk in enumerate(raw_chunks):
        if len(chunk.strip()) < 50:
            continue
        chunks.append({
            "source":   source,
            "title":    f"{source} chunk {i + 1}",
            "content":  chunk.strip(),
            "metadata": {"chunk_index": i, "source": source}
        })
    print(f"✅ Created {len(chunks)} chunks from {source}")
    return chunks


# ─── Store in Supabase ────────────────────────────────────────
def store_chunks(chunks: list[dict]):
    provider = "Ollama" if USE_LOCAL else "HuggingFace"
    print(f"⏳ Embedding {len(chunks)} chunks via {provider}...")

    texts      = [c["content"] for c in chunks]
    embeddings = get_embeddings_batch(texts)

    rows = []
    for i, chunk in enumerate(chunks):
        rows.append({
            "source":    chunk["source"],
            "title":     chunk["title"],
            "content":   chunk["content"],
            "embedding": embeddings[i],
            "metadata":  chunk["metadata"],
        })

    batch_size = 50
    for i in range(0, len(rows), batch_size):
        batch = rows[i:i + batch_size]
        supabase.table("documents").insert(batch).execute()
        print(f"  ✅ Stored batch {i // batch_size + 1} ({len(batch)} rows)")

    print(f"🎉 Done! {len(rows)} chunks stored.")


# ─── Clear existing source ────────────────────────────────────
def clear_source(source: str):
    supabase.table("documents").delete().eq("source", source).execute()
    print(f"🗑️  Cleared existing '{source}' chunks")


# ─── Index Resume ─────────────────────────────────────────────
def index_resume(pdf_path: str):
    print("\n📄 Indexing resume...")
    clear_source("resume")
    text   = parse_pdf(pdf_path)
    chunks = chunk_text(text, "resume")
    store_chunks(chunks)


# ─── Index Blog ───────────────────────────────────────────────
def index_blog(text: str, title: str, url: str = ""):
    print(f"\n📝 Indexing blog: {title}")
    clear_source(f"blog:{title}")
    chunks = chunk_text(text, f"blog:{title}")
    for c in chunks:
        c["metadata"]["url"]   = url
        c["metadata"]["title"] = title
    store_chunks(chunks)


# ─── Index GitHub repos ───────────────────────────────────────
def index_github_repos(repos: list[dict]):
    print(f"\n⚙️  Indexing {len(repos)} GitHub repos...")
    clear_source("github")
    chunks = []
    for repo in repos:
        content = f"{repo['name']}: {repo.get('description', '')}\n\n{repo.get('readme', '')}"
        chunks.append({
            "source":   "github",
            "title":    repo["name"],
            "content":  content[:1000],
            "metadata": {"repo": repo["name"], "source": "github"}
        })
    store_chunks(chunks)