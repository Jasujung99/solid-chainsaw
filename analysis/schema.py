"""Pydantic models for analysis results."""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel


class TextAnalysis(BaseModel):
    lexical_diversity: float
    sentiment: Dict[str, float]
    style: Dict[str, Any]


class ImageAnalysis(BaseModel):
    color_palette: List[List[int]]
    layout: Dict[str, Any]
    clip_embedding: Optional[List[float]]


class AudioAnalysis(BaseModel):
    melody: Dict[str, float]
    rhythm: Dict[str, float]
    timbre: Dict[str, float]


class AnalysisResult(BaseModel):
    text: Optional[TextAnalysis] = None
    image: Optional[ImageAnalysis] = None
    audio: Optional[AudioAnalysis] = None
