import React, { useState, useEffect } from "react";
import axios from "axios";

export default function LatestReviews() {
  const [latestReviews, setLatestReviews] = useState([]);
  const [booksMap, setBooksMap] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all books once
        const booksRes = await axios.get("http://127.0.0.1:8000/books");
        const map = {};
        booksRes.data.forEach((book) => {
          map[book.id] = book.title;
        });
        setBooksMap(map);

        // Fetch latest reviews
        const reviewsRes = await axios.get("http://127.0.0.1:8000/reviews/latest");
        const reviewsWithTitles = reviewsRes.data.map((review) => ({
          ...review,
          book_title: map[review.book_id] || "Unknown Book",
        }));
        setLatestReviews(reviewsWithTitles);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch latest reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#4A90E2", marginBottom: "20px" }}>
        Latest Reviews
      </h2>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : latestReviews.length === 0 ? (
        <p style={{ textAlign: "center" }}>No reviews yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "20px",
          }}
        >
          {latestReviews.map((review, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "15px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
                backgroundColor: "#fff",
              }}
            >
              <h3 style={{ margin: "0 0 10px 0", color: "#4A90E2" }}>
                {review.book_title}
              </h3>
              <p style={{ margin: "0 0 5px 0" }}>
                {"⭐".repeat(review.rating)} ({review.rating})
              </p>
              <p style={{ margin: 0 }}>{review.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
