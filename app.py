import streamlit as st
from PIL import Image
from backend.detector import detect_image
import requests
import re
import os

# ---------------------- CONFIG ----------------------
st.set_page_config(page_title="AI Medicinal Plant Identifier", layout="wide")
API_URL = os.getenv("FLASK_API_URL", "http://127.0.0.1:5000/api/ai/generate")

# ---------------------- UI ----------------------
st.title("🌿 AI-Powered Indian Medicinal Plant Identification")
st.write("Upload an image of a plant leaf to identify and explore its medicinal properties.")

uploaded_file = st.file_uploader("Upload Image", type=["jpg", "jpeg", "png"])

if uploaded_file:
    image = Image.open(uploaded_file).convert("RGB")
    st.image(image, caption="Uploaded Image", width=400)

    with st.spinner("🔍 Identifying plant..."):
        detections = detect_image(image)
        top_label = detections[0]["label"] if detections else "Unknown"

    st.success(f"**Identified Plant:** {top_label}**")

    # ---------------------- CALL BACKEND ----------------------
    with st.spinner(f"🌱 Getting detailed information about {top_label}..."):
        try:
            response = requests.post(API_URL, json={"plantName": top_label})
            # print("📡 Raw API response:", response.text)

            response.raise_for_status()
            data = response.json()
            info_text = data.get("plantInfo", "").strip()
        except Exception as e:
            st.error(f"Error fetching plant info: {e}")
            st.stop()

    # ---------------------- DISPLAY INFO ----------------------
    st.markdown("### 📖 Plant Information")

    if not info_text:
        st.warning("No information available for this plant.")
    else:
        sections = re.split(r"###\s+", info_text)

        for section in sections[1:]:
            lines = section.strip().split("\n", 1)
            title = lines[0].strip(" *:")
            content = lines[1].strip() if len(lines) > 1 else "Information not available."

            with st.expander(f"📗 {title}"):
                st.markdown(content)
