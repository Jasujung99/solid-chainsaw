"""Image analysis utilities using OpenCV and CLIP."""
from __future__ import annotations

from typing import Dict, Any, List, Optional

import cv2
import numpy as np

try:  # pragma: no cover - optional dependency
    import open_clip
    import torch
    from PIL import Image
except Exception:  # pragma: no cover
    open_clip = None
    torch = None
    Image = None


def _color_palette(image: np.ndarray, k: int = 5) -> List[List[int]]:
    data = image.reshape((-1, 3)).astype(np.float32)
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, 0.2)
    _, labels, centers = cv2.kmeans(data, k, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
    centers = centers.astype(int)
    return centers.tolist()


def _layout(image: np.ndarray) -> Dict[str, Any]:
    h, w = image.shape[:2]
    return {
        "width": int(w),
        "height": int(h),
        "aspect_ratio": float(w / h) if h else None,
    }


def _clip_embedding(image: np.ndarray) -> Optional[List[float]]:
    if not open_clip or not torch or not Image:
        return None
    try:
        device = "cuda" if torch.cuda.is_available() else "cpu"
        model, preprocess = open_clip.create_model_from_pretrained("ViT-B-32", device=device)
        img = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        pil_img = Image.fromarray(img)
        tensor = preprocess(pil_img).unsqueeze(0).to(device)
        with torch.no_grad():
            emb = model.encode_image(tensor).cpu().numpy()[0]
        return emb.astype(float).tolist()
    except Exception:
        return None


def analyze_image(image: np.ndarray) -> Dict[str, Any]:
    """Analyze an image loaded as a NumPy array."""
    return {
        "color_palette": _color_palette(image),
        "layout": _layout(image),
        "clip_embedding": _clip_embedding(image),
    }
