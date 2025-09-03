import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Reviews() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0); // state for star rating
  const [loading, setLoading] = useState(false);

  // Fetch all books on load
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/books")
      .then((res) => setBooks(res.data))
      .catch(() => alert("Failed to fetch books"));
  }, []);

  // Fetch reviews when a book is selected
  useEffect(() => {
    if (!selectedBook) return;
    setLoading(true);
    axios
      .get(`http://127.0.0.1:8000/reviews?book_id=${selectedBook.id}`)
      .then((res) => setReviews(res.data))
      .catch(() => alert("Failed to fetch reviews"))
      .finally(() => setLoading(false));
  }, [selectedBook]);

  // Add review with rating
  const handleAddReview = async () => {
    if (!newReview.trim() || rating === 0) {
      alert("Please provide both a review and a rating.");
      return;
    }
    try {
      await axios.post("http://127.0.0.1:8000/reviews", {
        book_id: selectedBook.id,
        rating: rating,
        text: newReview,
      });
      setNewReview("");
      setRating(0);
      setReviews([...reviews, { text: newReview, rating: rating }]);
    } catch (err) {
      alert("Failed to add review");
    }
  };

  // Filter books live as user types
  const filteredBooks = books.filter((b) =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "30px auto",
        padding: "20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#4A90E2" }}>
        Book Reviews
      </h2>

      {/* Search box */}
      <input
        type="text"
        placeholder="Search for a book..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          fontSize: "16px",
        }}
      />

      {/* Book selection */}
      {!selectedBook && (
        <div
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "10px",
          }}
        >
          {filteredBooks.length === 0 ? (
            <p>No books found.</p>
          ) : (
            filteredBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => setSelectedBook(book)}
                style={{
                  padding: "8px",
                  borderBottom: "1px solid #f0f0f0",
                  cursor: "pointer",
                }}
              >
                {book.title}{" "}
                <span style={{ fontStyle: "italic", color: "#555" }}>
                  by {book.authors}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Reviews for selected book */}
      {selectedBook && (
        <div>
          <button
            onClick={() => setSelectedBook(null)}
            style={{
              marginBottom: "10px",
              backgroundColor: "#E0E0E0",
              border: "none",
              padding: "8px 12px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            ← Back to search
          </button>

          <h3>{selectedBook.title}</h3>

          {loading ? (
            <p>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p>No reviews yet. Be the first to add one!</p>
          ) : (
            <ul style={{ paddingLeft: "20px" }}>
              {reviews.map((review, idx) => (
                <li key={idx} style={{ marginBottom: "10px" }}>
                  {"⭐".repeat(review.rating)} ({review.rating}) -{" "}
                  {review.text}
                </li>
              ))}
            </ul>
          )}

          {/* Add review box */}
          <div style={{ marginTop: "20px" }}>
            {/* Star rating selector */}
            <div style={{ marginBottom: "10px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  style={{
                    fontSize: "24px",
                    cursor: "pointer",
                    color: star <= rating ? "#FFD700" : "#ccc",
                    marginRight: "5px",
                  }}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Review textarea */}
            <textarea
              rows={3}
              placeholder="Write your review here..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            ></textarea>
            <button
              onClick={handleAddReview}
              style={{
                marginTop: "10px",
                padding: "10px 20px",
                backgroundColor: "#4A90E2",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Submit Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
}