from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI(title="AI Resume Matcher API", version="0.2.0")

# CORS (allows frontend to call backend from another port/domain)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class MatchRequest(BaseModel):
    resume_text: str = Field(..., min_length=1)
    job_description: str = Field(..., min_length=1)


def compute_match_score(resume_text: str, jd_text: str) -> int:
    vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), max_features=5000)
    tfidf = vectorizer.fit_transform([resume_text, jd_text])
    sim = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
    return int(round(sim * 100))


@app.get("/")
def home():
    return {"message": "AI Resume Matcher API running", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/match")
def match(req: MatchRequest):
    score = compute_match_score(req.resume_text, req.job_description)
    return {
        "match_score": score,
        "method": "tfidf_cosine",
        "note": "MVP scoring; will upgrade to embeddings + skill gap extraction.",
    }
