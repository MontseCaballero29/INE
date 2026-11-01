// Fichas estáticas basadas en documento técnico del equipo (CCPC 2009–2024)
const perfiles = [
  {
    id: '1', nombre: 'Adultos mayores comprometidos', etiqueta: 'Participación consolidada',
    color: '#7B61B4', emoji: '♧',
    porcentajeListaNominal: 25.5, millonesListaNominal: 24.99, participacion: 65.7,
    edad: { etiqueta: '45 a 74 años', porcentaje: 69.7 },
    genero: { mujeres: 62.7, hombres: 37.3 },
    regiones: [{ nombre: 'Centro', porcentaje: 37.5 }, { nombre: 'Sur', porcentaje: 33.5 }],
    barrera: 'Acceso físico',
    descripcionBarrera: 'La distancia, la movilidad reducida y las condiciones de accesibilidad pueden dificultar la llegada a las casillas.',
    resumen: 'Participación alta y creciente, con mayor peso de personas entre 45 y 74 años.',
    objetivo: 'Sostener su participación y facilitar el acceso a las casillas.',
    estrategiaTitulo: 'Accesibilidad e información cercana',
    estrategias: [
      'Difundir la ubicación de las casillas y sus condiciones de accesibilidad.',
      'Informar sobre las facilidades de voto para personas mayores o con discapacidad.',
      'Compartir información electoral clara mediante canales comunitarios.'
    ],
    canales: ['Radio y TV abierta', 'Juntas distritales', 'Espacios comunitarios'],
    recursos: 'Tiempos oficiales de radio y TV; criterios de accesibilidad de casillas; juntas distritales.'
  },
  {
    id: '2', nombre: 'Votantes estables del Norte', etiqueta: 'Participación regular',
    color: '#2F83AC', emoji: '◇',
    porcentajeListaNominal: 25.5, millonesListaNominal: 24.97, participacion: 58.5,
    edad: { etiqueta: '45 a 74 años', porcentaje: 44.0 },
    genero: { mujeres: 50.1, hombres: 49.9 },
    regiones: [{ nombre: 'Centro-Norte', porcentaje: 30.8 }, { nombre: 'Norte', porcentaje: 27.9 }],
    barrera: 'Eficacia y confianza percibidas',
    descripcionBarrera: 'Aunque votan con regularidad, su tendencia relativa es descendente; la percepción de eficacia de las elecciones es una barrera hipotética por investigar.',
    resumen: 'Votación relativamente constante, con la menor volatilidad y una tendencia ligeramente descendente.',
    objetivo: 'Mantener la participación y favorecer la comprensión del proceso electoral.',
    estrategiaTitulo: 'Educación cívica y transparencia electoral',
    estrategias: [
      'Explicar qué se decide en cada elección y cuáles son sus atribuciones.',
      'Mostrar de forma accesible cómo se cuentan y verifican los votos.',
      'Desarrollar actividades continuas de educación cívica, no solo antes de las elecciones.'
    ],
    canales: ['Medios locales', 'Plataformas digitales', 'Espacios laborales'],
    recursos: 'Estrategia Nacional de Educación Cívica (ENCÍVICA); difusión de resultados y cómputos.'
  },
  {
    id: '3', nombre: 'Votantes de elección presidencial', etiqueta: 'Participación intermitente',
    color: '#C28D48', emoji: '✦',
    porcentajeListaNominal: 18.4, millonesListaNominal: 17.99, participacion: 54.4,
    edad: { etiqueta: '18 a 34 años', porcentaje: 40.9 },
    genero: { mujeres: 61.2, hombres: 38.8 },
    regiones: [{ nombre: 'Centro', porcentaje: 68.3 }],
    barrera: 'Eficacia de elecciones intermedias y costo de oportunidad',
    descripcionBarrera: 'La participación varía mucho entre elecciones presidenciales e intermedias; los traslados y el desconocimiento de sus funciones son posibles barreras.',
    resumen: 'Brecha de 22.1 puntos entre elecciones presidenciales e intermedias.',
    objetivo: 'Reducir la diferencia de participación entre elecciones presidenciales e intermedias.',
    estrategiaTitulo: 'Información clara sobre elecciones intermedias',
    estrategias: [
      'Explicar qué cargos se eligen en las elecciones intermedias y cuáles son sus funciones.',
      'Facilitar la consulta de la ubicación de casillas y los horarios.',
      'Ofrecer materiales breves y comprensibles sobre el proceso de votación.'
    ],
    canales: ['Redes sociales', 'Transporte público', 'Plataformas digitales'],
    recursos: 'Tiempos oficiales en medios; ENCÍVICA; ubicador de casillas del INE.'
  },
  {
    id: '4', nombre: 'Personas jóvenes alejados de las urnas', etiqueta: 'Participación baja',
    color: '#D75F75', emoji: '↗',
    porcentajeListaNominal: 30.7, millonesListaNominal: 30.04, participacion: 43.8,
    edad: { etiqueta: '18 a 34 años', porcentaje: 62.2 },
    genero: { mujeres: 39.2, hombres: 60.8 },
    regiones: [
      { nombre: 'Centro', porcentaje: 28.3 },
      { nombre: 'Norte', porcentaje: 26.5 },
      { nombre: 'Centro-Norte', porcentaje: 26.5 }
    ],
    barrera: 'Desvinculación territorial',
    descripcionBarrera: 'La movilidad residencial y el vínculo con la comunidad pueden dificultar la participación; se trata de una hipótesis, no de una causa individual demostrada.',
    resumen: 'El perfil más numeroso y de menor participación, con predominio de hombres de 18 a 34 años.',
    objetivo: 'Facilitar el acceso a información electoral y trámites de actualización.',
    estrategiaTitulo: 'Información electoral y credencial vigente',
    estrategias: [
      'Difundir cómo actualizar el domicilio de la credencial para votar.',
      'Informar dónde y en qué horarios se puede votar.',
      'Compartir mensajes informativos entre pares y acercar orientación institucional a universidades y espacios laborales.'
    ],
    canales: ['Canales digitales', 'Universidades', 'Parques industriales', 'Deporte y música'],
    recursos: 'Módulos de Atención Ciudadana, incluidos itinerantes; campañas informativas de credencialización.'
  }
];

module.exports = { perfiles };
