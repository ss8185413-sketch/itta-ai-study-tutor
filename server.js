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

Answer the student's question clearly and accurately.

If a diagram would help explain the answer, create a simple educational SVG diagram.

Return ONLY valid JSON:

{
  "answer": "complete answer",
  "diagram": "SVG code or empty string"
}

Rules:
- Answer must be plain text.
- Diagram must be valid standalone SVG.
- Keep diagrams simple and educational.
- Use labels inside the SVG.
- No external images or URLs.
- If no diagram is useful, return an empty string.
- No Markdown code fences.
- No text outside the JSON.

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

        // Retry temporary server/capacity errors
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
