# server/chatbot.py

from fastapi import HTTPException
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# Load TinyLlama 1.1B Chat
MODEL_NAME = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"

try:
    # Load tokenizer and model
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME,
        torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
        device_map="auto"
    )
except Exception as e:
    raise RuntimeError(f"Failed to load TinyLlama model: {e}")


def chat_with_user(prompt: str, max_new_tokens: int = 200) -> str:
    """
    Chat with the TinyLlama model using the chat template.

    Args:
        prompt (str): User input
        max_new_tokens (int): Max tokens to generate

    Returns:
        str: Model response
    """
    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")

    try:
        messages = [{"role": "user", "content": prompt}]
        # Apply TinyLlama chat template
        inputs = tokenizer.apply_chat_template(
            messages,
            add_generation_prompt=True,
            tokenize=True,
            return_dict=True,
            return_tensors="pt"
        ).to(model.device)

        # Generate response
        outputs = model.generate(**inputs, max_new_tokens=max_new_tokens)

        # Decode only the generated text (excluding the prompt)
        response = tokenizer.decode(
            outputs[0][inputs["input_ids"].shape[-1]:],
            skip_special_tokens=True
        )
        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM generation failed: {e}")