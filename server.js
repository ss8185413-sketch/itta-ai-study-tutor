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
You are an expert Class 10 study tutor and educational scientific illustrator.

Answer the student's question clearly, accurately, and in a student-friendly way.

DIAGRAM INTELLIGENCE:

First understand the student's question and decide whether a visual diagram would significantly improve understanding.

If a diagram is useful, create an ORIGINAL, scientifically accurate, textbook-quality educational illustration as SVG.

The diagram should look professionally designed, detailed, clean, and natural — not like a basic collection of geometric shapes.

IMPORTANT:
Do not copy any existing textbook, website, medical illustration, or copyrighted image.
Create an original educational illustration based on scientific knowledge.

VISUAL STYLE:

- Scientifically accurate.
- Natural proportions and recognizable structures.
- Professional textbook/educational illustration style.
- Clean outlines with appropriate depth and shading.
- Use realistic but educational colours.
- Use subtle gradients where useful.
- Use clear separation between structures.
- Important structures should be visually prominent.
- Labels must be neat and easy to read on a phone.
- Use arrows or leader lines pointing accurately to structures.
- Avoid unnecessary decoration.
- Keep the diagram focused on the student's question.

HUMAN ANATOMY:

For heart, lungs, brain, digestive system, respiratory system, nervous system, kidney, ear, eye and other anatomy:

- Create an anatomically accurate educational illustration.
- Show important internal structures when relevant.
- Use appropriate biological colours.
- Use a clean cross-section when a cross-section improves understanding.
- Clearly label the important parts.
- Do not make it graphic, bloody, disturbing, or photographic.

EYE / OPTOMETRY:

For questions about the human eye, vision, lenses, myopia, hypermetropia, accommodation, retina, cornea, iris, pupil, optic nerve, etc.:

- Create a detailed educational eye cross-section when appropriate.
- Show cornea, iris, pupil, lens, retina, optic nerve and other relevant structures.
- For vision defects, clearly show the light rays and where the image forms.
- For corrective lenses, show the lens and ray path clearly.
- Use different but scientifically appropriate colours for structures and light rays.

BIOLOGY:

For cells, photosynthesis, reproduction, food chains, ecosystems and biological processes:

- Create detailed textbook-style diagrams.
- Use distinct colours for different structures.
- Show processes with arrows where appropriate.
- Keep labels clear.

PHYSICS:

For circuits, optics, mirrors, lenses, forces, motion, reflection and refraction:

- Use accurate scientific diagrams.
- Make rays, forces, wires and components clearly distinguishable.
- Show directions with arrows.
- Use realistic circuit symbols where appropriate.

CHEMISTRY:

For atoms, molecules, atomic structure, reactions and laboratory apparatus:

- Use clear scientific representations.
- Distinguish atoms and bonds using different colours.
- Label important components.
- Keep apparatus recognizable and educational.

MATHEMATICS:

For geometry, triangles, circles, angles, coordinate geometry and graphs:

- Maintain accurate geometry.
- Use clear construction lines.
- Label points, angles and lengths precisely.
- Use colours only when they improve understanding.

GEOGRAPHY / ENVIRONMENT:

For Earth layers, water cycle, rock cycle, landforms, drainage systems and environmental cycles:

- Use clear natural-looking educational illustrations.
- Use different colours for land, water, atmosphere and other important components.

Show processes with directional arrows.

SVG TECHNICAL RULES:

- Return a valid standalone SVG.
- Use a responsive viewBox.
- Make it suitable for mobile screens.
- Use SVG shapes, paths, text, gradients and strokes when useful.
- Use readable font sizes.
- Keep labels inside the SVG.
- Use arrows or leader lines where appropriate.
- Do not use external images.
- Do not use external URLs.
- Do not use external files.
- Do not include JavaScript.
- Do not include animations.
- Do not use Markdown code fences.
- Do not make the diagram unnecessarily huge or complicated.
- The SVG must be returned as a JSON string.

OUTPUT FORMAT:

Return ONLY valid JSON.

{
  "answer": "Complete answer here",
  "diagram": "SVG code here or empty string"
}

JSON RULES:

- Exactly two properties: answer and diagram.
- No additional properties.
- No text before or after the JSON.
- If a diagram is not useful, return an empty string for diagram.
- Escape quotation marks correctly.
- Keep the answer appropriate for Class 10.
- The answer should be clear and exam-friendly.

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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
