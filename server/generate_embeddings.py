from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

# Load a lightweight open-source embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Example book dataset
books = [
    {"title": "Harry Potter and the Philosopher's Stone", "description": "A young boy discovers he is a wizard."},
    {"title": "The Hobbit", "description": "Bilbo Baggins goes on an unexpected adventure."},
    {"title": "Pride and Prejudice", "description": "A classic romance about Elizabeth Bennet and Mr. Darcy."},
]

# Encode book descriptions
book_embeddings = np.array([model.encode(book["description"]) for book in books])

# Build FAISS index
index = faiss.IndexFlatL2(book_embeddings.shape[1])
index.add(book_embeddings)

def recommend_books(user_query, top_k=3):
    query_embedding = model.encode(user_query)
    distances, indices = index.search(np.array([query_embedding]), top_k)
    return [books[i]["title"] for i in indices[0]]

# Example
if __name__ == "__main__":
    query = "I want a magical fantasy story"
    recs = recommend_books(query)
    print(recs)