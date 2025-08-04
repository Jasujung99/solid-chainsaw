"""Audio analysis utilities using librosa."""
from __future__ import annotations

from typing import Dict, Any

import librosa
import numpy as np


def analyze_audio(path: str) -> Dict[str, Any]:
    """Extract melody, rhythm and timbre features from an audio file."""
    y, sr = librosa.load(path)

    # Melody: dominant pitch
    pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
    index = magnitudes.argmax()
    pitch = float(pitches.flatten()[index]) if magnitudes.any() else 0.0

    # Rhythm: tempo estimation
    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)

    # Timbre: spectral centroid and zero-crossing rate
    spectral_centroid = float(librosa.feature.spectral_centroid(y=y, sr=sr).mean())
    zcr = float(librosa.feature.zero_crossing_rate(y).mean())

    return {
        "melody": {"pitch": pitch},
        "rhythm": {"tempo": float(tempo)},
        "timbre": {"spectral_centroid": spectral_centroid, "zero_crossing_rate": zcr},
    }
