import pandas as pd
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
import pickle
import os
from tqdm import tqdm  # <-- added

# Load your book dataset
BOOKS_CSV = "server/books.csv"
INDEX_FILE = "server/book_index.faiss"
EMBEDDINGS_FILE = "server/book_embeddings.pkl"

# Load books dataframe
books_df = pd.read_csv(BOOKS_CSV)
books_df['Description'] = books_df['Description'].fillna("")

# Load embedding model
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

# Precompute or load embeddings + index
if os.path.exists(INDEX_FILE) and os.path.exists(EMBEDDINGS_FILE):
    index = faiss.read_index(INDEX_FILE)
    with open(EMBEDDINGS_FILE, "rb") as f:
        book_embeddings = pickle.load(f)
else:
    # Use tqdm to show progress
    book_embeddings = np.array([embedding_model.encode(desc) for desc in tqdm(books_df['Description'], desc="Encoding books")])
    
    index = faiss.IndexFlatL2(book_embeddings.shape[1])
    index.add(book_embeddings)
    
    faiss.write_index(index, INDEX_FILE)
    with open(EMBEDDINGS_FILE, "wb") as f:
        pickle.dump(book_embeddings, f)

print(f"Embedding shape: {book_embeddings.shape}")
print(f"Index ntotal: {index.ntotal}")

def recommend_books(user_query, top_k=5):
    print(f"Query received: {user_query}")  # Debug
    query_embedding = embedding_model.encode(user_query)
    distances, indices = index.search(np.array([query_embedding]), top_k)
    print(f"indices: {indices}, distances: {distances}")  # Debug

    recommendations = []
    for i in indices[0]:
        book = books_df.iloc[i]
        recommendations.append({
            "title": book['Title'],
            "author": book['Authors'],
            "description": book['Description'],
            "category": book['Category'],
        })
    return recommendations
