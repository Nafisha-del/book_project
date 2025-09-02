import React, { useState } from "react";
import Chat from "./components/Chat";
import BookList from "./components/BookList";

function App() {
  const [view, setView] = useState("chat"); // 'chat' or 'books'

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
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
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
            transition: "background-color 0.3s",
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
            transition: "background-color 0.3s",
          }}
        >
          Books List
        </button>
      </div>

      {/* Render selected view */}
      {view === "chat" && <Chat />}
      {view === "books" && <BookList />}
    </div>
  );
}

export default App;
