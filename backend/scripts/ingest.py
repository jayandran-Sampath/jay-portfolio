"""
Run this script once to index all your content into Supabase.
Re-run anytime your content changes.

Usage:
  cd backend
  source venv/bin/activate
  python scripts/ingest.py

Requirements:
  - Ollama running locally (ollama serve)
  - all-minilm:l6-v2 model pulled (ollama pull all-minilm:l6-v2)
  - .env file with SUPABASE_URL and SUPABASE_SECRET_KEY
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from rag.indexer import index_resume, index_blog, index_github_repos

# ─── 1. Resume ────────────────────────────────────────────────
index_resume("../data/resume.pdf")


# ─── 2. Blogs ─────────────────────────────────────────────────
blog_data_engineering = """
Data Engineering – Getting Started

In the current AI era, data is the core component for building intelligent systems.
Data engineering is the practice of designing and building systems for collecting,
storing, and analyzing data at scale.

Key concepts include ETL pipelines, data warehouses, data lakes, and streaming systems.
Tools commonly used: Apache Spark, Airflow, Kafka, dbt, and cloud platforms like AWS.

Getting started requires understanding SQL, Python, and distributed computing.
Start with batch processing before moving to streaming pipelines.

Data engineers build the foundation that data scientists and ML engineers rely on.
Without clean, reliable data pipelines, AI systems cannot function effectively.
"""

blog_etl_airflow = """
ETL with Airflow & PySpark

ETL stands for Extract, Transform, Load — the backbone of data pipelines.

Apache Airflow orchestrates ETL workflows via DAGs (Directed Acyclic Graphs).
Each DAG defines tasks and their dependencies, making pipelines easy to schedule and monitor.

PySpark enables distributed data processing across large datasets.
Combined with Airflow, you get a powerful ETL stack:
- Airflow schedules and triggers jobs
- PySpark processes data in parallel across nodes
- Results are loaded into data warehouses or lakes

Key tips:
- Partition your data wisely for performance
- Use broadcast joins for small lookup tables
- Monitor Spark executors for memory issues
- Use Airflow sensors to wait for upstream data
- Always test DAGs locally before deploying
"""

blog_spring_jpa = """
Spring JPA Performance Improvement: 5.5s to 350ms

Situation: During 8-hour soak test, API response times hit 5.5 seconds.

Root cause analysis using Jaeger and Kibana revealed N+1 query problems.
Each parent entity triggered individual child queries in a loop — very inefficient.

Solutions applied:
1. JOIN FETCH in JPQL queries to eagerly load associations in one query
2. @BatchSize annotation to reduce database round trips
3. @Cacheable for frequently read, rarely changed data
4. Replaced findAll() with Pageable pagination

Result: Response time dropped from 5.5s to 350ms — 94% improvement.

Key lesson: Always profile SQL queries under production-like load before go-live.
Use tools like Jaeger for distributed tracing and Kibana for log analysis.
"""

blog_https = """
How HTTPS Really Works — The Secret Behind the Lock Icon

Every time you visit a website with a lock icon, a TLS handshake happens silently.

The process:
1. Client Hello — browser sends supported TLS versions and cipher suites
2. Server Hello — server picks cipher suite and sends its SSL certificate
3. Certificate verification — browser verifies certificate against trusted CAs
4. Key exchange — asymmetric encryption used to exchange a symmetric session key
5. Encrypted communication — all data encrypted using the session key

Why asymmetric then symmetric?
Asymmetric (RSA/ECDH) is secure but slow — used only for key exchange.
Symmetric (AES) is fast — used for actual data transfer.

This hybrid approach gives both security and performance.
TLS 1.3 simplified this handshake further, reducing latency significantly.
"""

blog_scala3 = """
Rewriting a Scala 2 Codebase Into Scala 3: A Practical Guide

Scala 3 brings major improvements but migrating requires careful planning.

Key changes from Scala 2 to Scala 3:
- New syntax: optional braces, indentation-based blocks
- Given/using replaces implicit val/def
- Extension methods replace implicit classes
- Opaque types for type safety without runtime overhead
- Union and intersection types
- Enum improvements — proper ADTs

Migration strategy:
1. Start with sbt-scala3-migrate plugin to identify incompatibilities
2. Fix compiler warnings before upgrading
3. Migrate macros last — biggest breaking change
4. Use cross-compilation to support both versions temporarily
5. Update dependencies — not all Scala 2 libraries have Scala 3 versions

Practical tips from real migration:
- Rewrite implicits to given/using first — biggest win
- Use -source:3.0-migration flag for helpful hints
- Test thoroughly — type inference changed subtly
"""

index_blog(blog_data_engineering, "Data Engineering Getting Started",
           "https://jaidg2012.medium.com/data-engineering-getting-started-367429e7c4cc")

index_blog(blog_etl_airflow, "ETL with Airflow and PySpark",
           "https://jaidg2012.medium.com/etl-with-airflow-pyspark-7d0c8f78b10d")

index_blog(blog_spring_jpa, "Spring JPA Performance 5.5s to 350ms",
           "https://jaidg2012.medium.com/spring-jpa-performance-improvement-from-5-5s-350ms-250d6f92fc01")

index_blog(blog_https, "How HTTPS Really Works",
           "https://jaidg2012.medium.com/how-https-really-works-the-secret-behind-the-lock-icon-023f44e1f58d")

index_blog(blog_scala3, "Rewriting Scala 2 to Scala 3",
           "https://jaidg2012.medium.com/rewriting-a-scala-2-codebase-into-scala-3-a-practical-guide-351155d01a76")


# ─── 3. GitHub Repos ──────────────────────────────────────────
repos = [
    {
        "name": "jay-portfolio",
        "description": "Personal portfolio with AI chatbot Jarvis using RAG pipeline",
        "readme": "Built with React, Python FastAPI, Supabase pgvector, Ollama embeddings, and Anthropic Claude. Jarvis answers questions about Jay's experience using RAG."
    },
    {
        "name": "etl-airflow-pyspark",
        "description": "ETL pipeline using Apache Airflow and PySpark for distributed data processing",
        "readme": "Batch data processing with Airflow DAGs and PySpark transformations. Includes monitoring setup and data quality checks."
    },
]

index_github_repos(repos)

print("\n✅ All content indexed successfully!")
print("📊 Check Supabase → Table Editor → documents to verify")
