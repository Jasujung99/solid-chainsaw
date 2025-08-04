"""FastAPI microservice exposing multimodal analysis endpoints."""
from __future__ import annotations

import tempfile
from typing import Optional

import cv2
import numpy as np
from fastapi import FastAPI, UploadFile, File

from . import audio_analysis, image_analysis, text_analysis
from .schema import AnalysisResult

app = FastAPI(title="Analysis Service")


def analyze(
    text: Optional[str] = None,
    image: Optional[np.ndarray] = None,
    audio_path: Optional[str] = None,
) -> AnalysisResult:
    result = AnalysisResult()
    if text is not None:
        result.text = text_analysis.analyze_text(text)
    if image is not None:
        result.image = image_analysis.analyze_image(image)
    if audio_path is not None:
        result.audio = audio_analysis.analyze_audio(audio_path)
    return result


@app.post("/analyze", response_model=AnalysisResult)
async def analyze_endpoint(
    text: Optional[str] = None,
    image: UploadFile | None = File(default=None),
    audio: UploadFile | None = File(default=None),
) -> AnalysisResult:
    np_image = None
    audio_path = None

    if image is not None:
        data = await image.read()
        np_image = cv2.imdecode(np.frombuffer(data, np.uint8), cv2.IMREAD_COLOR)

    if audio is not None:
        data = await audio.read()
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            tmp.write(data)
            audio_path = tmp.name

    return analyze(text=text, image=np_image, audio_path=audio_path)
