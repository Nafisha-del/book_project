from sentence_transformers import SentenceTransformer
import faiss
import numpy as np


model = SentenceTransformer('all-MiniLM-L6-v2')


# Example: encode book synopsis
book_texts = [b.synopsis for b in db.query(Book).all() if b.synopsis]
embeddings = model.encode(book_texts, convert_to_numpy=True)


# Create FAISS index
dim = embeddings.shape[1]
index = faiss.IndexFlatIP(dim)
faiss.normalize_L2(embeddings)
index.add(embeddings)