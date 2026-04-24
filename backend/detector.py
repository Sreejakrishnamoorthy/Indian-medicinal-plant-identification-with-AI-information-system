from transformers import pipeline
from PIL import Image

detector = pipeline(
    "image-classification",
    model="dima806/medicinal_plants_image_detection"
)

def detect_image(image):
    results = detector(image)
    return [{"label": r["label"], "score": round(float(r["score"]), 4)} for r in results]
