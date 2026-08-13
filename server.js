const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/ask", async (req, res) => {
  try {
    const question = req.body.question;

    if (!question) {
      return res.status(400).json({
        error: "Question is required"
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is missing in Render"
      });
    }

    const prompt = `
You are an expert Class 10 study tutor.

Answer the student's question clearly and accurately.

IMPORTANT:
If the question can be explained better with a diagram, create a simple educational SVG diagram.

Return ONLY valid JSON in exactly this format:

{
  "answer": "Your complete text answer here",
  "diagram": "SVG code here or empty string if no diagram is useful"
}

Rules:
- The answer must be plain text.
- If a diagram is useful, diagram must be valid standalone SVG.
- Keep diagrams simple, clean and educational.
- Use labels inside the SVG.
- Do NOT use external images, URLs or external files.
- If a diagram is not useful, return an empty string for diagram.
- Do not put Markdown code fences around the SVG.
- Do not add any text outside the JSON.

Student question:
${question}
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=" +
        apiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", data);

      return res.status(response.status).json({
        error: data?.error?.message || "Gemini API request failed"
      });
    }

    let result =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!result) {
      return res.status(500).json({
        error: "Gemini did not return an answer"
      });
    }

    result = result
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(result);
    } catch (error) {
      console.error("JSON Parse Error:", result);

      return res.status(500).json({
        error: "AI returned an invalid response"
      });
    }

    res.json({
      answer: parsed.answer || "No answer received.",
      diagram: parsed.diagram || ""
    });

  } catch (error) {
    console.error("Server Error:", error);

    res.status(500).json({
      error: "Something went wrong: " + error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
