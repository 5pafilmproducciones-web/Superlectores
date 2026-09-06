/**
 * Mascot AI Service for Super Lectores
 * Connects to server-side Gemini API (/api/mascot/ask) with robust client fallback
 * Strictly enforces anti-cheating guidelines ("sin hacer trampa en los cuentos")
 */

export interface MascotAskParams {
  question: string;
  childName: string;
  activeStoryTitle?: string;
  activeStoryText?: string;
  storyQuestions?: string[];
}

export interface MascotAnswerResult {
  answer: string;
  isPedagogicalClue: boolean;
  source: 'gemini' | 'pedagogical-rules';
}

// Client-side quick anti-cheat detector
export function isCheatAttempt(question: string): boolean {
  const q = question.toLowerCase();
  const cheatTerms = [
    'respuesta',
    'solucion',
    'solución',
    'trampa',
    'dime la respuesta',
    'dame la respuesta',
    'es verdadero o falso',
    'es verdadero',
    'es falso',
    'cual elijo',
    'cuál elijo',
    'que elijo',
    'qué elijo',
    'que pongo',
    'qué pongo',
    'pasame las respuestas',
    'pásame las respuestas',
    'ayudame con el quiz',
    'ayúdame con el quiz',
    'ayudame con el examen',
    'ayúdame con el examen',
    'dime las respuestas'
  ];
  return cheatTerms.some((term) => q.includes(term));
}

// Local smart fallback generator
export function getLocalPedagogicalAnswer(params: MascotAskParams): MascotAnswerResult {
  const { question, childName, activeStoryTitle, activeStoryText } = params;
  const q = question.toLowerCase().trim();

  // 1. Anti-cheat enforcement
  if (isCheatAttempt(q)) {
    if (activeStoryTitle) {
      return {
        answer: `¡Hoo-hoo, ${childName}! Como buen búho sabio, ¡mi misión es ayudarte a pensar y no hacer trampa! En el cuento "${activeStoryTitle}", todas las respuestas están ocultas como tesoros en el texto. Vuelve a leer el párrafo con atención y busca la acción clave. ¡Tú eres un gran detective lector y lo lograrás por ti mismo!`,
        isPedagogicalClue: true,
        source: 'pedagogical-rules',
      };
    }
    return {
      answer: `¡Hoo-hoo, ${childName}! Los grandes lectores no necesitan trampas porque su mente es súper poderosa. Lee con calma el cuento y fíjate en las palabras clave. ¡Descubrirás la respuesta correcta tú solo!`,
      isPedagogicalClue: true,
      source: 'pedagogical-rules',
    };
  }

  // 2. Questions about the current story
  if (q.includes('de que trata') || q.includes('de qué trata') || q.includes('resumen') || q.includes('cuéntame el cuento') || q.includes('cuentame')) {
    if (activeStoryTitle) {
      return {
        answer: `"${activeStoryTitle}" es una aventura maravillosa donde los personajes aprenden a ser valientes, cuidar a sus amigos y descubrir cosas nuevas. ¡Léelo en voz alta párrafo a párrafo y verás qué emocionante!`,
        isPedagogicalClue: false,
        source: 'pedagogical-rules',
      };
    }
    return {
      answer: `¡Cada cuento en LecturaKids tiene personajes asombrosos como colibríes rápidos, dragones tiernos y exploradores espaciales! Toca cualquier cuento en la biblioteca para comenzar.`,
      isPedagogicalClue: false,
      source: 'pedagogical-rules',
    };
  }

  // 3. Word meanings (vocabulary)
  if (q.includes('que significa') || q.includes('qué significa') || q.includes('que quiere decir') || q.includes('qué quiere decir')) {
    // Check specific known words from stories
    if (q.includes('néctar') || q.includes('nectar')) {
      return {
        answer: `¡El néctar es un juguito dulce y delicioso que tienen las flores! Es como el postre favorito de colibríes y abejitas.`,
        isPedagogicalClue: false,
        source: 'pedagogical-rules',
      };
    }
    if (q.includes('constelación') || q.includes('constelacion')) {
      return {
        answer: `¡Una constelación es un grupo de estrellas en el cielo nocturno que, al unirlas con la imaginación, forman figuras como animales o héroes!`,
        isPedagogicalClue: false,
        source: 'pedagogical-rules',
      };
    }
    if (q.includes('estruendo')) {
      return {
        answer: `¡Un estruendo es un ruido muy fuerte y repentino, como el retumbar de un rayo o cuando cae algo gigante al suelo!`,
        isPedagogicalClue: false,
        source: 'pedagogical-rules',
      };
    }
    if (q.includes('valiente')) {
      return {
        answer: `Ser valiente no significa no tener miedo, ¡sino atreverse a hacer las cosas buenas y correctas aunque sientas un poquito de miedo!`,
        isPedagogicalClue: false,
        source: 'pedagogical-rules',
      };
    }
    return {
      answer: `¡Qué gran curiosidad, ${childName}! Cuando encuentres palabras difíciles en el cuento, léelas despacio sílaba por sílaba y mira las oraciones de alrededor para entenderlas como un detective.`,
      isPedagogicalClue: false,
      source: 'pedagogical-rules',
    };
  }

  // 4. Questions about gems and rewards
  if (q.includes('gema') || q.includes('moneda') || q.includes('juego') || q.includes('arcade')) {
    return {
      answer: `¡Ganas gemas cada vez que lees un cuento en voz alta con buena fluidez y cuando respondes correctamente las preguntas de comprensión! Con tus gemas puedes jugar en el Cruce de Río, los Topos y el Piano.`,
      isPedagogicalClue: false,
      source: 'pedagogical-rules',
    };
  }

  // 5. Questions about Leo
  if (q.includes('quien eres') || q.includes('quién eres') || q.includes('como te llamas') || q.includes('cómo te llamas') || q.includes('búho') || q.includes('buho')) {
    return {
      answer: `¡Soy Leo el Búho Lector! Uso estos anteojos mágicos para leer libros de noche y de día. Mi mayor felicidad es acompañarte a ti, ${childName}, a convertirte en un súper lector.`,
      isPedagogicalClue: false,
      source: 'pedagogical-rules',
    };
  }

  // 6. Tips for better reading
  if (q.includes('leer mejor') || q.includes('como leo') || q.includes('cómo leo') || q.includes('consejo')) {
    return {
      answer: `¡El secreto de los grandes lectores es leer todos los días un ratito! Respira profundo, haz pausas en los puntos y usa tonos de voz para cada personaje. ¡Verás cómo mejoras rápido!`,
      isPedagogicalClue: false,
      source: 'pedagogical-rules',
    };
  }

  // Default encouraging reply
  return {
    answer: `¡Qué excelente pregunta, ${childName}! Los niños curiosos como tú son los que descubren las mejores historias. Recuerda leer el cuento con atención y ganarás muchas gemas hoy. ¿Seguimos leyendo?`,
    isPedagogicalClue: false,
    source: 'pedagogical-rules',
  };
}

export async function askMascotQuestion(params: MascotAskParams): Promise<MascotAnswerResult> {
  const safeQuestion = params.question.trim();
  if (!safeQuestion) {
    return {
      answer: `¡Hoo-hoo! No te escuché bien, ${params.childName}. ¿Puedes repetirme tu pregunta?`,
      isPedagogicalClue: false,
      source: 'pedagogical-rules',
    };
  }

  // Pre-check for anti-cheat: if it's an overt cheat attempt, return the pedagogical clue instantly
  if (isCheatAttempt(safeQuestion)) {
    return getLocalPedagogicalAnswer(params);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch('/api/mascot/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && typeof data.answer === 'string' && data.answer.trim()) {
        return {
          answer: data.answer.trim(),
          isPedagogicalClue: isCheatAttempt(safeQuestion),
          source: (data.source as 'gemini' | 'pedagogical-rules') || 'gemini',
        };
      }
    }
  } catch (err) {
    console.info('Using local pedagogical engine for mascot answer:', err);
  }

  // Fallback to local rule engine
  return getLocalPedagogicalAnswer(params);
}
