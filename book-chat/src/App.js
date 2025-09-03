import React, { useState } from "react";
import Chat from "./components/Chat";
import BookList from "./components/BookList";
import Reviews from "./components/Reviews";
import LatestReviews from "./components/LatestReviews";

function App() {
  const [view, setView] = useState("chat"); // 'chat', 'books', 'reviews'

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "30px auto",
        padding: "20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Navigation Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => setView("chat")}
          style={{
            padding: "10px 20px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: view === "chat" ? "#4A90E2" : "#E0E0E0",
            color: view === "chat" ? "#fff" : "#000",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Chat
        </button>
        <button
          onClick={() => setView("books")}
          style={{
            padding: "10px 20px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: view === "books" ? "#4A90E2" : "#E0E0E0",
            color: view === "books" ? "#fff" : "#000",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Books List
        </button>
        <button
          onClick={() => setView("reviews")}
          style={{
            padding: "10px 20px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: view === "reviews" ? "#4A90E2" : "#E0E0E0",
            color: view === "reviews" ? "#fff" : "#000",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Write Reviews
        </button>
        <button
          onClick={() => setView("latest")}
          style={{
            padding: "10px 20px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: view === "latest" ? "#4A90E2" : "#E0E0E0",
            color: view === "latest" ? "#fff" : "#000",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Latest Reviews
        </button>
      </div>

      {/* Render Selected View */}
      {view === "chat" && <Chat />}
      {view === "books" && <BookList />}
      {view === "reviews" && <Reviews />}
      {view === "latest" && <LatestReviews />}
    </div>
  );
}

export default App;
