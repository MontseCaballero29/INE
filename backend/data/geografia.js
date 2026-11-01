//estados
const estados = [
  { id: '20', nombre: 'Oaxaca' },
  { id: '02', nombre: 'Baja California' },
  { id: '14', nombre: 'Jalisco' },
  { id: '19', nombre: 'Nuevo León' },
  { id: '21', nombre: 'Puebla' },
  { id: '26', nombre: 'Sonora' }
].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

//municipios
const municipios = [
  { id: '20067', estadoId: '20', nombre: 'Oaxaca de Juárez' },
  { id: '20390', estadoId: '20', nombre: 'Santa Lucía del Camino' },
  { id: '20043', estadoId: '20', nombre: 'Juchitán de Zaragoza' },
  { id: '02004', estadoId: '02', nombre: 'Tijuana' },
  { id: '02002', estadoId: '02', nombre: 'Mexicali' },
  { id: '14039', estadoId: '14', nombre: 'Guadalajara' },
  { id: '14120', estadoId: '14', nombre: 'Zapopan' },
  { id: '19039', estadoId: '19', nombre: 'Monterrey' },
  { id: '19026', estadoId: '19', nombre: 'Guadalupe' },
  { id: '21114', estadoId: '21', nombre: 'Puebla' },
  { id: '21156', estadoId: '21', nombre: 'Tehuacán' },
  { id: '26030', estadoId: '26', nombre: 'Hermosillo' },
  { id: '26018', estadoId: '26', nombre: 'Cajeme' }
];

// Localidades 
const localidadesPorMunicipio = {
  '20067': ['Oaxaca de Juárez', 'San Felipe del Agua', 'Trinidad de Viguera'],
  '20390': ['Santa Lucía del Camino', 'Santa María Ixcotel', 'San Francisco Tutla'],
  '20043': ['Juchitán de Zaragoza', 'La Ventosa', 'Chicapa de Castro'],
  '02004': ['Tijuana', 'La Joya', 'El Refugio'],
  '02002': ['Mexicali', 'Guadalupe Victoria', 'Los Algodones'],
  '14039': ['Guadalajara', 'Huentitán'],
  '14120': ['Zapopan', 'Tesistán', 'San Juan de Ocotán'],
  '19039': ['Monterrey', 'La Estanzuela', 'El Uro'],
  '19026': ['Guadalupe', 'Guadalupe Centro'],
  '21114': ['Heroica Puebla de Zaragoza', 'San Miguel Canoa', 'San Andrés Azumiatla'],
  '21156': ['Tehuacán', 'San Lorenzo Teotipilco', 'Santa María Coapan'],
  '26030': ['Hermosillo', 'Bahía de Kino', 'Miguel Alemán'],
  '26018': ['Ciudad Obregón', 'Cócorit', 'Esperanza']
};

const localidades = Object.entries(localidadesPorMunicipio).flatMap(([municipioId, nombres]) =>
  nombres.map((nombre, indice) => ({ id: `${municipioId}-demo-${indice + 1}`, municipioId, nombre }))
);

module.exports = { estados, municipios, localidades };
