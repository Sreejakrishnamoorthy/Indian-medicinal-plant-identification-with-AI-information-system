// import fetch from "node-fetch";
// import { generatePrompt } from "../utils/promptTemplate.js";

// export const generateAIResponse = async (req, res) => {
//   try {
//     const {
//       name,
//       degree,
//       specialization,
//       skills,
//       experience,
//       jobRole,
//       query,
//       chatHistory,
//     } = req.body;

//     if (
//       !name ||
//       !degree ||
//       !specialization ||
//       !skills ||
//       experience == null ||
//       !jobRole
//     ) {
//       return res.status(400).json({ error: "All fields are required" });
//     }


//     const basePrompt = generatePrompt(
//       name,
//       degree,
//       specialization,
//       skills,
//       experience,
//       jobRole
//     );

//     let historyText = "";
//     if (Array.isArray(chatHistory) && chatHistory.length > 0) {
//       historyText = chatHistory
//         .map((m) => `${m.sender === "user" ? "User" : "AI"}: ${m.text}`)
//         .join("\n");
//     }

//     const finalPrompt = `
// You are an AI Career Assistant helping ${name}. 

// Here is the user's career profile:
// ${basePrompt}

// Chat so far:
// ${historyText}

// User’s latest message: ${query || "Generate career suggestion for my profile."}

// Respond naturally and contextually, as if continuing the chat.
// `;

//     const response = await fetch("http://localhost:11434/api/generate", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         model: "deepseek-v3.1:671b-cloud",
//         prompt: finalPrompt,
//       }),
//     });

//     const rawText = await response.text();
//     console.log("🔍 Raw Ollama Response:", rawText);

//     const lines = rawText.split("\n").filter(Boolean);
//     let finalMessage = "";

//     for (const line of lines) {
//       try {
//         const jsonLine = JSON.parse(line);
//         if (jsonLine.response) finalMessage += jsonLine.response;
//       } catch {
//         console.warn("⚠️ Skipping invalid JSON line:", line);
//       }
//     }

//     if (!finalMessage.trim()) {
//       console.error("❌ No valid AI response parsed");
//       return res
//         .status(500)
//         .json({ error: "No response received from AI model" });
//     }

//     res.json({ aiResponse: finalMessage.trim() });
//   } catch (error) {
//     console.error("Ollama API error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };


import fetch from "node-fetch";

export const getPlantInfo = async (req, res) => {
  try {
    const { plantName } = req.body;

    if (!plantName) {
      return res.status(400).json({ error: "Plant name is required" });
    }

    // ------------------- PROMPT TEMPLATE -------------------
    const prompt = `
You are an expert in Indian medicinal botany and Ayurveda.

Provide a structured, factual, and well-organized overview of the plant '${plantName}' with the following detailed sections:

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

Ensure the response is:
- Accurate and concise
- Written in readable markdown with bullet points
- Includes Indian cultural and traditional usage context
    `;

    // ------------------- SEND REQUEST TO OLLAMA -------------------
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "deepseek-v3.1:671b-cloud",
        prompt,
      }),
    });

    const rawText = await response.text();
    console.log("🔍 Raw Ollama Response:", rawText);

    // ------------------- PARSE STREAMED RESPONSE -------------------
    const lines = rawText.split("\n").filter(Boolean);
    let finalMessage = "";

    for (const line of lines) {
      try {
        const jsonLine = JSON.parse(line);
        if (jsonLine.response) finalMessage += jsonLine.response;
      } catch {
        console.warn("⚠️ Skipping invalid JSON line:", line);
      }
    }

    if (!finalMessage.trim()) {
      console.error("❌ No valid AI response parsed");
      return res.status(500).json({ error: "No response received from AI model" });
    }

    // ------------------- SEND BACK STRUCTURED RESPONSE -------------------
    res.json({ plantInfo: finalMessage.trim() });

  } catch (error) {
    console.error("🌿 Ollama API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
