import { supabase } from '../lib/supabase';

// ─── Produtores ────────────────────────────────────────────

export async function listarProdutores() {
  const { data, error } = await supabase
    .from('produtores')
    .select('*, propriedades(*, talhoes(*))')
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function listarProspectos() {
  const { data, error } = await supabase
    .from('produtores')
    .select('*, propriedades(nome, area_total_ha), interacoes_prospeccao(id, data, tipo, descricao)')
    .neq('fase_prospeccao', 'cliente')
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function buscarProdutor(id) {
  const { data, error } = await supabase
    .from('produtores')
    .select('*, propriedades(*, talhoes(*), historicos(*)), interacoes_prospeccao(*)')
    .eq('id', id)
    .single();
  return { data, error };
}

export async function criarProdutor(produtor) {
  const { data, error } = await supabase
    .from('produtores')
    .insert(produtor)
    .select()
    .single();
  return { data, error };
}

export async function atualizarProdutor(id, updates) {
  const { data, error } = await supabase
    .from('produtores')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

export async function deletarProdutor(id) {
  const { error } = await supabase
    .from('produtores')
    .delete()
    .eq('id', id);
  return { error };
}

// ─── Propriedades ──────────────────────────────────────────

export async function criarPropriedade(propriedade) {
  const { data, error } = await supabase
    .from('propriedades')
    .insert(propriedade)
    .select()
    .single();
  return { data, error };
}

export async function atualizarPropriedade(id, updates) {
  const { data, error } = await supabase
    .from('propriedades')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

// ─── Talhões ───────────────────────────────────────────────

export async function criarTalhao(talhao) {
  const { data, error } = await supabase
    .from('talhoes')
    .insert(talhao)
    .select()
    .single();
  return { data, error };
}

export async function atualizarTalhao(id, updates) {
  const { data, error } = await supabase
    .from('talhoes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

export async function deletarTalhao(id) {
  const { error } = await supabase
    .from('talhoes')
    .delete()
    .eq('id', id);
  return { error };
}

// ─── Históricos ────────────────────────────────────────────

export async function criarHistorico(historico) {
  const { data, error } = await supabase
    .from('historicos')
    .insert(historico)
    .select()
    .single();
  return { data, error };
}

// ─── Interações de prospecção ──────────────────────────────

export async function criarInteracao(interacao) {
  const { data, error } = await supabase
    .from('interacoes_prospeccao')
    .insert(interacao)
    .select()
    .single();
  return { data, error };
}

export async function listarInteracoes(produtorId) {
  const { data, error } = await supabase
    .from('interacoes_prospeccao')
    .select('*')
    .eq('produtor_id', produtorId)
    .order('data', { ascending: false });
  return { data, error };
}
