import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality } from "@google/genai";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable trust proxy for reverse proxies (NGINX, Cloud Run, Cloudflare)
app.set("trust proxy", 1);

// Rate limiting for /api/* routes (60 requests/min per IP)
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 requests per minute
  standardHeaders: true, // Draft-6 RateLimit-* headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  validate: {
    trustProxy: false,
    xForwardedForHeader: false,
  },
  message: {
    error: "Muitas requisições. Por favor, aguarde um minuto antes de tentar novamente.",
  },
});

// Configure CORS restricted to the app domain and development origins
const allowedOrigins = [
  process.env.APP_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. same-origin, curl, mobile web views)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (process.env.APP_URL) {
        try {
          const appHost = new URL(process.env.APP_URL).host;
          const originHost = new URL(origin).host;
          if (appHost === originHost) {
            return callback(null, true);
          }
        } catch (_) {}
      }

      // Allow Cloud Run, Google AI Studio preview iframes, and local development domains
      if (
        process.env.NODE_ENV !== "production" ||
        origin.endsWith(".run.app") ||
        origin.includes("google") ||
        origin.includes("localhost") ||
        origin.includes("127.0.0.1")
      ) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
  })
);

// Apply rate limiting to all /api routes
app.use("/api", apiLimiter);

// Increase JSON body limit to support base64 image and video payloads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Helper for lazy GenAI client initialization
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Gym Companion API" });
});

/**
 * /api/generate-music
 * Generates AI workout music tracks for Element Gyms workouts using Lyria
 */
app.post("/api/generate-music", async (req, res) => {
  try {
    const { genre, intensity, prompt, trackLength } = req.body;
    const client = getAIClient();

    const selectedGenre = genre || "Phonk Cyberpunk";
    const selectedIntensity = intensity || "Alta";
    const userPrompt = prompt || "Música pesada e motivadora para treino de musculação no ginásio Element Gyms";
    const modelName = trackLength === "full" ? "lyria-3-pro-preview" : "lyria-3-clip-preview";

    if (client) {
      try {
        const fullPrompt = `Generate a high-energy workout track for Element Gyms workout session. Genre: ${selectedGenre}. Intensity: ${selectedIntensity}. Style prompt: ${userPrompt}. Include driving rhythm and motivating beat.`;
        
        const response = await client.models.generateContentStream({
          model: modelName,
          contents: fullPrompt,
          config: {
            responseModalities: [Modality.AUDIO],
          },
        });

        let audioBase64 = "";
        let lyrics = "";
        let mimeType = "audio/wav";

        for await (const chunk of response) {
          const parts = chunk.candidates?.[0]?.content?.parts;
          if (!parts) continue;

          for (const part of parts) {
            if (part.inlineData?.data) {
              if (!audioBase64 && part.inlineData.mimeType) {
                mimeType = part.inlineData.mimeType;
              }
              audioBase64 += part.inlineData.data;
            }
            if (part.text && !lyrics) {
              lyrics = part.text;
            }
          }
        }

        if (audioBase64) {
          return res.json({
            success: true,
            audioUrl: `data:${mimeType};base64,${audioBase64}`,
            title: `Element Gyms AI: ${selectedGenre}`,
            artist: `AI Lyria Workout Studio (${selectedIntensity})`,
            lyrics: lyrics || "🔥 Ritmo de alta intensidade para máxima hipertrofia!",
            genre: selectedGenre,
          });
        }
      } catch (err: any) {
        console.warn("Lyria music generation fallback:", err?.message || err);
      }
    }

    // Fallback response with synthesized audio metadata
    return res.json({
      success: true,
      audioUrl: null, // Client audio synth will render high octane energy pulse
      isSynthFallback: true,
      title: `Element Gyms AI: ${selectedGenre}`,
      artist: `AI Workout Beat (${selectedIntensity})`,
      lyrics: `🔥 Treino Element Gyms - ${selectedGenre} [${selectedIntensity}]. Mantenha a cadência e foco na falha muscular!`,
      genre: selectedGenre,
    });
  } catch (error: any) {
    console.error("Music Generation Error:", error);
    res.status(500).json({ error: "Falha ao gerar música de treino" });
  }
});

/**
 * /api/generate-exercise-image
 * Creates 2D/3D muscle & equipment illustrations using gemini-3.1-flash-image
 */
app.post("/api/generate-exercise-image", async (req, res) => {
  try {
    const { prompt, exerciseName, muscleGroup, aspect } = req.body;
    const client = getAIClient();

    if (!client) {
      return res.status(400).json({
        error: "GEMINI_API_KEY necessária para geração de imagens com IA.",
      });
    }

    const fullPrompt = `High quality professional gym illustration for exercise '${exerciseName}' targeting '${muscleGroup}'. ${prompt}. Modern fitness studio aesthetic, hyper-realistic, anatomical precision, crisp lighting.`;

    const interaction = await client.interactions.create({
      model: "gemini-3.1-flash-image",
      input: fullPrompt,
      response_modalities: ["image", "text"],
      generation_config: {
        image_config: {
          aspect_ratio: aspect || "1:1",
          image_size: "1K",
        },
      },
    });

    let imageUrl = null;
    for (const step of interaction.steps) {
      if (step.type === "model_output") {
        const imageContent = step.content?.find((c) => c.type === "image");
        if (imageContent && imageContent.data) {
          const mimeType = imageContent.mime_type || "image/png";
          imageUrl = `data:${mimeType};base64,${imageContent.data}`;
          break;
        }
      }
    }

    if (imageUrl) {
      return res.json({ success: true, imageUrl });
    } else {
      return res.status(500).json({ error: "Nenhuma imagem gerada pela IA." });
    }
  } catch (error: any) {
    console.error("Generate Exercise Image Error:", error);
    res.status(500).json({ error: error?.message || "Falha ao gerar imagem do exercício" });
  }
});

/**
 * Helper function to parse or fetch an image input (Data URL, HTTP/HTTPS URL, or raw base64)
 */
async function parseOrFetchImageBase64(imageInput?: string | null): Promise<{ cleanBase64: string; mimeType: string } | null> {
  if (!imageInput || typeof imageInput !== "string") {
    return null;
  }

  const trimmed = imageInput.trim();
  if (!trimmed) return null;

  // 1. Data URL format: "data:image/png;base64,iVBORw0KG..."
  if (trimmed.startsWith("data:") && trimmed.includes(";base64,")) {
    const parts = trimmed.split(";base64,");
    const mimeType = parts[0].replace("data:", "").trim() || "image/png";
    const cleanBase64 = parts[1].trim().replace(/[\r\n\s]/g, "");
    if (!cleanBase64) return null;
    return { cleanBase64, mimeType };
  }

  // 2. HTTP / HTTPS URL format: "https://images.unsplash.com/..."
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const fetchRes = await fetch(trimmed, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      if (!fetchRes.ok) {
        throw new Error(`HTTP error ${fetchRes.status}`);
      }
      const contentType = fetchRes.headers.get("content-type") || "image/png";
      const arrayBuf = await fetchRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuf);
      const cleanBase64 = buffer.toString("base64");
      const mimeType = contentType.split(";")[0].trim() || "image/png";
      return { cleanBase64, mimeType };
    } catch (err) {
      console.warn("Failed to fetch image from URL for base64 conversion:", trimmed, err);
      return null;
    }
  }

  // 3. Raw Base64 string without data: prefix
  const cleanBase64 = trimmed.replace(/[\r\n\s]/g, "");
  if (!cleanBase64 || cleanBase64.length < 8) return null;
  return { cleanBase64, mimeType: "image/png" };
}

/**
 * /api/edit-exercise-image
 * Edits exercise images, muscle highlights, and machine settings using gemini-3.1-flash-image
 */
app.post("/api/edit-exercise-image", async (req, res) => {
  try {
    const { base64Image, editPrompt } = req.body;
    const client = getAIClient();

    if (!client) {
      return res.status(400).json({
        error: "GEMINI_API_KEY necessária para edição de imagem com IA.",
      });
    }

    if (!base64Image || !editPrompt) {
      return res.status(400).json({ error: "base64Image e editPrompt são obrigatórios." });
    }

    const imageData = await parseOrFetchImageBase64(base64Image);
    if (!imageData) {
      return res.status(400).json({ error: "A imagem fornecida é inválida ou não pôde ser carregada para edição." });
    }

    const interaction = await client.interactions.create({
      model: "gemini-3.1-flash-image",
      input: [
        {
          type: "image",
          data: imageData.cleanBase64,
          mime_type: imageData.mimeType,
        },
        {
          type: "text",
          text: `Edit this gym exercise image according to instruction: ${editPrompt}. Maintain anatomical posture accuracy and clear visual highlighting for gym equipment or muscle group adjustments.`,
        },
      ],
      response_modalities: ["image", "text"],
    });

    let editedImageUrl = null;
    for (const step of interaction.steps) {
      if (step.type === "model_output") {
        const imageContent = step.content?.find((c) => c.type === "image");
        if (imageContent && imageContent.data) {
          const outMime = imageContent.mime_type || "image/png";
          editedImageUrl = `data:${outMime};base64,${imageContent.data}`;
          break;
        }
      }
    }

    if (editedImageUrl) {
      return res.json({ success: true, editedImageUrl });
    } else {
      return res.status(500).json({ error: "Nenhuma imagem editada retornada pela IA." });
    }
  } catch (error: any) {
    console.error("Edit Exercise Image Error:", error);
    res.status(500).json({ error: error?.message || "Falha ao editar imagem do exercício" });
  }
});

/**
 * /api/animate-exercise-video
 * Animates static exercise photos into movement videos using gemini-omni-flash-preview
 */
app.post("/api/animate-exercise-video", async (req, res) => {
  try {
    const { base64Image, motionPrompt, aspectRatio } = req.body;
    const client = getAIClient();

    if (!client) {
      return res.status(400).json({
        error: "GEMINI_API_KEY necessária para geração de vídeos generativos com IA.",
      });
    }

    const imageData = await parseOrFetchImageBase64(base64Image);

    const inputParts: any[] = [];
    if (imageData) {
      inputParts.push({
        type: "image",
        mime_type: imageData.mimeType,
        data: imageData.cleanBase64,
      });
    }

    inputParts.push({
      type: "text",
      text: motionPrompt || "Animate this exercise image demonstrating proper form, continuous movement loop, and biomechanical precision in a professional gym environment.",
    });

    const interaction = await client.interactions.create(
      {
        model: "gemini-omni-flash-preview",
        input: inputParts,
        background: false,
        store: false,
        stream: false,
        response_format: {
          type: "video",
          aspect_ratio: aspectRatio === "9:16" ? "9:16" : "16:9",
        },
      },
      { timeout: 300000 }
    );

    const videoPart = interaction.output_video;
    if (videoPart && videoPart.data) {
      const outMime = videoPart.mime_type || "video/mp4";
      const videoUrl = `data:${outMime};base64,${videoPart.data}`;
      return res.json({ success: true, videoUrl });
    } else {
      return res.status(500).json({ error: "Nenhum vídeo gerado pela IA." });
    }
  } catch (error: any) {
    console.error("Animate Exercise Video Error:", error);
    res.status(500).json({ error: error?.message || "Falha ao gerar animação de vídeo" });
  }
});

/**
 * /api/ai-coach
 * Handles intelligent workout adaptation, weight suggestions, and recovery advice via OpenRouter
 */
app.post("/api/ai-coach", async (req, res) => {
  try {
    const { message, feedbackType, currentWorkout, userStats, recentFeedback } = req.body;
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;

    const systemInstruction = `
Você é o AI Coach do Gym Companion v1.0, o companheiro de academia mais ágil e inteligente do mercado.
Sua missão é dar respostas diretas, motivadoras, altamente científicas sobre musculação e biomecânica, e sugerir adaptações práticas EM TEMPO REAL.
Nunca escreva textos longos demais. Use marcadores claros e sugestões diretas de ajuste de carga, séries, descanso ou substituição de exercício.

Regras específicas:
- Se o usuário reportou "Dormi mal" ou "Cansado": Recomende diminuir 10% da carga nos exercícios compostos ou aumentar descanso para 120s.
- Se reportou "Dor no ombro": Sugira imediatamente evitar ou substituir exercícios que forcem a articulação glenoide (ex: trocar Elevação Lateral por Elevação com Halter no Plano Escapular com carga leve ou pular supino inclinado).
- Se reportou "Academia muito cheia": Recomende agrupar exercícios com halteres ou usar máquinas biarticuladas/polias versáteis.
- Se disse que fez mais repetições ou achou muito fácil: Sugira aumento automático de 2.5 kg em membros superiores e 5 kg em membros inferiores no próximo treino.
    `.trim();

    const prompt = `
Contexto do Usuário:
- Treino atual: ${currentWorkout ? currentWorkout.name : "Nenhum ativo no momento"}
- Sequência atual (Streak): ${userStats?.streak || 0} dias
- Histórico de feedback recente: ${JSON.stringify(recentFeedback || [])}
- Tipo de Feedback ou Mensagem do usuário: "${feedbackType || ""}" — "${message || ""}"

Forneça uma análise prática de treinador (máximo 150 palavras) com 1 recomendação clara de ação no treino e 1 dica de progressão/recuperação.
    `.trim();

    if (openRouterApiKey) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openRouterApiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.APP_URL || "https://gym-companion.app",
            "X-Title": "Gym Companion AI Coach",
          },
          body: JSON.stringify({
            model: "anthropic/claude-sonnet-4-5",
            messages: [
              { role: "system", content: systemInstruction },
              { role: "user", content: prompt },
            ],
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const data: any = await response.json();
          const replyContent = data.choices?.[0]?.message?.content;
          if (replyContent) {
            return res.json({
              source: "openrouter",
              reply: replyContent,
            });
          }
        }
      } catch (_) {
        // Silently continue to next tier
      }
    }

    // Tier 2: Google GenAI (Gemini) fallback if OpenRouter is unconfigured, expired, or failed
    const ai = getAIClient();
    if (ai) {
      try {
        const geminiResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `${systemInstruction}\n\n${prompt}`,
        });

        const geminiText = geminiResponse.text?.trim();
        if (geminiText) {
          return res.json({
            source: "gemini",
            reply: geminiText,
          });
        }
      } catch (_) {
        // Fall through to heuristic fallback
      }
    }

    // Tier 3: Heuristic AI Coach biomechanics fallback if external AI APIs are not responding
    let reply = "";
    const msgLower = (message || "").toLowerCase();
    const fbLower = (feedbackType || "").toLowerCase();

    if (fbLower.includes("ombro") || msgLower.includes("ombro") || msgLower.includes("dor")) {
      reply = "⚠️ **Alerta de Proteção Articular:** Notei seu relato de dor no ombro. Recomendo **substituir ou pular** exercícios com rotação externa pesada (como Elevação Lateral com rotação ou Supino Inclinado largo). Dê preferência ao plano escapular com 50% da carga habitual ou foque no cárdio/pernas hoje.";
    } else if (fbLower.includes("dormi mal") || msgLower.includes("sono") || msgLower.includes("cansado") || fbLower.includes("cansado")) {
      reply = "💤 **Ajuste de Intensidade (Recuperação):** Com sono prejudicado ou fadiga central, o risco de lesão em séries até a falha aumenta. **Reduzimos sua carga recomendada em -10%** no treino de hoje e recomendamos **+30s de descanso** entre as séries principais.";
    } else if (fbLower.includes("cheia") || msgLower.includes("cheia") || msgLower.includes("ocupada")) {
      reply = "🏋️ **Academia Lotada — Estratégia Ágil:** Utilize o botão **'Máquina Ocupada'** no exercício atual para jogá-lo para o fim da fila sem perder o ritmo, ou substitua equipamentos disputados por variações livres com halteres.";
    } else if (msgLower.includes("peso") || msgLower.includes("carga") || msgLower.includes("progredir")) {
      reply = "📈 **Progressão Sugerida:** Você completou todas as repetições com RPE ótimo na última sessão! Sugiro um aumento de **+2,5 kg** em exercícios de membros superiores (Supino, Puxada) e **+5 kg** em membros inferiores (Agachamento, Leg Press).";
    } else {
      reply = "🔥 **AI Coach:** Excelente consistência! Para o treino de hoje, mantenha o foco na cadência excêntrica controlada (2 segundos na descida) e respeite rigorosamente o cronômetro de 90s para máxima hipertrofia.";
    }

    return res.json({
      source: "heuristic_fallback",
      reply,
    });
  } catch (error: any) {
    console.error("AI Coach Error:", error);
    res.status(500).json({
      error: "Falha ao consultar AI Coach",
      reply: "💪 Mantenha o foco em boa técnica e descanso adequado. Sempre respeite os sinais de fadiga do seu corpo!",
    });
  }
});

// Explicit JSON 404 handler for all unmatched /api routes (prevents serving index.html)
app.all("/api/*", (req, res) => {
  res.status(404).json({ error: `Endpoint de API ${req.originalUrl} não encontrado.` });
});

// JSON Error Handler for API
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.path.startsWith("/api")) {
    console.error("[API Error Handler]", err);
    return res.status(err.status || 500).json({
      error: err.message || "Erro interno do servidor",
    });
  }
  next(err);
});

async function startServer() {
  // Vite middleware for development / static serving for production
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
    console.log(`💪 Gym Companion Server running on http://localhost:${PORT}`);
  });
}

startServer();
