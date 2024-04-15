from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class WordInput(BaseModel):
    word: str

# Read the dataset
df = pd.read_excel("words.xlsx")
X = df['Word']
y = df['Category']

# Convert words to vector space using CountVectorizer
vectorizer = CountVectorizer()
X_vectorized = vectorizer.fit_transform(X)

# Train a simple Naive Bayes classifier
classifier = MultinomialNB(alpha=1.0)
classifier.fit(X_vectorized, y)

@app.post("/predict-category")
async def predict_category(input: WordInput):
    # Vectorize the input word
    word_vec = vectorizer.transform([input.word])
    # Predict the category
    category_pred = classifier.predict(word_vec)
    return {"category": category_pred[0]}
