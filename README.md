# Book Discussion AI

**Book Discussion AI** is a full-stack web application that allows users to discuss, explore, and review books. It combines an AI-powered chatbot for personalized book recommendations and discussions with a database-driven book collection and review system.  

## Features

### 1. AI Chatbot
- Interact with a chatbot powered by **TinyLlama 1.1B**.
- Ask for **book recommendations**, discuss books, or just chat.
- Recommends books based on semantic similarity of descriptions using **FAISS** and **Sentence Transformers**.

### 2. Book Collection
- View a list of books stored in the database.
- Each book includes:
  - Title
  - Author
  - Synopsis
  - ISBN
  - URL

### 3. Reviews
- Write reviews for books.
- Rate books on a scale.
- View reviews from other users.
- See **top-rated books** based on average ratings.

## Tech Stack

- **Frontend:** React.js  
  - Components: `Chat`, `Navbar`, book/review pages  
  - Axios for API calls  
  - React Router for navigation
- **Backend:** FastAPI  
  - Chat endpoint with AI integration  
  - Book & Review CRUD endpoints  
  - SQLite database with SQLAlchemy ORM
- **AI/ML:**  
  - `TinyLlama` for chatbot responses  
  - `SentenceTransformer` (`all-MiniLM-L6-v2`) for embedding book descriptions  
  - `FAISS` for semantic similarity search
- **Other:**  
  - CORS middleware for frontend-backend communication  
  - Tqdm (optional) for tracking embeddings generation  

---

## Installation

### Backend

1. Clone the repository:
```bash
git clone https://github.com/yourusername/book_project.git
cd book_project
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
# macOS/Linux
source venv/bin/activate
# Windows
venv\Scripts\activate
```

3. Install requirements:
```bash
pip install -r requirements.txt
```

4. Run FastAPI server:
```bash
uvicorn server.main:app --reload
```
API will be available at http://127.0.0.1:8000/.

### Frontend

1. Navigate to frontend folder:
```bash
cd book-chat
```

2. Install dependencies:
```bash
npm install
```

3. Start React development server:
```bash
npm start
```
React app will be available at http://localhost:3000.

## Usage
- Navigate between pages using the Navbar
- Chat with the AI to get book recommendations.
- Add new books and write reviews via the frontend interface.
- View top-rated books and user reviews.

## Notes
- Initial embeddings generation may take time depending on the dataset size. You can precompute embeddings to speed up startup.
- Ensure CORS is enabled in the backend to allow React frontend to communicate with FastAPI.
- Large CSV or FAISS index files should be managed carefully to avoid GitHub file size limits.
