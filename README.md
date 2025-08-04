# solid-chainsaw

This repository provides a Python microservice for multimodal analysis of text, images, and audio files. The `analysis` package exposes a FastAPI application capable of:

* **Text**: lexical diversity, sentiment tone, and style metrics using spaCy and NLTK.
* **Images**: color palette, layout, and CLIP embeddings via OpenCV and OpenCLIP.
* **Audio**: melody, rhythm, and timbre features extracted with librosa.

Install dependencies and start the service:

```bash
pip install -r requirements.txt
uvicorn analysis.service:app --reload
```

Send requests to `/analyze` with any combination of `text`, `image`, or `audio` payloads to receive a unified `analysis_result` schema.
