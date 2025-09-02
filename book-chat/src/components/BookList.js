import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);
  const [totalBooks, setTotalBooks] = useState(0);
  const [selectedBook, setSelectedBook] = useState(null); // for modal

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`http://127.0.0.1:8000/books`);
        setTotalBooks(response.data.length);
        const start = (page - 1) * pageSize;
        const paginated = response.data.slice(start, start + pageSize);
        setBooks(paginated);
      } catch (err) {
        setError("Failed to fetch books.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [page, pageSize]);

  const totalPages = Math.ceil(totalBooks / pageSize);

  if (loading) return <p>Loading books...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "30px auto",
        padding: "20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#4A90E2" }}>Books Collection</h2>

      {books.length === 0 ? (
        <p style={{ textAlign: "center" }}>No books available.</p>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "16px",
            }}
          >
            {books.map((book) => (
              <div
                key={book.id}
                onClick={() => setSelectedBook(book)}
                style={{
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  backgroundColor: "#f9f9f9",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  height: "280px",
                  overflow: "hidden",
                }}
              >
                <h3 style={{ margin: "0 0 6px", color: "#333", fontSize: "16px" }}>
                  {book.title}
                </h3>
                <p style={{ margin: "2px 0", fontStyle: "italic", fontSize: "14px" }}>
                  Authors: {book.authors}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
            <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
              Next
            </button>
          </div>
        </>
      )}

      {/* Modal */}
      {selectedBook && (
        <div
          onClick={() => setSelectedBook(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#fff",
              padding: "24px",
              borderRadius: "12px",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <h2>{selectedBook.title}</h2>
            <p><strong>Authors:</strong> {selectedBook.authors}</p>
            {selectedBook.category && <p><strong>Category:</strong> {selectedBook.category}</p>}
            {selectedBook.publisher && <p><strong>Publisher:</strong> {selectedBook.publisher}</p>}
            {selectedBook.price && <p><strong>Price:</strong> {selectedBook.price}</p>}
            {selectedBook.publish_month || selectedBook.publish_year ? (
              <p>
                <strong>Published:</strong> {selectedBook.publish_month} {selectedBook.publish_year}
              </p>
            ) : null}
            {selectedBook.description && (
              <p><strong>Synopsis:</strong> {selectedBook.description}</p>
            )}
            {selectedBook.url && (
              <a href={selectedBook.url} target="_blank" rel="noopener noreferrer">
                More Info
              </a>
            )}
            <button
              onClick={() => setSelectedBook(null)}
              style={{ marginTop: "16px", padding: "8px 16px", cursor: "pointer" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
