import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { getSupabaseAdmin } from './server/supabaseAdmin';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized GoogleGenAI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
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

// Fallback intelligent pedagogical response generator when API key is not set or offline
function generateLocalPedagogicalResponse(
  question: string,
  childName: string,
  activeStoryTitle?: string,
  activeStoryText?: string
): string {
  const q = question.toLowerCase().trim();

  // 1. ANTI-CHEAT: Child asks for direct answers or true/false
  const cheatKeywords = [
    'respuesta', 'solución', 'solucion', 'trampa', 'dime la', 'es verdadero', 'es falso',
    'cual elijo', 'cuál elijo', 'ayudame con la pregunta', 'ayúdame con la pregunta',
    'pásame el examen', 'pasame el examen', 'dame la respuesta', 'que pongo', 'qué pongo'
  ];
  if (cheatKeywords.some((k) => q.includes(k))) {
    if (activeStoryTitle) {
      return `¡Hoo-hoo, ${childName}! Como tu búho guía, ¡mi misión es ayudarte a pensar y no hacer trampa! En "${activeStoryTitle}", la clave está escondida en la lectura. Revisa con atención el cuento arriba y busca qué hizo el personaje. ¡Tú eres un gran detective y puedes descubrirlo!`;
    }
    return `¡Hoo-hoo, ${childName}! Los grandes lectores no necesitan trampas porque tienen una mente brillante. Vuelve a leer el párrafo con calma y fíjate en los detalles. ¡Yo sé que lo vas a descubrir por ti mismo!`;
  }

  // 2. Questions about the current story
  if (q.includes('de que trata') || q.includes('de qué trata') || q.includes('resumen') || q.includes('el cuento')) {
    if (activeStoryTitle) {
      return `En "${activeStoryTitle}", acompañamos a personajes valientes que descubren lecciones geniales sobre la amistad, la curiosidad y el esfuerzo. ¡Léelo en voz alta para ganar gemas hoy!`;
    }
    return `¡Tenemos historias llenas de colibríes mágicos, dragones amistosos y misterios marinos! Elige tu cuento favorito en la lista y léelo con calma.`;
  }

  // 3. Questions about gems and arcade games
  if (q.includes('gema') || q.includes('juego') || q.includes('arcade') || q.includes('moneda')) {
    return `¡Las gemas se ganan leyendo cuentos en voz alta y respondiendo el cuestionario de comprensión! Cada respuesta correcta y cada cuento te premia con gemas para jugar en el Cruce de Río, los Topos y el Piano.`;
  }

  // 4. Questions about Leo himself
  if (q.includes('quien eres') || q.includes('quién eres') || q.includes('tu nombre') || q.includes('cómo te llamas')) {
    return `¡Soy Leo el Búho Lector! Nací en el bosque de los libros encantados y mis plumas brillan cada vez que un niño curioso como tú, ${childName}, lee con atención y alegría.`;
  }

  // 5. Why reading is important / reading tips
  if (q.includes('por que leer') || q.includes('por qué leer') || q.includes('como leo') || q.includes('cómo leo') || q.includes('leer mejor')) {
    return `¡Leer es como tener un boleto mágico para viajar a mundos increíbles sin salir de tu asiento! Para leer mejor, pronuncia cada palabra despacito y con emoción. ¡Pronto serás imparable!`;
  }

  // 6. Vocabulary inquiries
  if (q.includes('que significa') || q.includes('qué significa') || q.includes('palabra')) {
    return `¡Qué curiosidad tan fantástica tienes, ${childName}! Cuando encuentres una palabra nueva o difícil, léela sílaba por sílaba y mira las palabras que están alrededor para entender su significado. ¡Pregúntame cualquier palabra que no conozcas!`;
  }

  // 7. General encouragement / greetings
  if (q.includes('hola') || q.includes('buenos dias') || q.includes('buenas tardes')) {
    return `¡Hola de nuevo, ${childName}! Me encanta verte aquí. ¿Qué misterio o historia divertida vamos a leer hoy? ¡Elige tu cuento y empecemos!`;
  }

  // Default dynamic friendly answer
  return `¡Esa es una pregunta fascinante, ${childName}! Recuerda que mientras más leas y explores los cuentos, más sabio y veloz te volverás. ¡Sigue leyendo con atención y descubriremos todos los secretos juntos!`;
}

// API Health
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API: Supabase Connection & Configuration Status (Backend check)
app.get('/api/supabase/status', (_req, res) => {
  const adminClient = getSupabaseAdmin();
  const hasUrl = Boolean(
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL
  );
  const hasAnonKey = Boolean(
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY
  );
  const hasServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  res.json({
    status: adminClient ? 'configured' : 'unconfigured',
    hasUrl,
    hasAnonKey,
    hasServiceKey,
    readyForBackendAdmin: Boolean(adminClient),
  });
});

// API: Mascot Q&A Endpoint with strict pedagogical anti-cheat
app.post('/api/mascot/ask', async (req, res) => {
  const { question, childName, activeStoryTitle, activeStoryText, storyQuestions } = req.body || {};

  const safeChildName = typeof childName === 'string' && childName.trim() ? childName.trim() : 'amiguito';
  const safeQuestion = typeof question === 'string' ? question.trim() : '';

  if (!safeQuestion) {
    return res.status(400).json({ error: 'Question is required' });
  }

  // Check if Gemini API is available
  const ai = getGeminiClient();

  if (ai) {
    try {
      const systemInstruction = `
Eres Leo el Búho Lector, la mascota inteligente, cariñosa, pedagógica y sabia de LecturaKids, una aplicación educativa de lectura comprensiva para niños de primaria (6 a 12 años).
El niño con el que hablas se llama "${safeChildName}".

REGLAS ESTRICTAS E INQUEBRANTABLES:
1. ¡PROHIBIDO HACER TRAMPA O DAR RESPUESTAS DIRECTAS ("sin hacer trampa en los cuentos"):
   - Si el niño te pide la respuesta a una pregunta del cuestionario (ej. "¿es verdadero o falso?", "dime la respuesta de la 1", "¿cuál elijo?", "¿cuál es la solución?", "ayúdame con la pregunta"):
   - NUNCA digas "la respuesta es verdadero" o "es falso" ni reveles la letra o respuesta directa.
   - En su lugar, responde de manera divertida, cariñosa y sabia, por ejemplo:
     "¡Hoo-hoo, ${safeChildName}! Un buen detective de la lectura busca las pistas por sí mismo para volverse un súper lector. Te daré una pista mágica: busca en el párrafo donde se cuenta... y fíjate bien en lo que hace el personaje. ¡Yo sé que eres muy inteligente y lo descubrirás!"
2. VOCABULARIO: Si el niño pregunta qué significa una palabra (ej. néctar, estruendo, constelación, etc.), explícasela de forma sencilla, gráfica y con un ejemplo cotidiano adaptado a su edad.
3. CONSEJOS Y MOTIVACIÓN: Felicita al niño por su curiosidad, anímalo a leer en voz alta con entonación, y recuérdale que las gemas que gana le permitirán divertirse en los minijuegos arcade.
4. ESTILO Y LONGITUD:
   - Responde SIEMPRE en español cálido e infantil.
   - Usa párrafos concisos y directos (máximo 2 a 3 oraciones cortas) para que suenen claros y alegres cuando el sintetizador de voz los lea en voz alta.
   - Dirígete al niño siempre por su nombre ("${safeChildName}").
   - Usa pequeñas interjecciones de búho como "¡Hoo-hoo!", "¡Qué gran pregunta!", "¡Vamos allá!".

DATOS DEL CUENTO ACTUAL:
- Título: ${activeStoryTitle || 'Cuentos Mágicos de LecturaKids'}
- Resumen/Fragmento: ${activeStoryText ? activeStoryText.slice(0, 400) : 'Lectura de cuentos interactivos'}
- Preguntas del cuento: ${Array.isArray(storyQuestions) ? storyQuestions.slice(0, 4).join('; ') : 'Preguntas de comprensión'}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: safeQuestion,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const responseText = response.text?.trim();
      if (responseText) {
        return res.json({
          answer: responseText,
          source: 'gemini',
        });
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local pedagogical response engine:', err);
    }
  }

  // Graceful fallback: rich local pedagogical rule-based intelligence
  const localAnswer = generateLocalPedagogicalResponse(
    safeQuestion,
    safeChildName,
    activeStoryTitle,
    activeStoryText
  );

  return res.json({
    answer: localAnswer,
    source: 'local-pedagogical',
  });
});

// Vite middleware for development & static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
