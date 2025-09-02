from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import declarative_base, sessionmaker, relationship, Session
from sqlalchemy import func
import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .chatbot import chat_with_user 


# Database setup
db_url = "sqlite:///./books.db"
engine = create_engine(db_url, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database models
class Book(Base):
    __tablename__ = "books"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    author = Column(String, nullable=False)
    synopsis = Column(Text)
    isbn = Column(String)
    url = Column(String)
    created_at = Column(DateTime, server_default=func.now())
    reviews = relationship("Review", back_populates="book")

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    rating = Column(Integer, nullable=False)
    text = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    book = relationship("Book", back_populates="reviews")


Base.metadata.create_all(bind=engine)

# FastAPI app
app = FastAPI(title="Book Discussion AI")

class ChatRequest(BaseModel):
    prompt: str
    max_tokens: int = 200

# Dependency for DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Schemas
class BookCreate(BaseModel):
    title: str
    author: str
    synopsis: Optional[str]
    isbn: Optional[str]
    url: Optional[str]

class BookOut(BookCreate):
    id: int
    class Config:
        orm_mode = True

class ReviewCreate(BaseModel):
    book_id: int
    rating: int
    text: Optional[str]

class ReviewOut(ReviewCreate):
    id: int
    class Config:
        orm_mode = True


# Routes
@app.post("/books", response_model=BookOut)
def create_book(book: BookCreate, db: Session = Depends(get_db)):
    new_book = Book(**book.dict())
    db.add(new_book)
    db.commit()
    db.refresh(new_book)
    return new_book

@app.get("/books", response_model=List[BookOut])
def get_books(db: Session = Depends(get_db)):
    return db.query(Book).all()

@app.post("/reviews", response_model=ReviewOut)
def create_review(review: ReviewCreate, db: Session = Depends(get_db)):
    if not db.query(Book).filter(Book.id == review.book_id).first():
        raise HTTPException(status_code=404, detail="Book not found")
    new_review = Review(**review.dict())
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return new_review

@app.get("/recommendations")
def recommendations(limit: int = 5, db: Session = Depends(get_db)):
    # Calculate average rating per book
    top_books = (
        db.query(Review.book_id, func.avg(Review.rating).label("avg_rating"))
        .group_by(Review.book_id)
        .order_by(func.avg(Review.rating).desc())
        .limit(limit)
        .all()
    )
    books = [db.query(Book).filter(Book.id == b.book_id).first() for b in top_books]
    return [{"id": b.id, "title": b.title, "author": b.author} for b in books]

# Chat endpoint
@app.post("/chat/")
def chat_endpoint(request: ChatRequest):
    if not request.prompt:
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")
    response = chat_with_user(request.prompt, max_new_tokens=request.max_tokens)
    return {"response": response}

# Simple health check
@app.get("/")
def root():
    return {"message": "Book Discussion AI server is running!"}

# Allow your frontend (React) to access the API
origins = [
    "http://localhost:3000",  # your React dev server
    # "http://127.0.0.1:3000",  # optional alternative
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # allow POST, GET, OPTIONS, etc.
    allow_headers=["*"],
)