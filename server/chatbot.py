# server/chatbot.py
from fastapi import HTTPException
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
from .recommender import recommend_books

# Load TinyLlama 1.1B Chat (lightweight for faster inference)
MODEL_NAME = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"

try:
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForCausalLM.from_pretrained(MODEL_NAME, torch_dtype="auto")
except Exception as e:
    raise RuntimeError(f"Failed to load TinyLlama model: {e}")

# Keywords to detect recommendation intent
RECOMMEND_KEYWORDS = ["recommend", "suggest", "book for me", "find a book", "what should I read"]

def is_recommendation_intent(prompt: str) -> bool:
    prompt_lower = prompt.lower()
    return any(keyword in prompt_lower for keyword in RECOMMEND_KEYWORDS)

def chat_with_user(prompt: str, max_new_tokens: int = 200):
    """
    Chat with TinyLlama or call FAISS recommender based on user intent.
    """
    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")

    # --- Check for book recommendation intent ---
    if is_recommendation_intent(prompt):
        try:
            recs = recommend_books(prompt, top_k=5)
            response_lines = [
                f"{i+1}. {book['title']} by {book['author']} ({book['category']})"
                for i, book in enumerate(recs)
            ]
            return "\n".join(response_lines)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Recommender failed: {e}")

    # --- Otherwise, use TinyLlama ---
    try:
        messages = [{"role": "user", "content": prompt}]
        inputs = tokenizer.apply_chat_template(
            messages,
            add_generation_prompt=True,
            tokenize=True,
            return_dict=True,
            return_tensors="pt",
        ).to(model.device)

        # Generate response
        outputs = model.generate(**inputs, max_new_tokens=max_new_tokens)
        response = tokenizer.decode(
            outputs[0][inputs["input_ids"].shape[-1]:],
            skip_special_tokens=True
        )
        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM generation failed: {e}")
