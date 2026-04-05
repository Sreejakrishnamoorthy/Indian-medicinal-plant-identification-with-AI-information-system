from openai import OpenAI
import os

# Initialize client — use your OpenAI API key here or set via environment variable
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_plant_info(plant_name: str):
    """Fetch detailed information about a medicinal plant using OpenAI GPT model."""
    prompt = f"""
    You are an expert in Indian medicinal botany and Ayurveda.

    Provide a structured and factual overview of the plant '{plant_name}' with the following detailed sections:

    🌿 **1. Botanical Overview**
    - Common names (including regional Indian names)
    - Scientific name
    - Plant family and native region
    - Description of leaves, flowers, or fruits (if relevant)

    🍽️ **2. Culinary Uses**
    - How this plant or its parts (leaf, fruit, bark, etc.) are used in Indian cuisine
    - Traditional recipes or beverages (if any)

    💊 **3. Medicinal Properties**
    - Key bioactive compounds or phytochemicals (if known)
    - Diseases or health conditions it is traditionally used for
    - Modes of preparation (decoction, paste, oil, powder, etc.)

    🧘 **4. Use in Indian Traditional Medicine**
    - How it is used in **Ayurveda**, **Siddha**, or **Unani** systems
    - Common Ayurvedic formulations or medicines containing this plant
    - Dosha balancing properties (Vata, Pitta, Kapha) if applicable

    🔬 **5. Contribution to Modern Medical Research**
    - Any modern pharmacological studies, trials, or verified health benefits
    - How modern science validates or studies this traditional use

    🌱 **6. Cultivation & Age**
    - Typical growing regions in India
    - Age or growth duration of the plant before harvesting
    - Best season for cultivation

    ⚠️ **7. Precautions and Side Effects**
    - Known contraindications or toxicity
    - Safe dosage or usage precautions

    Please ensure your answer:
    - Is factual and concise.
    - Written in easy-to-read markdown with bullet points.
    - Avoids unrelated or generic filler text.
    - Includes cultural context (how Indian households or traditional healers use it).
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",  
            messages=[
                {"role": "system", "content": "You are a knowledgeable Ayurveda and medicinal plant expert."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
        )

        result = response.choices[0].message.content
        return result

    except Exception as e:
        print("⚠️ Error:", e)
        return f"Error: {e}"
