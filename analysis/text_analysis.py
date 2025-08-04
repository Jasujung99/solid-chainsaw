"""Text analysis utilities using spaCy and NLTK."""
from __future__ import annotations

from typing import Dict, Any

import nltk
import spacy
from nltk.sentiment import SentimentIntensityAnalyzer

# Ensure required datasets
nltk.download("punkt", quiet=True)
nltk.download("vader_lexicon", quiet=True)

try:
    NLP = spacy.load("en_core_web_sm")
except Exception:  # pragma: no cover - model may be missing
    NLP = spacy.blank("en")
    if not NLP.has_pipe("sentencizer"):
        NLP.add_pipe("sentencizer")


def _lexical_diversity(text: str) -> float:
    doc = NLP(text)
    tokens = [t.text.lower() for t in doc if t.is_alpha]
    return len(set(tokens)) / len(tokens) if tokens else 0.0


def _sentiment(text: str) -> Dict[str, float]:
    sia = SentimentIntensityAnalyzer()
    return sia.polarity_scores(text)


def _style(text: str) -> Dict[str, Any]:
    doc = NLP(text)
    lengths = [len(list(sent)) for sent in doc.sents]
    avg_length = sum(lengths) / len(lengths) if lengths else 0.0
    return {"avg_sentence_length": avg_length}


def analyze_text(text: str) -> Dict[str, Any]:
    """Perform text analysis returning a JSON-serialisable dict."""
    return {
        "lexical_diversity": _lexical_diversity(text),
        "sentiment": _sentiment(text),
        "style": _style(text),
    }
