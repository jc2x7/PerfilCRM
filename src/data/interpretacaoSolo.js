// Tabelas de interpretação baseadas no Boletim 100 (IAC) e Embrapa
// Referência: "Recomendações de Adubação e Calagem para o Estado de São Paulo"
// e Boletim Técnico EMBRAPA para solos do Cerrado

// Classificação: muito_baixo, baixo, medio, adequado, alto
// Cada faixa: [min, max] (max = Infinity para último nível)

const faixasTextura = {
  argilosa: { min: 36, label: '> 35% argila' },
  media: { min: 16, max: 35, label: '16-35% argila' },
  arenosa: { min: 0, max: 15, label: '< 16% argila' },
};

function getClasseTextural(argila) {
  if (argila == null) return null;
  if (argila > 60) return 'Muito Argilosa';
  if (argila > 35) return 'Argilosa';
  if (argila > 15) return 'Média';
  return 'Arenosa';
}

// Faixas para pH em CaCl2
function classificarPh(valor) {
  if (valor == null) return null;
  if (valor <= 4.3) return { nivel: 'muito_baixo', label: 'Muito Ácido' };
  if (valor <= 4.9) return { nivel: 'baixo', label: 'Ácido' };
  if (valor <= 5.5) return { nivel: 'medio', label: 'Mod. Ácido' };
  if (valor <= 6.0) return { nivel: 'adequado', label: 'Adequado' };
  return { nivel: 'alto', label: 'Alcalino' };
}

// Matéria Orgânica (g/dm³)
function classificarMO(valor) {
  if (valor == null) return null;
  if (valor <= 15) return { nivel: 'muito_baixo', label: 'Muito Baixo' };
  if (valor <= 25) return { nivel: 'baixo', label: 'Baixo' };
  if (valor <= 35) return { nivel: 'medio', label: 'Médio' };
  if (valor <= 50) return { nivel: 'adequado', label: 'Adequado' };
  return { nivel: 'alto', label: 'Alto' };
}

// Fósforo - Mehlich (mg/dm³) - varia com teor de argila
function classificarP(valor, argila) {
  if (valor == null) return null;
  // Para solos argilosos (> 35% argila)
  if (argila > 35) {
    if (valor <= 3) return { nivel: 'muito_baixo', label: 'Muito Baixo' };
    if (valor <= 8) return { nivel: 'baixo', label: 'Baixo' };
    if (valor <= 15) return { nivel: 'medio', label: 'Médio' };
    if (valor <= 25) return { nivel: 'adequado', label: 'Adequado' };
    return { nivel: 'alto', label: 'Alto' };
  }
  // Para solos de textura média/arenosa
  if (valor <= 6) return { nivel: 'muito_baixo', label: 'Muito Baixo' };
  if (valor <= 15) return { nivel: 'baixo', label: 'Baixo' };
  if (valor <= 30) return { nivel: 'medio', label: 'Médio' };
  if (valor <= 60) return { nivel: 'adequado', label: 'Adequado' };
  return { nivel: 'alto', label: 'Alto' };
}

// Potássio (mmolc/dm³)
function classificarK(valor) {
  if (valor == null) return null;
  if (valor <= 0.7) return { nivel: 'muito_baixo', label: 'Muito Baixo' };
  if (valor <= 1.5) return { nivel: 'baixo', label: 'Baixo' };
  if (valor <= 3.0) return { nivel: 'medio', label: 'Médio' };
  if (valor <= 6.0) return { nivel: 'adequado', label: 'Adequado' };
  return { nivel: 'alto', label: 'Alto' };
}

// Cálcio (mmolc/dm³)
function classificarCa(valor) {
  if (valor == null) return null;
  if (valor <= 10) return { nivel: 'muito_baixo', label: 'Muito Baixo' };
  if (valor <= 20) return { nivel: 'baixo', label: 'Baixo' };
  if (valor <= 40) return { nivel: 'medio', label: 'Médio' };
  if (valor <= 70) return { nivel: 'adequado', label: 'Adequado' };
  return { nivel: 'alto', label: 'Alto' };
}

// Magnésio (mmolc/dm³)
function classificarMg(valor) {
  if (valor == null) return null;
  if (valor <= 4) return { nivel: 'muito_baixo', label: 'Muito Baixo' };
  if (valor <= 8) return { nivel: 'baixo', label: 'Baixo' };
  if (valor <= 15) return { nivel: 'medio', label: 'Médio' };
  if (valor <= 25) return { nivel: 'adequado', label: 'Adequado' };
  return { nivel: 'alto', label: 'Alto' };
}

// Enxofre (mg/dm³)
function classificarS(valor) {
  if (valor == null) return null;
  if (valor <= 4) return { nivel: 'muito_baixo', label: 'Muito Baixo' };
  if (valor <= 8) return { nivel: 'baixo', label: 'Baixo' };
  if (valor <= 15) return { nivel: 'medio', label: 'Médio' };
  return { nivel: 'adequado', label: 'Adequado' };
}

// Alumínio (mmolc/dm³)
function classificarAl(valor) {
  if (valor == null) return null;
  if (valor <= 0) return { nivel: 'adequado', label: 'Ausente' };
  if (valor <= 2) return { nivel: 'medio', label: 'Baixo' };
  if (valor <= 5) return { nivel: 'baixo', label: 'Médio' };
  return { nivel: 'muito_baixo', label: 'Alto (Tóxico)' };
}

// Saturação por Bases V%
function classificarV(valor) {
  if (valor == null) return null;
  if (valor <= 25) return { nivel: 'muito_baixo', label: 'Muito Baixo' };
  if (valor <= 40) return { nivel: 'baixo', label: 'Baixo' };
  if (valor <= 60) return { nivel: 'medio', label: 'Médio' };
  if (valor <= 80) return { nivel: 'adequado', label: 'Adequado' };
  return { nivel: 'alto', label: 'Alto' };
}

// Saturação por Alumínio m%
function classificarM(valor) {
  if (valor == null) return null;
  if (valor <= 1) return { nivel: 'adequado', label: 'Sem Toxidez' };
  if (valor <= 10) return { nivel: 'medio', label: 'Baixa' };
  if (valor <= 20) return { nivel: 'baixo', label: 'Média' };
  return { nivel: 'muito_baixo', label: 'Alta (Tóxica)' };
}

// CTC (mmolc/dm³)
function classificarCTC(valor) {
  if (valor == null) return null;
  if (valor <= 40) return { nivel: 'muito_baixo', label: 'Muito Baixo' };
  if (valor <= 60) return { nivel: 'baixo', label: 'Baixo' };
  if (valor <= 90) return { nivel: 'medio', label: 'Médio' };
  if (valor <= 150) return { nivel: 'adequado', label: 'Adequado' };
  return { nivel: 'alto', label: 'Alto' };
}

// Boro (mg/dm³)
function classificarB(valor) {
  if (valor == null) return null;
  if (valor <= 0.15) return { nivel: 'muito_baixo', label: 'Muito Baixo' };
  if (valor <= 0.30) return { nivel: 'baixo', label: 'Baixo' };
  if (valor <= 0.50) return { nivel: 'medio', label: 'Médio' };
  if (valor <= 0.80) return { nivel: 'adequado', label: 'Adequado' };
  return { nivel: 'alto', label: 'Alto' };
}

// Cobre (mg/dm³)
function classificarCu(valor) {
  if (valor == null) return null;
  if (valor <= 0.3) return { nivel: 'muito_baixo', label: 'Muito Baixo' };
  if (valor <= 0.7) return { nivel: 'baixo', label: 'Baixo' };
  if (valor <= 1.5) return { nivel: 'medio', label: 'Médio' };
  return { nivel: 'adequado', label: 'Adequado' };
}

// Ferro (mg/dm³)
function classificarFe(valor) {
  if (valor == null) return null;
  if (valor <= 5) return { nivel: 'muito_baixo', label: 'Muito Baixo' };
  if (valor <= 12) return { nivel: 'baixo', label: 'Baixo' };
  if (valor <= 30) return { nivel: 'medio', label: 'Médio' };
  return { nivel: 'adequado', label: 'Adequado' };
}

// Manganês (mg/dm³)
function classificarMn(valor) {
  if (valor == null) return null;
  if (valor <= 1.3) return { nivel: 'muito_baixo', label: 'Muito Baixo' };
  if (valor <= 5.0) return { nivel: 'baixo', label: 'Baixo' };
  if (valor <= 12) return { nivel: 'medio', label: 'Médio' };
  return { nivel: 'adequado', label: 'Adequado' };
}

// Zinco (mg/dm³)
function classificarZn(valor) {
  if (valor == null) return null;
  if (valor <= 0.5) return { nivel: 'muito_baixo', label: 'Muito Baixo' };
  if (valor <= 1.0) return { nivel: 'baixo', label: 'Baixo' };
  if (valor <= 2.0) return { nivel: 'medio', label: 'Médio' };
  return { nivel: 'adequado', label: 'Adequado' };
}

// Condutividade Elétrica (dS/m)
function classificarCE(valor) {
  if (valor == null) return null;
  if (valor <= 0.4) return { nivel: 'adequado', label: 'Não Salino' };
  if (valor <= 0.8) return { nivel: 'medio', label: 'Levemente Salino' };
  if (valor <= 1.6) return { nivel: 'baixo', label: 'Mod. Salino' };
  return { nivel: 'muito_baixo', label: 'Salino' };
}

// Relação Ca/Mg
function classificarRelCaMg(valor) {
  if (valor == null) return null;
  if (valor < 1.5) return { nivel: 'baixo', label: 'Baixa (excesso Mg)' };
  if (valor <= 4.0) return { nivel: 'adequado', label: 'Ideal' };
  return { nivel: 'baixo', label: 'Alta (excesso Ca)' };
}

export function interpretarAnalise(analise) {
  if (!analise || analise.phCaCl2 == null) return null;

  return {
    phCaCl2: classificarPh(analise.phCaCl2),
    materiaOrganica: classificarMO(analise.materiaOrganica),
    fosforo: classificarP(analise.fosforo, analise.argila),
    potassio: classificarK(analise.potassio),
    calcio: classificarCa(analise.calcio),
    magnesio: classificarMg(analise.magnesio),
    enxofre: classificarS(analise.enxofre),
    aluminio: classificarAl(analise.aluminio),
    saturacaoBases: classificarV(analise.saturacaoBases),
    saturacaoAluminio: classificarM(analise.saturacaoAluminio),
    ctc: classificarCTC(analise.ctc),
    boro: classificarB(analise.boro),
    cobre: classificarCu(analise.cobre),
    ferro: classificarFe(analise.ferro),
    manganes: classificarMn(analise.manganes),
    zinco: classificarZn(analise.zinco),
    condutividadeEletrica: classificarCE(analise.condutividadeEletrica),
    relCaMg: classificarRelCaMg(analise.relCaMg),
    classeTextural: getClasseTextural(analise.argila),
  };
}

export const nivelCores = {
  muito_baixo: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', bar: 'bg-red-500' },
  baixo: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', bar: 'bg-orange-400' },
  medio: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', bar: 'bg-yellow-400' },
  adequado: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', bar: 'bg-green-500' },
  alto: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', bar: 'bg-blue-500' },
};

export const camposAnalise = [
  // Formulário agrupado
  {
    grupo: 'Identificação',
    campos: [
      { key: 'cliente', label: 'Produtor', tipo: 'text' },
      { key: 'fazenda', label: 'Fazenda', tipo: 'text' },
      { key: 'talhao', label: 'Talhão', tipo: 'text' },
      { key: 'dataColeta', label: 'Data da Coleta', tipo: 'date' },
      { key: 'laboratorio', label: 'Laboratório', tipo: 'text' },
      { key: 'profundidade', label: 'Profundidade', tipo: 'text' },
    ],
  },
  {
    grupo: 'Textura do Solo',
    campos: [
      { key: 'argila', label: 'Argila', unidade: '%', tipo: 'number' },
      { key: 'silte', label: 'Silte', unidade: '%', tipo: 'number' },
      { key: 'areia', label: 'Areia', unidade: '%', tipo: 'number' },
    ],
  },
  {
    grupo: 'Condutividade e Acidez',
    campos: [
      { key: 'condutividadeEletrica', label: 'Condutividade Elétrica (CE)', unidade: 'dS/m', tipo: 'number', step: '0.01' },
      { key: 'phAgua', label: 'pH em Água', unidade: '', tipo: 'number', step: '0.1' },
      { key: 'phCaCl2', label: 'pH em CaCl₂', unidade: '', tipo: 'number', step: '0.1' },
      { key: 'aluminio', label: 'Alumínio (Al³⁺)', unidade: 'mmolc/dm³', tipo: 'number', step: '0.1' },
      { key: 'hAl', label: 'H+Al (Acidez Potencial)', unidade: 'mmolc/dm³', tipo: 'number', step: '0.1' },
    ],
  },
  {
    grupo: 'Matéria Orgânica',
    campos: [
      { key: 'materiaOrganica', label: 'Matéria Orgânica (M.O.)', unidade: 'g/dm³', tipo: 'number', step: '0.1' },
    ],
  },
  {
    grupo: 'Macronutrientes',
    campos: [
      { key: 'fosforo', label: 'Fósforo (P)', unidade: 'mg/dm³', tipo: 'number', step: '0.1' },
      { key: 'potassio', label: 'Potássio (K⁺)', unidade: 'mmolc/dm³', tipo: 'number', step: '0.1' },
      { key: 'calcio', label: 'Cálcio (Ca²⁺)', unidade: 'mmolc/dm³', tipo: 'number', step: '0.1' },
      { key: 'magnesio', label: 'Magnésio (Mg²⁺)', unidade: 'mmolc/dm³', tipo: 'number', step: '0.1' },
      { key: 'enxofre', label: 'Enxofre (S)', unidade: 'mg/dm³', tipo: 'number', step: '0.1' },
    ],
  },
  {
    grupo: 'Micronutrientes',
    campos: [
      { key: 'boro', label: 'Boro (B)', unidade: 'mg/dm³', tipo: 'number', step: '0.01' },
      { key: 'cobre', label: 'Cobre (Cu)', unidade: 'mg/dm³', tipo: 'number', step: '0.1' },
      { key: 'ferro', label: 'Ferro (Fe)', unidade: 'mg/dm³', tipo: 'number', step: '0.1' },
      { key: 'manganes', label: 'Manganês (Mn)', unidade: 'mg/dm³', tipo: 'number', step: '0.1' },
      { key: 'zinco', label: 'Zinco (Zn)', unidade: 'mg/dm³', tipo: 'number', step: '0.01' },
    ],
  },
  {
    grupo: 'Índices Calculados',
    campos: [
      { key: 'somaBase', label: 'Soma de Bases (SB)', unidade: 'mmolc/dm³', tipo: 'number', step: '0.1' },
      { key: 'ctc', label: 'CTC', unidade: 'mmolc/dm³', tipo: 'number', step: '0.1' },
      { key: 'saturacaoBases', label: 'V% (Sat. Bases)', unidade: '%', tipo: 'number', step: '0.1' },
      { key: 'saturacaoAluminio', label: 'm% (Sat. Alumínio)', unidade: '%', tipo: 'number', step: '0.1' },
      { key: 'relCaMg', label: 'Relação Ca/Mg', unidade: '', tipo: 'number', step: '0.1' },
      { key: 'relCaK', label: 'Relação Ca/K', unidade: '', tipo: 'number', step: '0.1' },
      { key: 'relMgK', label: 'Relação Mg/K', unidade: '', tipo: 'number', step: '0.1' },
    ],
  },
];
