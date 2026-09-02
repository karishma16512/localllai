import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Server-side Gemini initialization (lazy / guarded)
  let aiClient: GoogleGenAI | null = null;
  function getAI(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return aiClient;
  }

  // API Health
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      app: "GramBiz AI",
      sihPrototype: true,
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
    });
  });

  // AI-Powered Deep Feasibility Analysis endpoint
  app.post("/api/analyze", async (req, res) => {
    try {
      const { location, businessType, marginCapital, projectCost, loanScheme, financialMode } = req.body;
      const ai = getAI();

      if (!ai) {
        return res.json({
          success: false,
          message: "No GEMINI_API_KEY present, fallback to local heuristics engine",
        });
      }

      const businessLabels: Record<string, string> = {
        dairy: 'Dairy Farming & Local Milk Value Addition',
        grocery: 'Grocery & Rural Kirana Retail Store',
        tailoring: 'Tailoring, Garment Stitching & Textiles Boutique',
        poultry: 'Poultry & Country Bird (Natukodi) Farming',
        food_processing: 'Agri-Food Processing (Cold-pressed oil, snacks, pickles)',
        other: 'Rural Micro-Enterprise & Commercial Services',
      };

      const prompt = `You are a Senior Rural Livelihoods & Micro-Enterprise Feasibility Specialist evaluating a business proposal for a Smart India Hackathon rural micro-loan prototype.
Location: ${location?.name || "Rural Village"}, Block: ${location?.block || "Local Block"}, District: ${location?.district || "Local"}, State: ${location?.state || "India"}
Business Category: ${businessLabels[businessType] || businessType}
Beneficiary Available Margin Capital: ₹${marginCapital || Math.round(projectCost * 0.10)}
Total Project Cost: ₹${projectCost}
Financial Input Basis: ${financialMode === 'project_cost' ? 'Estimated Project Cost Outlay' : 'Available Margin Capital'}
Government Concessional Loan Scheme: ${loanScheme}

Provide a concise, practical analysis formatted as strict JSON with:
1. "verdict": "Highly Feasible" | "Conditionally Feasible" | "High Risk / Caution"
2. "executiveSummary": A 2-sentence direct verdict for the rural entrepreneur.
3. "keyActionPoints": Array of 3 specific operational action steps.
4. "riskAlerts": Array of 2 local risks to watch out for.
5. "bankOfficerNotes": A note addressed to the Rural Bank Loan Officer assessing repayment safety.

Respond strictly in valid JSON without markdown wrapping.`;

      const candidateModels = ["gemini-2.5-flash", "gemini-3.1-flash-lite", "gemini-3.7-flash"];
      let parsed = null;
      let lastError: any = null;

      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              responseMimeType: "application/json",
            },
          });

          if (response.text) {
            parsed = JSON.parse(response.text);
            break;
          }
        } catch (modelErr: any) {
          lastError = modelErr;
          console.warn(`Model ${modelName} unavailable (${modelErr?.status || modelErr?.message}), trying fallback...`);
        }
      }

      if (parsed) {
        return res.json({
          success: true,
          data: parsed,
        });
      }

      // If all external AI models are temporarily experiencing high demand, return graceful fallback
      res.json({
        success: false,
        message: "AI service temporarily experiencing high demand. Local engine active.",
      });
    } catch (error: any) {
      console.warn("AI Analysis Note:", error?.message || error);
      res.json({
        success: false,
        message: "Local heuristics active",
      });
    }
  });

  // Vite middleware in development vs Static serving in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GramBiz AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
