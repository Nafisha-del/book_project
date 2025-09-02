import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function Chat() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!prompt) return;

    const userMessage = { role: "user", content: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/chat/", {
        prompt,
        max_tokens: 200,
      });

      const botMessage = { role: "bot", content: response.data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      const errorMsg = { role: "bot", content: "Error: Failed to get response." };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "30px auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#4A90E2" }}>Book Discussion AI</h1>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "16px",
          height: "500px",
          overflowY: "auto",
          backgroundColor: "#f9f9f9",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          marginBottom: "16px",
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "10px 14px",
                borderRadius: "20px",
                backgroundColor: msg.role === "user" ? "#4A90E2" : "#E0E0E0",
                color: msg.role === "user" ? "#fff" : "#000",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: "24px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "16px",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "12px 24px",
            borderRadius: "24px",
            border: "none",
            backgroundColor: "#4A90E2",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
