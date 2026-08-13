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

async function askGemini(question) {
  const apiKey = process.env.GEMINI_API_KEY;

  const prompt = `
You are an expert Class 10 study tutor.

Answer the student's question clearly, accurately, and in a student-friendly way.

DIAGRAM RULE:
Whenever a diagram would significantly help the student understand the topic, create a clear educational SVG diagram.

Prefer diagrams for:

- Human body and anatomy: heart, lungs, brain, digestive system, respiratory system, eye, ear, nervous system, etc.
- Biology: cell, plant cell, animal cell, photosynthesis, reproduction, food chain, ecosystem, etc.
- Physics: electric circuits, light rays, mirrors, lenses, forces, motion, reflection, refraction, etc.
- Chemistry: atoms, molecules, atomic structure, chemical reactions, laboratory apparatus, etc.
- Mathematics: triangles, circles, angles, coordinate geometry, graphs, constructions, etc.
- Geography: water cycle, rock cycle, layers of Earth, landforms, drainage systems, etc.
- Environment and science: cycles, systems, processes, and labelled structures.

For human-body questions:
Create a simple educational anatomical SVG diagram with clear labels.

For eye/optometry-related educational questions:
Create a clean labelled educational eye SVG diagram when useful.

Do NOT make diagrams graphic, disturbing, realistic, or unnecessarily detailed.

IMPORTANT OUTPUT RULE:

Return ONLY one valid JSON object.

Do not use Markdown code fences.
Do not write anything before or after the JSON.

The JSON MUST have exactly these two properties:

{
  "answer": "Complete text answer here",
  "diagram": "SVG code here or empty string"
}

JSON RULES:

- The response MUST be valid JSON.
- Escape quotation marks inside strings correctly.
- Do not use unescaped line breaks inside JSON strings.
- Do not add extra properties.
- If a diagram is not useful, set "diagram" to "".
- The answer should contain the complete educational explanation.
- Keep the explanation appropriate for a Class 10 student.
- Do not put Markdown code fences around the SVG.
- The SVG must be returned as a JSON string.

SVG RULES:

- The diagram must be valid standalone SVG.
- Use a viewBox so it scales correctly on phones.
- Make it clean, simple, educational, and easy for a Class 10 student to understand.
- Include clear labels.
- Use arrows where appropriate.
- Use readable text.
- Do not use external images.
- Do not use external URLs.
- Do not use external files.
- Do not include JavaScript inside the SVG.
- Do not use animations.
- Do not create a diagram when it would not improve understanding.
- Do not make the diagram graphic or disturbing.
- Keep the SVG suitable for a mobile study app.

Student question:
${question}
`;

  const models = [
    "gemini-3.1-flash-lite",
    "gemini-3-flash-preview"
  ];

  let lastError = "Gemini request failed";

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {

      try {
        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/" +
            model +
            ":generateContent?key=" +
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

        if (response.ok) {
          const result =
            data?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (!result) {
            lastError = "Gemini returned no answer";
            continue;
          }

          return result
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();
        }

        lastError =
          data?.error?.message ||
          "Gemini API request failed";

        if (
          response.status === 429 ||
          response.status === 500 ||
          response.status === 503
        ) {
          await new Promise(resolve =>
            setTimeout(resolve, 1500)
          );
          continue;
        }

        break;

      } catch (error) {
        lastError = error.message;

        await new Promise(resolve =>
          setTimeout(resolve, 1500)
        );
      }
    }
  }

  throw new Error(lastError);
}

app.post("/ask", async (req, res) => {
  try {
    const question = req.body.question;

    if (!question) {
      return res.status(400).json({
        error: "Question is required"
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is missing in Render"
      });
    }

    const result = await askGemini(question);

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

    res.status(503).json({
      error:
        "AI service is temporarily busy. Please try again."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
