-- =============================================
-- Schema: Perfil Soluções Agronômicas - CRM
-- =============================================

-- 1. Produtores (informações gerais + fase de prospecção)
CREATE TABLE IF NOT EXISTS produtores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users(id),

  -- Dados pessoais
  nome TEXT NOT NULL,
  telefone TEXT,
  email TEXT,
  cpf_cnpj TEXT,
  cidade TEXT,
  estado TEXT,

  -- Prospecção
  fase_prospeccao TEXT DEFAULT 'primeiro_contato'
    CHECK (fase_prospeccao IN (
      'primeiro_contato', 'visita_inicial', 'levantamento',
      'apresentacao', 'relacionamento', 'cliente'
    )),
  temperatura TEXT DEFAULT 'frio'
    CHECK (temperatura IN ('frio', 'morno', 'quente')),
  origem TEXT,
  indicado_por TEXT,
  responsavel TEXT,
  data_primeiro_contato DATE DEFAULT CURRENT_DATE,
  proxima_acao TEXT,
  data_proxima_acao DATE,

  -- Conhecimento / Intenções
  conhece_servico BOOLEAN DEFAULT false,
  ja_trabalhou_com_servico BOOLEAN DEFAULT false,
  servico_anterior_detalhes TEXT,
  intencoes TEXT,
  expectativas TEXT,

  observacoes TEXT
);

-- 2. Propriedades
CREATE TABLE IF NOT EXISTS propriedades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  produtor_id UUID REFERENCES produtores(id) ON DELETE CASCADE NOT NULL,

  nome TEXT NOT NULL,
  cidade TEXT,
  estado TEXT,
  area_total_ha NUMERIC(12,2),
  culturas TEXT[],
  observacoes TEXT
);

-- 3. Talhões (áreas dentro de cada propriedade)
CREATE TABLE IF NOT EXISTS talhoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  propriedade_id UUID REFERENCES propriedades(id) ON DELETE CASCADE NOT NULL,

  nome TEXT NOT NULL,
  area_ha NUMERIC(10,2) NOT NULL,
  cultura_atual TEXT,
  solo_tipo TEXT,
  observacoes TEXT
);

-- 4. Históricos (calagens, adubações e manejos)
CREATE TABLE IF NOT EXISTS historicos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  talhao_id UUID REFERENCES talhoes(id) ON DELETE CASCADE,
  propriedade_id UUID REFERENCES propriedades(id) ON DELETE CASCADE,

  tipo TEXT NOT NULL CHECK (tipo IN ('calagem', 'adubacao', 'manejo', 'outro')),
  data DATE,
  descricao TEXT,
  produto TEXT,
  dosagem TEXT,
  observacoes TEXT
);

-- 5. Interações de prospecção
CREATE TABLE IF NOT EXISTS interacoes_prospeccao (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  produtor_id UUID REFERENCES produtores(id) ON DELETE CASCADE NOT NULL,

  data DATE DEFAULT CURRENT_DATE,
  tipo TEXT NOT NULL,
  descricao TEXT
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_produtores_fase ON produtores(fase_prospeccao);
CREATE INDEX IF NOT EXISTS idx_produtores_user ON produtores(user_id);
CREATE INDEX IF NOT EXISTS idx_propriedades_produtor ON propriedades(produtor_id);
CREATE INDEX IF NOT EXISTS idx_talhoes_propriedade ON talhoes(propriedade_id);
CREATE INDEX IF NOT EXISTS idx_historicos_talhao ON historicos(talhao_id);
CREATE INDEX IF NOT EXISTS idx_interacoes_produtor ON interacoes_prospeccao(produtor_id);

-- RLS (Row Level Security)
ALTER TABLE produtores ENABLE ROW LEVEL SECURITY;
ALTER TABLE propriedades ENABLE ROW LEVEL SECURITY;
ALTER TABLE talhoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE historicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE interacoes_prospeccao ENABLE ROW LEVEL SECURITY;

-- Policies: authenticated users can do everything (equipe interna)
CREATE POLICY "Authenticated users full access" ON produtores
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users full access" ON propriedades
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users full access" ON talhoes
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users full access" ON historicos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users full access" ON interacoes_prospeccao
  FOR ALL USING (auth.role() = 'authenticated');

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER produtores_updated_at
  BEFORE UPDATE ON produtores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
