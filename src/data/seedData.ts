import { CoreRecord, Story, ChildProfile, ReadingEvaluation, MiniGameDefinition } from '../types';
import dracoImg from '../assets/images/story_draco_dragon_1788557666582.jpg';
import tulaImg from '../assets/images/story_tula_skates_1788557679504.jpg';
import robotImg from '../assets/images/story_robot_paint_1788557694396.jpg';
import treeImg from '../assets/images/story_tree_crystal_1788557707803.jpg';
import coralImg from '../assets/images/story_coral_reef_1788557722216.jpg';
import bearImg from '../assets/images/story_bear_telescope_1788558006000.jpg';
import hummingbirdImg from '../assets/images/story_hummingbird_1788558025828.jpg';
import dolphinImg from '../assets/images/story_dolphin_1788558040584.jpg';
import compassImg from '../assets/images/story_compass_1788558056747.jpg';
import foxImg from '../assets/images/story_fox_clock_1788558073938.jpg';
import cloudCastleImg from '../assets/images/story_cloud_castle_1788558093794.jpg';
import marsImg from '../assets/images/story_mars_greenhouse_1788558110123.jpg';
import crystalCityImg from '../assets/images/story_crystal_city_1788558125804.jpg';

export const INITIAL_RECORDS: CoreRecord[] = [];

export const INITIAL_CHILD_PROFILE: ChildProfile = {
  name: 'Nuevo Lector',
  age: 7,
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  level: 1,
  gems: 0,
  score: 0,
  storiesCompletedCount: 0,
  audioAccuracyAverage: 0,
  streakDays: 0,
  activeGamePass: null
};

export const INITIAL_STORIES: Story[] = [
  {
    id: 'draco-dragon',
    title: 'Draco, el Dragón que Temía a la Oscuridad',
    category: 'Fábulas y Valores',
    level: 1,
    levelName: 'Nivel 1 (7 años)',
    badge: 'Principiante',
    emoji: '🐉',
    coverImage: dracoImg,
    summary: 'Draco es un pequeño dragón que descubre que las sombras de la cueva esconden simpáticas luciérnagas y hermosas estrellas.',
    wordCount: 85,
    rewardGems: 7,
    rewardPoints: 100,
    text: 'Draco era un dragón pequeño y verde. Aunque sus alas ya podían volar, le asustaba cuando el sol se ocultaba en la montaña. Una noche templada, una luciérnaga dorada llamada Chispa se posó en su nariz. Chispa le pidió que abriera los ojos con valentía. Al hacerlo, Draco vio miles de estrellas brillar en el cielo oscuro. Desde aquel día, Draco entendió que la noche no es solitaria, sino una manta azul llena de magia y amigos brillantes.',
    questions: [
      {
        id: 'q1-1',
        question: '¿Draco era un dragón grande y feroz que no le tenía miedo a nada?',
        isTrue: false,
        explanation: 'Falso. Draco era un dragón pequeño que al principio le temía a la oscuridad.'
      },
      {
        id: 'q1-2',
        question: '¿Una luciérnaga llamada Chispa se posó en la nariz de Draco para ayudarlo?',
        isTrue: true,
        explanation: 'Verdadero. Chispa lo animó a abrir los ojos para descubrir las estrellas.'
      },
      {
        id: 'q1-3',
        question: '¿Al final de la historia, Draco aprendió que la noche tiene estrellas brillantes?',
        isTrue: true,
        explanation: 'Verdadero. Descubrió que el cielo nocturno está lleno de magia y luz.'
      },
      {
        id: 'q1-4',
        question: '¿El color de Draco era de un verde brillante y sus alas ya podían volar?',
        isTrue: true,
        explanation: 'Verdadero. Draco era un dragón pequeño y verde con alas listas para volar.'
      },
      {
        id: 'q1-5',
        question: '¿Chispa le pidió a Draco que cerrara los ojos para siempre y no saliera de la cueva?',
        isTrue: false,
        explanation: 'Falso. Chispa le pidió que abriera los ojos con valentía para contemplar el cielo.'
      },
      {
        id: 'q1-6',
        question: '¿Draco comprendió que la noche no es solitaria, sino una manta azul llena de magia?',
        isTrue: true,
        explanation: 'Verdadero. Comprendió que la noche guarda amigos luminosos y calma.'
      }
    ],
    writingChallenge: {
      prompt: 'Escribe en 1 o 2 oraciones qué consejo le darías a un amigo que tiene miedo a la oscuridad.',
      keywordsRequired: ['luz', 'miedo', 'estrellas'],
      hint: 'Puedes mencionar que la luz de las estrellas o una lamparita nos ayuda a no tener miedo.'
    }
  },
  {
    id: 'tula-patinadora',
    title: 'Tula, la Tortuga con Patines Plateados',
    category: 'Aventuras',
    level: 1,
    levelName: 'Nivel 1 (7 años)',
    badge: 'Principiante',
    emoji: '🐢',
    coverImage: tulaImg,
    summary: 'Tula no quería quedarse atrás en las carreras del bosque, así que fabricó unos ingeniosos patines con cáscaras de nuez.',
    wordCount: 92,
    rewardGems: 7,
    rewardPoints: 100,
    text: 'En el bosque verde, todos los animales organizaban carreras veloces. Tula caminaba muy despacio y siempre llegaba tarde a la merienda. Un domingo tuvo una gran idea: recolectó cuatro cáscaras de nuez lisas y resbaladizas. Con ayuda de una ardilla carpinera, colocó pequeñas ruedas de madera. Al ponerse sus patines, Tula rodó alegremente por la colina, saludando a los conejos y demostrando que con ingenio y esfuerzo todos podemos disfrutar del deporte.',
    questions: [
      {
        id: 'q2-1',
        question: '¿Tula construyó sus patines utilizando cáscaras de nuez y ruedas de madera?',
        isTrue: true,
        explanation: 'Verdadero. Utilizó cáscaras lisas de nuez con rueditas de madera.'
      },
      {
        id: 'q2-2',
        question: '¿Los demás animales se burlaron de Tula y nunca más le hablaron?',
        isTrue: false,
        explanation: 'Falso. Tula saludó alegremente y todos compartieron la emoción de la carrera.'
      },
      {
        id: 'q2-3',
        question: '¿La historia enseña que con ingenio y esfuerzo podemos superar dificultades?',
        isTrue: true,
        explanation: 'Verdadero. El ingenio de Tula le permitió participar feliz en las carreras.'
      },
      {
        id: 'q2-4',
        question: '¿Una ardilla carpintera colaboró con Tula para ensamblar las ruedas de madera?',
        isTrue: true,
        explanation: 'Verdadero. La ardilla carpintera la ayudó con habilidad artesanal.'
      },
      {
        id: 'q2-5',
        question: '¿Tula siempre llegaba tarde a la merienda antes de tener sus patines de nuez?',
        isTrue: true,
        explanation: 'Verdadero. Su andar despacio no le permitía llegar a tiempo con los demás.'
      },
      {
        id: 'q2-6',
        question: '¿Tula tiró los patines a la basura porque no le gustaba sentir el viento al rodar?',
        isTrue: false,
        explanation: 'Falso. Tula rodó alegremente saludando a todos y disfrutando al máximo.'
      }
    ],
    writingChallenge: {
      prompt: '¿Qué objeto construirías tú para ayudar a un animal a moverse más rápido y seguro?',
      keywordsRequired: ['ruedas', 'ayuda', 'rápido'],
      hint: 'Piensa en un invento divertido con materiales reciclados.'
    }
  },
  {
    id: 'robot-flores',
    title: 'Byte-7, el Robot que Soñaba con Pintar',
    category: 'Ciencia y Naturaleza',
    level: 2,
    levelName: 'Nivel 2 (8-9 años)',
    badge: 'Intermedio',
    emoji: '🤖',
    coverImage: robotImg,
    summary: 'Un robot explorador programado para recoger metales descubre la belleza de las flores silvestres y decide aprender a pintar.',
    wordCount: 110,
    rewardGems: 10,
    rewardPoints: 150,
    text: 'Byte-7 fue diseñado para clasificar tuercas y cables en un laboratorio de la pradera. Sin embargo, cada mañana miraba fascinado cómo los rayos dorados del sol acariciaban los pétalos de margaritas y amapolas silvestres. Sus sensores registraban una calidez que ningún chip de computadora podía calcular. Un día recogió pigmentos de bayas maduras y hojas de menta. Con cuidado infinito, pintó su primer lienzo en una placa metálica. Los científicos quedaron asombrados al ver que la ciencia y la ternura artística podían convivir en un mismo corazón mecánico.',
    questions: [
      {
        id: 'q3-1',
        question: '¿Byte-7 fue construido inicialmente solo para ser un gran cocinero?',
        isTrue: false,
        explanation: 'Falso. Byte-7 fue construido para clasificar tuercas y cables en un laboratorio.'
      },
      {
        id: 'q3-2',
        question: '¿El robot utilizó pigmentos naturales de bayas y hojas de menta para pintar?',
        isTrue: true,
        explanation: 'Verdadero. Extrajo colores de elementos de la naturaleza para su cuadro.'
      },
      {
        id: 'q3-3',
        question: '¿Los científicos se molestaron y destruyeron la pintura de Byte-7?',
        isTrue: false,
        explanation: 'Falso. Los científicos quedaron asombrados y admiraron su talento y ternura.'
      },
      {
        id: 'q3-4',
        question: '¿Las flores silvestres que fascinaban a Byte-7 eran margaritas y amapolas?',
        isTrue: true,
        explanation: 'Verdadero. Admiraba los pétalos de margaritas y amapolas iluminados por el sol.'
      },
      {
        id: 'q3-5',
        question: '¿Byte-7 plasmó su primera obra de arte sobre una placa metálica?',
        isTrue: true,
        explanation: 'Verdadero. Pintó su primer lienzo sobre una placa de metal con esmero.'
      },
      {
        id: 'q3-6',
        question: '¿Los sensores de Byte-7 sintieron una calidez que ningún chip informático podía calcular?',
        isTrue: true,
        explanation: 'Verdadero. La belleza de la naturaleza despertó en él una sensibilidad única.'
      }
    ],
    writingChallenge: {
      prompt: 'Explica con tus palabras qué sintió Byte-7 cuando vio las flores por primera vez.',
      keywordsRequired: ['naturaleza', 'colores', 'alegría'],
      hint: 'Menciona el contraste entre los cables fríos y las flores cálidas.'
    }
  },
  {
    id: 'arbol-cristal',
    title: 'El Enigma del Árbol de Cristal',
    category: 'Misterio Infantil',
    level: 2,
    levelName: 'Nivel 2 (8-9 años)',
    badge: 'Intermedio',
    emoji: '🔮',
    coverImage: treeImg,
    summary: 'Valeria y Tomás descubren un árbol cuyas ramas de cuarzo guardan agua pura para los días secos del verano.',
    wordCount: 125,
    rewardGems: 10,
    rewardPoints: 160,
    text: 'Durante las vacaciones en el valle de los sauces, Valeria y Tomás siguieron el rastro de huellas luminosas dejadas por un búho plateado. En medio de un claro oculto por la niebla, se elevaba un sauce cuyas hojas parecían talladas en cristal transparente. De cada punta goteaba un néctar fresco y cristalino que caía sobre un estanque subterráneo. Un cartel de madera esculpida decía: "El guardián que comparte el agua jamás tendrá sed". Los dos hermanos comprendieron que aquel misterioso árbol era la reserva sagrada que protegía a los ciervos y zorros en época de sequía estival.',
    questions: [
      {
        id: 'q4-1',
        question: '¿Valeria y Tomás llegaron al árbol siguiendo las huellas de un búho plateado?',
        isTrue: true,
        explanation: 'Verdadero. Siguieron el rastro luminoso del búho hasta el claro oculto.'
      },
      {
        id: 'q4-2',
        question: '¿El árbol de cristal envenenaba el agua del bosque para alejar a los animales?',
        isTrue: false,
        explanation: 'Falso. El árbol producía agua pura y fresca que protegía a los animales durante la sequía.'
      },
      {
        id: 'q4-3',
        question: '¿El mensaje del árbol enseñaba la importancia de compartir los recursos?',
        isTrue: true,
        explanation: 'Verdadero. El cartel decía: "El guardián que comparte el agua jamás tendrá sed".'
      },
      {
        id: 'q4-4',
        question: '¿Las hojas del misterioso sauce parecían talladas en cristal transparente?',
        isTrue: true,
        explanation: 'Verdadero. Cada hoja parecía de cuarzo y de ella goteaba agua pura.'
      },
      {
        id: 'q4-5',
        question: '¿El néctar cristalino caía sobre un estanque subterráneo que saciaba la sed de ciervos y zorros?',
        isTrue: true,
        explanation: 'Verdadero. Protegía la fauna silvestre en épocas de intensa sequía.'
      },
      {
        id: 'q4-6',
        question: '¿Valeria y Tomás talaron el sauce de cristal para venderlo en el pueblo?',
        isTrue: false,
        explanation: 'Falso. Los dos hermanos respetaron el árbol y comprendieron su misión sagrada.'
      }
    ],
    writingChallenge: {
      prompt: '¿Por qué es fundamental cuidar y compartir el agua en nuestro planeta?',
      keywordsRequired: ['agua', 'cuidar', 'vida'],
      hint: 'Escribe cómo los seres vivos dependen del agua limpia para sobrevivir.'
    }
  },
  {
    id: 'templo-coral',
    title: 'La Expedición al Templo Sumergido de Coral',
    category: 'Ciencia y Naturaleza',
    level: 3,
    levelName: 'Nivel 3 (10 años)',
    badge: 'Avanzado',
    emoji: '🌊',
    coverImage: coralImg,
    summary: 'Una aventura submarina donde se descubre la compleja sinfonía con la que los arrecifes de coral se defienden de las tormentas.',
    wordCount: 145,
    rewardGems: 14,
    rewardPoints: 220,
    text: 'A diez metros bajo la superficie del mar Caribe, la bióloga marina Lucía y su aprendiz Leo descendieron hacia una formación de arrecifes milenarios llamada la Muralla Turquesa. Equipados con hidrófonos ultrasensibles, escucharon por primera vez los chasquidos rítmicos de camarones diminutos y los susurros de las anémonas. Lucía le explicó a Leo que los arrecifes no son rocas inertes, sino colonias de miles de millones de diminutos pólipos vivos que absorben la fuerza del oleaje feroz, evitando que las olas gigantes destruyan los manglares y las aldeas costeras. Admirado por la sabiduría del océano, Leo prometió dedicar su vida a restaurar y defender este frágil escudo protector de la biosfera.',
    questions: [
      {
        id: 'q5-1',
        question: '¿Los arrecifes de coral están formados por colonias de diminutos pólipos vivos?',
        isTrue: true,
        explanation: 'Verdadero. Los corales son organismos vivos que forman impresionantes colonias submarinas.'
      },
      {
        id: 'q5-2',
        question: '¿La Muralla Turquesa amplifica las olas para destruir los pueblos costeros?',
        isTrue: false,
        explanation: 'Falso. Los arrecifes absorben la fuerza del oleaje y protegen la costa de las tormentas.'
      },
      {
        id: 'q5-3',
        question: '¿Leo decidió que el océano no valía la pena y abandonó la expedición inmediatamente?',
        isTrue: false,
        explanation: 'Falso. Leo quedó tan conmovido que prometió dedicar su vida a restaurar y defender el arrecife.'
      },
      {
        id: 'q5-4',
        question: '¿Lucía y Leo emplearon hidrófonos ultrasensibles para oír los sonidos de anémonas y camarones?',
        isTrue: true,
        explanation: 'Verdadero. Escucharon por primera vez los chasquidos y susurros de la vida marina.'
      },
      {
        id: 'q5-5',
        question: '¿La Muralla Turquesa protege los manglares y las aldeas costeras absorbiendo las olas gigantes?',
        isTrue: true,
        explanation: 'Verdadero. Los arrecifes actúan como un escudo biológico protector contra las tempestades.'
      },
      {
        id: 'q5-6',
        question: '¿La expedición de Lucía se realizó en un lago de agua congelada en la cordillera?',
        isTrue: false,
        explanation: 'Falso. La inmersión se llevó a cabo a diez metros bajo la superficie del mar Caribe.'
      }
    ],
    writingChallenge: {
      prompt: 'Redacta un compromiso personal de 3 líneas sobre cómo podemos proteger los mares desde nuestras casas.',
      keywordsRequired: ['océano', 'plástico', 'proteger'],
      hint: 'Menciona no arrojar plásticos y reducir los residuos.'
    }
  },
  {
    id: 'oso-astronomo',
    title: 'Barnaby, el Oso que Miraba las Estrellas',
    level: 1,
    category: 'Astronomía y Amistad',
    levelName: 'Nivel 1 (7 años)',
    badge: 'Principiante',
    emoji: '🐻',
    coverImage: bearImg,
    summary: 'Barnaby no quería dormir la siesta invernal sin antes descubrir por qué la Osa Mayor brilla tanto en el firmamento nocturno.',
    wordCount: 88,
    rewardGems: 7,
    rewardPoints: 110,
    text: 'En la cima de la Colina Azul vivía Barnaby, un osito curioso con una bufanda tejida de lana roja. Mientras los demás osos se preparaban para hibernar en sus tibias cavernas, Barnaby limpiaba los lentes de su telescopio de latón. Una noche despejada, miró a través del visor y vio que las estrellas formaban la figura de una gran osa brillante. ¡No estaba solo en la noche! La Osa Mayor parecía sonreírle desde el cielo infinito. Feliz de saber que las estrellas cuidaban el bosque mientras todos dormían, Barnaby cerró los ojos y se acurrucó plácidamente.',
    questions: [
      {
        id: 'q6-1',
        question: '¿Barnaby usaba un telescopio para observar las estrellas en la noche?',
        isTrue: true,
        explanation: 'Verdadero. Barnaby limpiaba los lentes de su telescopio de latón para mirar el firmamento.'
      },
      {
        id: 'q6-2',
        question: '¿La constelación que vio en el cielo tenía forma de un pez volador?',
        isTrue: false,
        explanation: 'Falso. Las estrellas formaban la figura de la Osa Mayor brillante.'
      },
      {
        id: 'q6-3',
        question: '¿Barnaby se sintió acompañado y pudo dormir tranquilo al saber que las estrellas cuidaban el bosque?',
        isTrue: true,
        explanation: 'Verdadero. Se dio cuenta de que no estaba solo y se acurrucó feliz a descansar.'
      },
      {
        id: 'q6-4',
        question: '¿Barnaby llevaba puesta una bufanda tejida de lana roja en la Colina Azul?',
        isTrue: true,
        explanation: 'Verdadero. Era un osito curioso que se abrigaba con su bufanda roja.'
      },
      {
        id: 'q6-5',
        question: '¿El telescopio de Barnaby estaba hecho de latón y él limpiaba sus lentes con cuidado?',
        isTrue: true,
        explanation: 'Verdadero. Cuidaba con esmero su telescopio para observar el cielo nocturno.'
      },
      {
        id: 'q6-6',
        question: '¿Barnaby rompió su telescopio porque no le gustaba ver el cielo estrellado?',
        isTrue: false,
        explanation: 'Falso. Le encantaba la astronomía y se durmió feliz bajo el brillo de las estrellas.'
      }
    ],
    writingChallenge: {
      prompt: 'Describe qué constelación o figura te gustaría ver si tuvieras un telescopio mágico.',
      keywordsRequired: ['estrella', 'cielo', 'brillar'],
      hint: 'Menciona qué forma tendría y por qué te gusta.'
    }
  },
  {
    id: 'colibri-valiente',
    title: 'Pipo, el Colibrí del Bosque Nuboso',
    level: 1,
    category: 'Naturaleza y Valentía',
    levelName: 'Nivel 1 (7 años)',
    badge: 'Principiante',
    emoji: '🐦',
    coverImage: hummingbirdImg,
    summary: 'A pesar de ser el ave más diminuta de la selva, las veloces alas de Pipo llevaron una semilla mágica a la montaña más alta.',
    wordCount: 94,
    rewardGems: 7,
    rewardPoints: 110,
    text: 'Pipo era un colibrí esmeralda que pesaba menos que una moneda. Aunque las grandes águilas se burlaban de su tamaño, sus alitas podían batir ochenta veces por segundo, flotando en el aire como si estuviera detenido. Un día de sequía, los animales necesitaban plantar una flor de rocío en la cumbre rocosa donde el viento era feroz. Ningún ave pesada pudo vencer las ráfagas, pero Pipo, ágil y valiente, surcó la tormenta sosteniendo la semilla dorada con su piquito. Gracias a su perseverancia, la flor brotó y el rocío refrescó todo el valle.',
    questions: [
      {
        id: 'q7-1',
        question: '¿Pipo podía mover sus alitas tan rápido que parecía flotar en el mismo lugar?',
        isTrue: true,
        explanation: 'Verdadero. Sus alas batían ochenta veces por segundo con asombrosa agilidad.'
      },
      {
        id: 'q7-2',
        question: '¿Las aves pesadas lograron plantar la flor de rocío sin ningún problema?',
        isTrue: false,
        explanation: 'Falso. Ningún ave pesada pudo resistir el viento feroz de la cumbre.'
      },
      {
        id: 'q7-3',
        question: '¿Pipo demostró que la valentía y la perseverancia no dependen del tamaño?',
        isTrue: true,
        explanation: 'Verdadero. Gracias a su valentía logró plantar la semilla dorada y salvar el valle.'
      },
      {
        id: 'q7-4',
        question: '¿Pipo era un colibrí esmeralda que pesaba menos que una pequeña moneda?',
        isTrue: true,
        explanation: 'Verdadero. A pesar de su ligereza, era increíblemente hábil y rápido.'
      },
      {
        id: 'q7-5',
        question: '¿Pipo llevó la semilla dorada sujetándola con su piquito a través de la tormenta?',
        isTrue: true,
        explanation: 'Verdadero. Sostuvo la semilla con su pico y voló hasta la cima rocosa.'
      },
      {
        id: 'q7-6',
        question: '¿La flor de rocío secó por completo el valle y dejó a todos los animales sin agua?',
        isTrue: false,
        explanation: 'Falso. La flor brotó y el rocío refrescó y llenó de vida a todo el valle.'
      }
    ],
    writingChallenge: {
      prompt: 'Escribe una pequeña historia sobre una ocasión en la que fuiste valiente aunque sentías temor.',
      keywordsRequired: ['valiente', 'ayuda', 'lograr'],
      hint: 'Cuenta qué hiciste y cómo te sentiste al lograrlo.'
    }
  },
  {
    id: 'delfin-musico',
    title: 'Coralito, el Delfín Flautista',
    level: 1,
    category: 'Música Marina',
    levelName: 'Nivel 1 (7 años)',
    badge: 'Principiante',
    emoji: '🐬',
    coverImage: dolphinImg,
    summary: 'Coralito aprendió a modular burbujas con sonidos cantarines por su espiráculo, organizando una orquesta con las tortugas de la bahía.',
    wordCount: 92,
    rewardGems: 7,
    rewardPoints: 100,
    text: 'En las aguas cálidas de Bahía Esmeralda vivía Coralito, un delfín rosado con un don muy especial. Al salir a respirar, expulsaba chorritos de agua y burbujas que silbaban melodías alegres como una pequeña flauta de cristal. Al principio le daba vergüenza, pero un día las tortugas marinas comenzaron a nadar al compás de sus notas. Pronto, los caballitos de mar y los peces loro se sumaron batiendo sus aletas. Coralito comprendió que compartir su alegría hacía del arrecife un hogar donde todos podían bailar en perfecta armonía.',
    questions: [
      {
        id: 'q8-1',
        question: '¿Coralito producía sonidos musicales con las burbujas que salían de su espiráculo?',
        isTrue: true,
        explanation: 'Verdadero. Sus chorritos y burbujas silbaban notas cantarinas como una flauta.'
      },
      {
        id: 'q8-2',
        question: '¿A los animales marinos les molestaba la música y se alejaron nadando?',
        isTrue: false,
        explanation: 'Falso. Las tortugas, peces loro y caballitos de mar comenzaron a bailar al compás.'
      },
      {
        id: 'q8-3',
        question: '¿Coralito comprendió que su talento especial llenaba de felicidad a sus amigos?',
        isTrue: true,
        explanation: 'Verdadero. Descubrió la alegría de compartir su música y unir a los habitantes del mar.'
      },
      {
        id: 'q8-4',
        question: '¿Las tortugas marinas comenzaron a nadar al compás de las notas musicales de Coralito?',
        isTrue: true,
        explanation: 'Verdadero. Las tortugas fueron las primeras en sumarse a la danza musical.'
      },
      {
        id: 'q8-5',
        question: '¿Coralito era un delfín de color rosado que habitaba en las aguas de Bahía Esmeralda?',
        isTrue: true,
        explanation: 'Verdadero. Vivía en las cálidas aguas de Bahía Esmeralda con su hermosa melodía.'
      },
      {
        id: 'q8-6',
        question: '¿Los caballitos de mar y los peces loro le ordenaron a Coralito que guardara silencio?',
        isTrue: false,
        explanation: 'Falso. Se unieron con alegría batiendo sus aletas en armonía.'
      }
    ],
    writingChallenge: {
      prompt: '¿Qué instrumento musical o canción te alegra el día y con quién te gusta compartirlo?',
      keywordsRequired: ['música', 'canción', 'amigos'],
      hint: 'Menciona los sonidos que más te inspiran.'
    }
  },
  {
    id: 'brujula-dorada',
    title: 'La Brújula Dorada del Capitán Viento',
    level: 2,
    category: 'Aventura Marina',
    levelName: 'Nivel 2 (8-9 años)',
    badge: 'Intermedio',
    emoji: '🧭',
    coverImage: compassImg,
    summary: 'Una brújula antigua que no apunta hacia el norte, sino hacia la persona que necesita una mano amiga en altamar.',
    wordCount: 122,
    rewardGems: 10,
    rewardPoints: 150,
    text: 'El viejo marinero Salvador heredó una extraña brújula de bronce tallada con runas resplandecientes. Mientras las brújulas comunes giran obedeciendo el magnetismo del polo norte, la aguja dorada de Salvador vibraba con pulsos luminosos de color zafiro. Su nieta Maya descubrió el misterio una tarde borrascosa: la aguja siempre marcaba la dirección exacta de cualquier embarcación en apuros. Navegando tras el brillo zafiro, encontraron a tres pescadores cuya balsa había perdido el timón entre las olas bravas. Remolcándolos a puerto seguro, Maya comprendió que la mejor navegación es aquella guiada por la empatía y la solidaridad.',
    questions: [
      {
        id: 'q9-1',
        question: '¿La aguja dorada de la brújula señalaba hacia el norte magnético común?',
        isTrue: false,
        explanation: 'Falso. La aguja mágica vibraba en color zafiro señalando hacia quienes necesitaban auxilio.'
      },
      {
        id: 'q9-2',
        question: '¿Maya y su abuelo rescataron a tres pescadores que habían perdido el timón de su balsa?',
        isTrue: true,
        explanation: 'Verdadero. Siguieron la señal luminosa y los remolcaron con éxito hasta el puerto.'
      },
      {
        id: 'q9-3',
        question: '¿El cuento nos enseña el gran valor de la empatía y la ayuda mutua?',
        isTrue: true,
        explanation: 'Verdadero. Maya descubrió que la verdadera brújula de la vida es tender una mano a los demás.'
      },
      {
        id: 'q9-4',
        question: '¿La aguja de la brújula emitía pulsos luminosos de un brillante color zafiro?',
        isTrue: true,
        explanation: 'Verdadero. La luz zafiro señalaba la dirección exacta de quienes estaban en peligro.'
      },
      {
        id: 'q9-5',
        question: '¿La brújula estaba hecha de bronce y decorada con runas resplandecientes?',
        isTrue: true,
        explanation: 'Verdadero. El marinero Salvador la había heredado como una reliquia mágica.'
      },
      {
        id: 'q9-6',
        question: '¿Maya decidió esconder la brújula en el fondo del mar para que nadie la encontrara?',
        isTrue: false,
        explanation: 'Falso. Maya navegó guiada por la brújula para salvar a los pescadores en apuros.'
      }
    ],
    writingChallenge: {
      prompt: 'Escribe un párrafo imaginando a qué lugar misterioso te guiaría una brújula de la solidaridad.',
      keywordsRequired: ['ayuda', 'camino', 'viaje'],
      hint: 'Piensa en ayudar a un refugio de animales o proteger un parque.'
    }
  },
  {
    id: 'zorro-relojero',
    title: 'Flix, el Zorro Relojero del Tiempo',
    level: 2,
    category: 'Ingenio y Paciencia',
    levelName: 'Nivel 2 (8-9 años)',
    badge: 'Intermedio',
    emoji: '🦊',
    coverImage: foxImg,
    summary: 'Flix fabrica relojes que no miden los segundos ordinarios, sino los instantes de alegría, risas y calma en el bosque.',
    wordCount: 130,
    rewardGems: 10,
    rewardPoints: 160,
    text: 'En un acogedor taller iluminado por linternas de aceite, el zorro Flix colocaba diminutos engranajes dorados con la precisión de un cirujano. Los habitantes del bosque siempre andaban apresurados, corriendo de un lado a otro mirando sus relojes de bolsillo. Por eso, Flix inventó el Cronómetro de la Serenidad: un reloj de péndulo que no sonaba con campanadas estridentes, sino con el murmullo de un arroyo y el aroma a manzanilla fresca. Cada vez que alguien se sentaba a conversar con calma o compartía una risa sincera, el péndulo giraba en espiral liberando mariposas de latón. Pronto, los animales aprendieron que el tiempo mejor invertido es el que se disfruta sin prisas.',
    questions: [
      {
        id: 'q10-1',
        question: '¿Flix inventó un reloj que sonaba con ruidos molestos para apurar a los animales?',
        isTrue: false,
        explanation: 'Falso. El reloj producía el suave murmullo de un arroyo y liberaba aroma a manzanilla.'
      },
      {
        id: 'q10-2',
        question: '¿El Cronómetro de la Serenidad celebraba los momentos de calma, conversación y risa?',
        isTrue: true,
        explanation: 'Verdadero. El péndulo giraba y soltaba mariposas de latón cuando los animales compartían tiempo de calidad.'
      },
      {
        id: 'q10-3',
        question: '¿Los animales del bosque aprendieron la importancia de valorar el presente sin apurarse?',
        isTrue: true,
        explanation: 'Verdadero. Descubrieron que disfrutar con paciencia hace la vida mucho más feliz.'
      },
      {
        id: 'q10-4',
        question: '¿El acogedor taller del zorro Flix estaba iluminado por linternas de aceite?',
        isTrue: true,
        explanation: 'Verdadero. Flix ensamblaba diminutos engranajes dorados a la luz de las linternas.'
      },
      {
        id: 'q10-5',
        question: '¿El reloj liberaba mariposas de latón cuando los animales reían y disfrutaban con calma?',
        isTrue: true,
        explanation: 'Verdadero. El péndulo giraba en espiral premiando los momentos de serenidad.'
      },
      {
        id: 'q10-6',
        question: '¿Flix fabricó alarmas ensordecedoras para que nadie pudiera dormir ni descansar?',
        isTrue: false,
        explanation: 'Falso. Su invento producía el murmullo de un arroyo y aroma a manzanilla.'
      }
    ],
    writingChallenge: {
      prompt: 'Describe tu momento favorito del día y qué actividad te hace olvidar las prisas del reloj.',
      keywordsRequired: ['tiempo', 'calma', 'disfrutar'],
      hint: 'Menciona jugar, leer un libro o pasar tiempo con tu familia.'
    }
  },
  {
    id: 'castillo-nubes',
    title: 'El Misterio del Castillo entre las Nubes',
    level: 2,
    category: 'Fantasía y Exploración',
    levelName: 'Nivel 2 (8-9 años)',
    badge: 'Intermedio',
    emoji: '🏰',
    coverImage: cloudCastleImg,
    summary: 'Dos hermanos suben en un barrilete gigante hasta un palacio flotante donde los arcoíris se tejen con luz estelar.',
    wordCount: 135,
    rewardGems: 10,
    rewardPoints: 170,
    text: 'Cuando el sol se ocultaba tras los cerros, Martín y Sofía notaban torres de mármol blanco dibujadas entre las nubes crepusculares. Construyeron una cometa aerodinámica con varillas de bambú y tela de paracaídas, esperando el viento perfecto de septiembre. Una corriente térmica los elevó suavemente hasta una terraza flotante hecha de algodón condensado y vapor dulce. Allí descubrieron a los Tejedores Celestes, duendecillos alados que hilaban la luz solar con gotas de lluvia para crear los arcoíris que bajan a la tierra. Los duendes les obsequiaron un prisma brillante con una advertencia: cuidar siempre el aire limpio del planeta para que las nubes sigan existiendo.',
    questions: [
      {
        id: 'q11-1',
        question: '¿Martín y Sofía construyeron una cometa aerodinámica para ascender con el viento térmico?',
        isTrue: true,
        explanation: 'Verdadero. Usaron bambú y tela resistente para dejarse llevar por la corriente hacia las nubes.'
      },
      {
        id: 'q11-2',
        question: '¿Los Tejedores Celestes fabricaban los arcoíris usando luz solar y gotas de lluvia pura?',
        isTrue: true,
        explanation: 'Verdadero. Hilaban los colores celestes en sus telares de vapor condensado.'
      },
      {
        id: 'q11-3',
        question: '¿Los duendes les pidieron contaminar más el cielo para tener nubes oscuras?',
        isTrue: false,
        explanation: 'Falso. Les encomendaron proteger el aire limpio de la Tierra para preservar las nubes y la naturaleza.'
      },
      {
        id: 'q11-4',
        question: '¿La terraza flotante donde descansaron los hermanos estaba formada por algodón condensado y vapor dulce?',
        isTrue: true,
        explanation: 'Verdadero. Era un palacio flotante que emergía entre las nubes crepusculares.'
      },
      {
        id: 'q11-5',
        question: '¿Los Tejedores Celestes regalaron a los niños un prisma brillante para recordar su misión ambiental?',
        isTrue: true,
        explanation: 'Verdadero. Les entregaron el prisma como símbolo del cuidado de nuestra atmósfera.'
      },
      {
        id: 'q11-6',
        question: '¿Martín y Sofía subieron a las nubes viajando en un cohete con motor de combustible pesado?',
        isTrue: false,
        explanation: 'Falso. Volaron gracias a una cometa artesanal de bambú impulsada por una corriente térmica limpia.'
      }
    ],
    writingChallenge: {
      prompt: 'Escribe un mensaje de tres líneas proponiendo acciones para mantener el aire de tu ciudad limpio.',
      keywordsRequired: ['aire', 'limpio', 'planeta'],
      hint: 'Habla de plantar árboles y usar más la bicicleta o caminar.'
    }
  },
  {
    id: 'mision-ares',
    title: 'Misión Ares: El Invernadero Marciano',
    level: 3,
    category: 'Ciencia Ficción y Botánica',
    levelName: 'Nivel 3 (10 años)',
    badge: 'Avanzado',
    emoji: '🚀',
    coverImage: marsImg,
    summary: 'La joven botánica Sara y su equipo cultivan las primeras fresas y tomates hidropónicos en el suelo rojo del planeta Marte.',
    wordCount: 155,
    rewardGems: 14,
    rewardPoints: 230,
    text: 'A doscientos millones de kilómetros de su hogar natal, en el cráter Jezero del planeta Marte, la joven investigadora Sara supervisaba la presurización del Domo Botánico Alfa. Afuera rugía una tormenta de polvo carmesí y la temperatura rondaba los sesenta grados bajo cero, pero dentro del domo transparente de policarbonato, un sistema hidropónico con luz ultravioleta nutría hileras verdes de tomates cherry y fresas silvestres. Cuando el robot sensor detectó la polinización exitosa realizada por abejas robóticas micrométricas, Sara sonrió al ver brotar la primera fresa roja en suelo extraterrestre. Aquel pequeño fruto demostraba que la ciencia, la perseverancia humana y el respeto por los ciclos biológicos pueden encender la vida incluso en los rincones más inhóspitos del cosmos.',
    questions: [
      {
        id: 'q12-1',
        question: '¿El invernadero marciano utilizaba sistemas hidropónicos y luz ultravioleta controlada?',
        isTrue: true,
        explanation: 'Verdadero. Dentro del domo de policarbonato las plantas crecían gracias a la tecnología hidropónica.'
      },
      {
        id: 'q12-2',
        question: '¿La primera fruta que maduró en el domo de Marte fue una piña gigante?',
        isTrue: false,
        explanation: 'Falso. El primer fruto que brotó y maduró fue una fresa roja.'
      },
      {
        id: 'q12-3',
        question: '¿La historia enseña cómo la ciencia y el trabajo en equipo permiten superar desafíos colosales?',
        isTrue: true,
        explanation: 'Verdadero. Demuestra el poder de la investigación botánica y la perseverancia científica.'
      },
      {
        id: 'q12-4',
        question: '¿El Domo Botánico Alfa estaba situado en el cráter marciano llamado Jezero?',
        isTrue: true,
        explanation: 'Verdadero. A doscientos millones de kilómetros de la Tierra, en el cráter Jezero de Marte.'
      },
      {
        id: 'q12-5',
        question: '¿La polinización vegetal en el domo fue realizada con éxito por abejas robóticas micrométricas?',
        isTrue: true,
        explanation: 'Verdadero. Pequeños robots polinizadores permitieron que brotara la primera fresa silvestre.'
      },
      {
        id: 'q12-6',
        question: '¿Afuera del domo de Marte el clima era templado, sin polvo y con aire respirable?',
        isTrue: false,
        explanation: 'Falso. Afuera rugía una tormenta de polvo carmesí a sesenta grados bajo cero.'
      }
    ],
    writingChallenge: {
      prompt: 'Imagina qué planta o árbol terrestre llevarías en una misión espacial y por qué sería útil para la tripulación.',
      keywordsRequired: ['ciencia', 'planta', 'espacio'],
      hint: 'Menciona oxígeno, alimento o medicina natural.'
    }
  },
  {
    id: 'ciudad-cristales',
    title: 'Crónicas de Ágata: La Ciudad de los Cristales',
    level: 3,
    category: 'Geología y Tecnología Limpia',
    levelName: 'Nivel 3 (10 años)',
    badge: 'Avanzado',
    emoji: '💎',
    coverImage: crystalCityImg,
    summary: 'En las profundidades subterráneas, una civilización aprovecha la resonancia piezoeléctrica de geodas gigantes para alimentar trenes magnéticos limpios.',
    wordCount: 162,
    rewardGems: 14,
    rewardPoints: 250,
    text: 'A tres kilómetros bajo la corteza terrestre, los exploradores Mateo y Daniela descendieron en un ascensor geotérmico hasta las cavernas de Ágata. Allí se extendía una metrópolis subterránea asombrosa, iluminada por colosales pilares de amatista, cuarzo y esmeralda que emitían una luz violeta hipnótica. Los ingenieros locales explicaron que no quemaban carbón ni petróleo: aprovechaban la resonancia piezoeléctrica natural de las geodas para generar electricidad inagotable, la cual impulsaba trenes magnéticos que flotaban silenciosos sobre rieles de obsidiana. Fascinados por esta ingeniería en armonía con el planeta, Mateo y Daniela tomaron notas minuciosas para compartir estas técnicas renovables con las ciudades de la superficie, inspirando una transición hacia fuentes energéticas verdaderamente sostenibles.',
    questions: [
      {
        id: 'q13-1',
        question: '¿La ciudad subterránea funcionaba quemando carbón y petróleo contaminante?',
        isTrue: false,
        explanation: 'Falso. Generaban electricidad limpia utilizando la resonancia piezoeléctrica natural de las geodas.'
      },
      {
        id: 'q13-2',
        question: '¿Los trenes magnéticos de la ciudad flotaban en silencio sobre rieles de obsidiana?',
        isTrue: true,
        explanation: 'Verdadero. Los trenes funcionaban con energía limpia y sin emitir ruidos ni gases nocivos.'
      },
      {
        id: 'q13-3',
        question: '¿Los exploradores quisieron llevar estas ideas de energía renovable a las ciudades de la superficie?',
        isTrue: true,
        explanation: 'Verdadero. Tomaron notas para inspirar la transición hacia tecnologías ecológicas y sostenibles.'
      },
      {
        id: 'q13-4',
        question: '¿Mateo y Daniela descendieron tres kilómetros bajo tierra usando un ascensor geotérmico?',
        isTrue: true,
        explanation: 'Verdadero. Llegaron hasta las cavernas de Ágata en un ascensor geotérmico profundo.'
      },
      {
        id: 'q13-5',
        question: '¿La ciudad subterránea estaba iluminada por colosales pilares de amatista, cuarzo y esmeralda?',
        isTrue: true,
        explanation: 'Verdadero. Los pilares de minerales emitían una hermosa y relajante luz violeta.'
      },
      {
        id: 'q13-6',
        question: '¿Los ingenieros decidieron abandonar la energía piezoeléctrica y encender motores de diésel?',
        isTrue: false,
        explanation: 'Falso. Su tecnología es 100% limpia y está en completa armonía con la geología del planeta.'
      }
    ],
    writingChallenge: {
      prompt: 'Escribe una propuesta sobre cómo tu comunidad podría utilizar energías limpias como el sol o el viento.',
      keywordsRequired: ['energía', 'limpia', 'futuro'],
      hint: 'Menciona paneles solares, molinos de viento y ahorro energético.'
    }
  }
];

export const INITIAL_EVALUATIONS: ReadingEvaluation[] = [];

export const AVAILABLE_MINI_GAMES: MiniGameDefinition[] = [
  {
    id: 'race',
    name: 'Carreras Turbo Nitro',
    genre: 'Acción y Destreza',
    gemCost: 6,
    durationSeconds: 60,
    emoji: '🏎️',
    description: 'Conduce a máxima velocidad en la pista interestelar, esquiva los conos de tráfico y recolecta monedas doradas.',
    colorScheme: 'from-amber-500 to-orange-600'
  },
  {
    id: 'puzzle',
    name: 'Rompecabezas Mágico',
    genre: 'Lógica Visual',
    gemCost: 6,
    durationSeconds: 90,
    emoji: '🧩',
    description: 'Arma las piezas deslizantes para reconstruir las ilustraciones de tus cuentos favoritos.',
    colorScheme: 'from-sky-500 to-indigo-600'
  },
  {
    id: 'paint',
    name: 'Taller de Pintura y Dibujo',
    genre: 'Creatividad y Arte',
    gemCost: 6,
    durationSeconds: 120,
    emoji: '🎨',
    description: 'Lienzo libre para colorear escenas, pintar con acuarelas digitales, estampar stickers y firmar tu obra.',
    colorScheme: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'maze',
    name: 'Laberinto del Explorador',
    genre: 'Estrategia y Orientación',
    gemCost: 6,
    durationSeconds: 60,
    emoji: '🌀',
    description: 'Encuentra el camino secreto en el laberinto procedural dinámico, recoge la llave de oro y abre el cofre del tesoro.',
    colorScheme: 'from-purple-500 to-pink-600'
  },
  {
    id: 'memory',
    name: 'Memoria Galáctica de Cuentos',
    genre: 'Memoria y Concentración',
    gemCost: 6,
    durationSeconds: 90,
    emoji: '🃏',
    description: 'Voltea las cartas mágicas para encontrar las parejas de los personajes de tus cuentos antes de que termine el tiempo.',
    colorScheme: 'from-fuchsia-500 to-rose-600'
  },
  {
    id: 'space',
    name: 'Atrapa-Estrellas Cósmico',
    genre: 'Acción y Reflejos',
    gemCost: 9,
    durationSeconds: 60,
    emoji: '🚀',
    description: 'Pilota tu nave espacial para atrapar estrellas brillantes y gemas espaciales mientras esquivas meteoritos flotantes.',
    colorScheme: 'from-violet-600 to-indigo-800'
  },
  {
    id: 'words',
    name: 'Caza-Palabras y Burbujas Mágicas',
    genre: 'Lectura Rápida y Vocabulario',
    gemCost: 9,
    durationSeconds: 75,
    emoji: '🫧',
    description: 'Explota las burbujas flotantes que contienen las palabras claves de las historias para sumar combos y desbloquear gemas.',
    colorScheme: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'runner',
    name: 'Salto Prehistórico del Velociraptor',
    genre: 'Saltos y Reflejos Arcade',
    gemCost: 9,
    durationSeconds: 60,
    emoji: '🦖',
    description: 'Salta rocas y cactus prehistóricos con tu simpático dinosaurio recolectando gemas y corriendo a toda velocidad.',
    colorScheme: 'from-amber-600 to-orange-700'
  },
  {
    id: 'river',
    name: 'Río del Castor Saltarín',
    genre: 'Cruces y Destreza',
    gemCost: 9,
    durationSeconds: 80,
    emoji: '🦫',
    description: 'Salta sobre troncos en movimiento y nenúfares flotantes esquivando la corriente para llegar a salvo a la madriguera.',
    colorScheme: 'from-teal-600 to-emerald-700'
  },
  {
    id: 'moles',
    name: 'Topos Mágicos del Huerto',
    genre: 'Reacción Táctil y Agilidad',
    gemCost: 12,
    durationSeconds: 60,
    emoji: '🥕',
    description: 'Toca los topos simpáticos y las gemas secretas que salen de la tierra en el huerto evitando las piedras.',
    colorScheme: 'from-lime-600 to-amber-700'
  },
  {
    id: 'piano',
    name: 'Melodía Musical de Teclas Mágicas',
    genre: 'Memoria Sonora y Ritmo',
    gemCost: 12,
    durationSeconds: 90,
    emoji: '🎹',
    description: 'Escucha con atención la melodía de los cristales musicales y repite la secuencia de notas en el orden correcto.',
    colorScheme: 'from-purple-600 to-pink-700'
  }
];
