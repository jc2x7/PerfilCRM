import { useState, useEffect, useCallback } from 'react';
import {
  ScrollView, View, Text, StyleSheet, TouchableOpacity,
  Modal, TextInput, RefreshControl, ActivityIndicator, Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize } from '../src/constants/theme';
import { listarProspectos, atualizarProdutor, criarInteracao } from '../src/services/produtorService';

const formatDate = (d) => {
  if (!d) return '—';
  const parts = d.split('-');
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

const etapas = [
  { id: 'primeiro_contato', label: 'Primeiro Contato', cor: Colors.gray[400] },
  { id: 'visita_inicial', label: 'Visita Inicial', cor: Colors.blue[500] },
  { id: 'levantamento', label: 'Levantamento', cor: Colors.amber[500] },
  { id: 'apresentacao', label: 'Apresentação', cor: Colors.orange[400] },
  { id: 'relacionamento', label: 'Relacionamento', cor: Colors.perfil[400] },
];

const tempConfig = {
  quente: { label: 'Quente', bg: Colors.red[50], text: Colors.red[600], icon: 'fire' },
  morno: { label: 'Morno', bg: Colors.amber[50], text: Colors.amber[600], icon: 'white-balance-sunny' },
  frio: { label: 'Frio', bg: Colors.blue[50], text: Colors.blue[600], icon: 'snowflake' },
};

function PipelineBar({ etapaId }) {
  const currentStep = etapas.findIndex((e) => e.id === etapaId);
  return (
    <View style={styles.pipeline}>
      {etapas.map((e, i) => (
        <View key={e.id} style={[styles.pipeSegment, { backgroundColor: i <= currentStep ? e.cor : Colors.gray[200] }]} />
      ))}
    </View>
  );
}

function EmptyState({ onAdd }) {
  return (
    <View style={styles.emptyWrap}>
      <MaterialCommunityIcons name="account-search-outline" size={48} color={Colors.gray[300]} />
      <Text style={styles.emptyTitle}>Nenhum prospecto encontrado</Text>
      <Text style={styles.emptySub}>Cadastre um novo produtor para iniciar a prospecção</Text>
      <TouchableOpacity style={styles.emptyBtn} onPress={onAdd}>
        <MaterialCommunityIcons name="plus" size={18} color={Colors.white} />
        <Text style={styles.emptyBtnText}>Novo Produtor</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function Prospeccao() {
  const router = useRouter();
  const [prospectos, setProspectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState(null);
  const [busca, setBusca] = useState('');
  const [filtroEtapa, setFiltroEtapa] = useState(null);

  // Modal nova interação
  const [showNovaInteracao, setShowNovaInteracao] = useState(false);
  const [novoTipo, setNovoTipo] = useState('Ligação');
  const [novoDescricao, setNovoDescricao] = useState('');
  const [salvandoInteracao, setSalvandoInteracao] = useState(false);

  // Modal avançar etapa
  const [showAvancarEtapa, setShowAvancarEtapa] = useState(false);

  const fetchData = useCallback(async () => {
    const { data, error } = await listarProspectos();
    if (error) {
      Alert.alert('Erro', 'Não foi possível carregar os prospectos.');
    } else {
      setProspectos(data || []);
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = () => { setRefreshing(true); fetchData(); };

  const filtered = prospectos.filter((p) => {
    if (filtroEtapa && p.fase_prospeccao !== filtroEtapa) return false;
    if (!busca) return true;
    const q = busca.toLowerCase();
    const propNome = p.propriedades?.[0]?.nome || '';
    return (
      p.nome.toLowerCase().includes(q) ||
      propNome.toLowerCase().includes(q) ||
      (p.cidade || '').toLowerCase().includes(q)
    );
  });

  const getAreaTotal = (p) => {
    if (!p.propriedades?.length) return 0;
    return p.propriedades.reduce((sum, prop) => sum + (prop.area_total_ha || 0), 0);
  };

  const handleNovaInteracao = async () => {
    if (!novoDescricao.trim()) {
      Alert.alert('Atenção', 'Preencha a descrição da interação.');
      return;
    }
    setSalvandoInteracao(true);
    const { error } = await criarInteracao({
      produtor_id: selected.id,
      tipo: novoTipo,
      descricao: novoDescricao.trim(),
    });
    setSalvandoInteracao(false);
    if (error) {
      Alert.alert('Erro', error.message);
    } else {
      setNovoDescricao('');
      setShowNovaInteracao(false);
      fetchData();
      // Atualiza selected com nova interação
      setSelected((prev) => ({
        ...prev,
        interacoes_prospeccao: [
          { data: new Date().toISOString().split('T')[0], tipo: novoTipo, descricao: novoDescricao.trim() },
          ...(prev.interacoes_prospeccao || []),
        ],
      }));
    }
  };

  const handleAvancarEtapa = async (novaEtapa) => {
    const { error } = await atualizarProdutor(selected.id, { fase_prospeccao: novaEtapa });
    if (error) {
      Alert.alert('Erro', error.message);
    } else {
      setShowAvancarEtapa(false);
      setSelected((prev) => ({ ...prev, fase_prospeccao: novaEtapa }));
      fetchData();
    }
  };

  const handleTemperatura = async (temp) => {
    const { error } = await atualizarProdutor(selected.id, { temperatura: temp });
    if (!error) {
      setSelected((prev) => ({ ...prev, temperatura: temp }));
      fetchData();
    }
  };

  // Contadores por etapa
  const contadores = {};
  etapas.forEach((e) => { contadores[e.id] = prospectos.filter((p) => p.fase_prospeccao === e.id).length; });

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.perfil[500]} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.topBar}>
        <View style={styles.searchRow}>
          <MaterialCommunityIcons name="magnify" size={18} color={Colors.gray[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar prospect..."
            placeholderTextColor={Colors.gray[400]}
            value={busca}
            onChangeText={setBusca}
          />
          {busca ? (
            <TouchableOpacity onPress={() => setBusca('')}>
              <MaterialCommunityIcons name="close-circle" size={18} color={Colors.gray[400]} />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity style={styles.addBtnSmall} onPress={() => router.push('/cadastro-produtor')}>
          <MaterialCommunityIcons name="plus" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Filtros por etapa */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, !filtroEtapa && styles.filterChipActive]}
          onPress={() => setFiltroEtapa(null)}
        >
          <Text style={[styles.filterText, !filtroEtapa && styles.filterTextActive]}>
            Todos ({prospectos.length})
          </Text>
        </TouchableOpacity>
        {etapas.map((e) => (
          <TouchableOpacity
            key={e.id}
            style={[styles.filterChip, filtroEtapa === e.id && { backgroundColor: e.cor }]}
            onPress={() => setFiltroEtapa(filtroEtapa === e.id ? null : e.id)}
          >
            <Text style={[styles.filterText, filtroEtapa === e.id && { color: Colors.white }]}>
              {e.label} ({contadores[e.id]})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista */}
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.perfil[500]} />}
      >
        {filtered.length === 0 ? (
          <EmptyState onAdd={() => router.push('/cadastro-produtor')} />
        ) : (
          filtered.map((p) => {
            const temp = tempConfig[p.temperatura] || tempConfig.frio;
            const etapa = etapas.find((e) => e.id === p.fase_prospeccao);
            const area = getAreaTotal(p);
            const propNome = p.propriedades?.[0]?.nome || '';
            const interacoes = p.interacoes_prospeccao || [];

            return (
              <TouchableOpacity
                key={p.id}
                style={[styles.card, { borderLeftWidth: 4, borderLeftColor: etapa?.cor || Colors.gray[300] }]}
                onPress={() => setSelected(p)}
                activeOpacity={0.7}
              >
                <View style={styles.cardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.nome}>{p.nome}</Text>
                    <Text style={styles.sub}>
                      {propNome ? `${propNome} - ` : ''}{p.cidade || ''}{p.estado ? `/${p.estado}` : ''}
                    </Text>
                  </View>
                  <View style={[styles.tempBadge, { backgroundColor: temp.bg }]}>
                    <MaterialCommunityIcons name={temp.icon} size={12} color={temp.text} />
                    <Text style={[styles.tempText, { color: temp.text }]}>{temp.label}</Text>
                  </View>
                </View>
                <PipelineBar etapaId={p.fase_prospeccao} />
                {p.proxima_acao && (
                  <View style={styles.actionBox}>
                    <Text style={styles.actionText} numberOfLines={1}>{p.proxima_acao}</Text>
                    {p.data_proxima_acao && (
                      <Text style={styles.actionDate}>{formatDate(p.data_proxima_acao)}</Text>
                    )}
                  </View>
                )}
                <View style={styles.metaRow}>
                  {area > 0 && <Text style={styles.metaText}>{area.toLocaleString('pt-BR')} ha</Text>}
                  {p.responsavel && <Text style={styles.metaText}>{p.responsavel}</Text>}
                  <Text style={styles.metaText}>{interacoes.length} interações</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Modal detalhe */}
      <Modal visible={!!selected} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            {selected && (
              <>
                <View style={styles.modalHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalTitle}>{selected.nome}</Text>
                    <Text style={styles.modalSub}>
                      {selected.propriedades?.[0]?.nome ? `${selected.propriedades[0].nome} - ` : ''}
                      {selected.cidade || ''}{selected.estado ? `/${selected.estado}` : ''}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelected(null)}>
                    <MaterialCommunityIcons name="close" size={22} color={Colors.gray[400]} />
                  </TouchableOpacity>
                </View>
                <ScrollView style={{ padding: 20 }}>
                  {/* Badges */}
                  <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                    <TouchableOpacity
                      style={[styles.tempBadge, { backgroundColor: (tempConfig[selected.temperatura] || tempConfig.frio).bg }]}
                      onPress={() => {
                        const temps = ['frio', 'morno', 'quente'];
                        const curIdx = temps.indexOf(selected.temperatura);
                        const next = temps[(curIdx + 1) % temps.length];
                        handleTemperatura(next);
                      }}
                    >
                      <MaterialCommunityIcons
                        name={(tempConfig[selected.temperatura] || tempConfig.frio).icon}
                        size={12}
                        color={(tempConfig[selected.temperatura] || tempConfig.frio).text}
                      />
                      <Text style={[styles.tempText, { color: (tempConfig[selected.temperatura] || tempConfig.frio).text }]}>
                        {(tempConfig[selected.temperatura] || tempConfig.frio).label}
                      </Text>
                    </TouchableOpacity>
                    {selected.origem && (
                      <View style={[styles.tempBadge, { backgroundColor: Colors.gray[100] }]}>
                        <Text style={[styles.tempText, { color: Colors.gray[600] }]}>{selected.origem}</Text>
                      </View>
                    )}
                  </View>

                  {/* Pipeline */}
                  <PipelineBar etapaId={selected.fase_prospeccao} />
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, marginBottom: 8 }}>
                    {etapas.map((e) => (
                      <Text key={e.id} style={{
                        fontSize: 8, textAlign: 'center', flex: 1,
                        color: e.id === selected.fase_prospeccao ? Colors.gray[800] : Colors.gray[400],
                        fontWeight: e.id === selected.fase_prospeccao ? '700' : '400',
                      }}>
                        {e.label}
                      </Text>
                    ))}
                  </View>
                  <TouchableOpacity style={styles.avancarBtn} onPress={() => setShowAvancarEtapa(true)}>
                    <MaterialCommunityIcons name="arrow-right-circle-outline" size={16} color={Colors.perfil[600]} />
                    <Text style={styles.avancarBtnText}>Avançar Etapa</Text>
                  </TouchableOpacity>

                  {/* Info */}
                  <View style={{ gap: 10, marginTop: 12 }}>
                    {[
                      { l: 'Área', v: getAreaTotal(selected) > 0 ? `${getAreaTotal(selected).toLocaleString('pt-BR')} ha` : '—' },
                      { l: 'Telefone', v: selected.telefone || '—' },
                      { l: 'E-mail', v: selected.email || '—' },
                      { l: 'Responsável', v: selected.responsavel || '—' },
                      { l: 'Primeiro Contato', v: formatDate(selected.data_primeiro_contato) },
                    ].map((i) => (
                      <View key={i.l}><Text style={styles.dl}>{i.l}</Text><Text style={styles.dv}>{i.v}</Text></View>
                    ))}

                    {/* Conhecimento e intenções */}
                    {(selected.conhece_servico || selected.ja_trabalhou_com_servico) && (
                      <View style={styles.infoBox}>
                        {selected.conhece_servico && (
                          <View style={styles.infoRow}>
                            <MaterialCommunityIcons name="check-circle" size={14} color={Colors.perfil[500]} />
                            <Text style={styles.infoRowText}>Conhece nosso serviço</Text>
                          </View>
                        )}
                        {selected.ja_trabalhou_com_servico && (
                          <View style={styles.infoRow}>
                            <MaterialCommunityIcons name="check-circle" size={14} color={Colors.perfil[500]} />
                            <Text style={styles.infoRowText}>Já trabalhou com este tipo de serviço</Text>
                          </View>
                        )}
                        {selected.servico_anterior_detalhes && (
                          <Text style={styles.infoDetail}>{selected.servico_anterior_detalhes}</Text>
                        )}
                      </View>
                    )}

                    {selected.intencoes && (
                      <View><Text style={styles.dl}>Intenções</Text><Text style={styles.dv}>{selected.intencoes}</Text></View>
                    )}
                    {selected.expectativas && (
                      <View><Text style={styles.dl}>Expectativas</Text><Text style={styles.dv}>{selected.expectativas}</Text></View>
                    )}

                    {selected.proxima_acao && (
                      <View style={styles.actionBoxModal}>
                        <Text style={{ fontSize: 11, fontWeight: '600', color: Colors.amber[700] }}>Próxima Ação</Text>
                        <Text style={{ fontSize: 13, fontWeight: '500', color: Colors.amber[800], marginTop: 2 }}>{selected.proxima_acao}</Text>
                        {selected.data_proxima_acao && (
                          <Text style={{ fontSize: 11, color: Colors.amber[600], marginTop: 2 }}>{formatDate(selected.data_proxima_acao)}</Text>
                        )}
                      </View>
                    )}
                  </View>

                  {/* Interações */}
                  <View style={styles.interacoesHeader}>
                    <Text style={styles.section}>Histórico de Interações</Text>
                    <TouchableOpacity onPress={() => { setNovoTipo('Ligação'); setNovoDescricao(''); setShowNovaInteracao(true); }}>
                      <MaterialCommunityIcons name="plus-circle" size={22} color={Colors.perfil[500]} />
                    </TouchableOpacity>
                  </View>
                  {(selected.interacoes_prospeccao || []).length === 0 ? (
                    <Text style={{ fontSize: 12, color: Colors.gray[400], textAlign: 'center', paddingVertical: 12 }}>
                      Nenhuma interação registrada
                    </Text>
                  ) : (
                    [...(selected.interacoes_prospeccao || [])].sort((a, b) => (b.data || '').localeCompare(a.data || '')).map((inter, i) => (
                      <View key={inter.id || i} style={styles.timelineRow}>
                        <View style={styles.timelineDot} />
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.gray[700] }}>{inter.tipo}</Text>
                            <Text style={{ fontSize: 10, color: Colors.gray[400] }}>{formatDate(inter.data)}</Text>
                          </View>
                          <Text style={{ fontSize: 12, color: Colors.gray[600], marginTop: 2 }}>{inter.descricao}</Text>
                        </View>
                      </View>
                    ))
                  )}

                  {selected.observacoes && (
                    <>
                      <Text style={styles.section}>Observações</Text>
                      <Text style={styles.obs}>{selected.observacoes}</Text>
                    </>
                  )}
                  <View style={{ height: 32 }} />
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal nova interação */}
      <Modal visible={showNovaInteracao} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { maxHeight: '50%', borderTopLeftRadius: 20, borderTopRightRadius: 20 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nova Interação</Text>
              <TouchableOpacity onPress={() => setShowNovaInteracao(false)}>
                <MaterialCommunityIcons name="close" size={22} color={Colors.gray[400]} />
              </TouchableOpacity>
            </View>
            <View style={{ padding: 20, gap: 14 }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.gray[600] }}>Tipo</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {['Ligação', 'Visita', 'Reunião', 'WhatsApp', 'E-mail', 'Feira', 'Evento'].map((t) => (
                    <TouchableOpacity
                      key={t}
                      style={[styles.tipoChip, novoTipo === t && styles.tipoChipActive]}
                      onPress={() => setNovoTipo(t)}
                    >
                      <Text style={[styles.tipoChipText, novoTipo === t && { color: Colors.white }]}>{t}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              <TextInput
                style={styles.textArea}
                placeholder="Descreva a interação..."
                placeholderTextColor={Colors.gray[400]}
                value={novoDescricao}
                onChangeText={setNovoDescricao}
                multiline
              />
              <TouchableOpacity
                style={[styles.saveBtn, salvandoInteracao && { opacity: 0.7 }]}
                onPress={handleNovaInteracao}
                disabled={salvandoInteracao}
              >
                {salvandoInteracao ? (
                  <ActivityIndicator color={Colors.white} size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>Salvar Interação</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal avançar etapa */}
      <Modal visible={showAvancarEtapa} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { maxHeight: '50%', borderTopLeftRadius: 20, borderTopRightRadius: 20 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Avançar Etapa</Text>
              <TouchableOpacity onPress={() => setShowAvancarEtapa(false)}>
                <MaterialCommunityIcons name="close" size={22} color={Colors.gray[400]} />
              </TouchableOpacity>
            </View>
            <View style={{ padding: 20, gap: 8 }}>
              {etapas.map((e) => {
                const isCurrent = selected?.fase_prospeccao === e.id;
                return (
                  <TouchableOpacity
                    key={e.id}
                    style={[styles.etapaOption, isCurrent && { backgroundColor: e.cor, borderColor: e.cor }]}
                    onPress={() => { if (!isCurrent) handleAvancarEtapa(e.id); }}
                    disabled={isCurrent}
                  >
                    <View style={[styles.etapaDot, { backgroundColor: e.cor }]} />
                    <Text style={[styles.etapaOptionText, isCurrent && { color: Colors.white, fontWeight: '700' }]}>
                      {e.label}
                    </Text>
                    {isCurrent && (
                      <MaterialCommunityIcons name="check" size={18} color={Colors.white} style={{ marginLeft: 'auto' }} />
                    )}
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity
                style={[styles.etapaOption, { borderColor: Colors.perfil[300], backgroundColor: Colors.perfil[50] }]}
                onPress={() => handleAvancarEtapa('cliente')}
              >
                <MaterialCommunityIcons name="account-check" size={16} color={Colors.perfil[600]} />
                <Text style={[styles.etapaOptionText, { color: Colors.perfil[700], fontWeight: '600' }]}>
                  Converter em Cliente
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray[50] },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  searchRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: Colors.white, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.gray[200] },
  searchInput: { flex: 1, fontSize: 14, color: Colors.gray[800] },
  addBtnSmall: { width: 40, height: 40, borderRadius: BorderRadius.lg, backgroundColor: Colors.perfil[500], alignItems: 'center', justifyContent: 'center' },
  filterRow: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.sm, gap: 8 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: Colors.gray[100] },
  filterChipActive: { backgroundColor: Colors.perfil[500] },
  filterText: { fontSize: 11, fontWeight: '600', color: Colors.gray[600] },
  filterTextActive: { color: Colors.white },
  content: { paddingHorizontal: Spacing.lg, gap: Spacing.sm },
  card: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.gray[100] },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  nome: { fontSize: FontSize.md, fontWeight: '600', color: Colors.gray[800] },
  sub: { fontSize: 12, color: Colors.gray[500], marginTop: 1 },
  tempBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  tempText: { fontSize: 10, fontWeight: '600' },
  pipeline: { flexDirection: 'row', gap: 3, marginBottom: 10 },
  pipeSegment: { flex: 1, height: 5, borderRadius: 3 },
  actionBox: { backgroundColor: Colors.amber[50], borderRadius: 8, padding: 8, marginBottom: 8 },
  actionText: { fontSize: 12, fontWeight: '500', color: Colors.amber[700] },
  actionDate: { fontSize: 10, color: Colors.amber[500], marginTop: 2 },
  metaRow: { flexDirection: 'row', gap: 14, flexWrap: 'wrap' },
  metaText: { fontSize: 11, color: Colors.gray[400] },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.gray[100] },
  modalTitle: { fontSize: 18, fontWeight: '700', color: Colors.gray[900] },
  modalSub: { fontSize: 13, color: Colors.gray[500] },
  dl: { fontSize: 11, color: Colors.gray[500] },
  dv: { fontSize: 14, fontWeight: '500', color: Colors.gray[800] },
  section: { fontSize: 11, fontWeight: '700', color: Colors.gray[500], textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 16, marginBottom: 8 },
  actionBoxModal: { backgroundColor: Colors.amber[50], borderRadius: 10, padding: 12, borderWidth: 1, borderColor: Colors.amber[100] },
  timelineRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  timelineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.gray[300], marginTop: 4 },
  obs: { fontSize: 13, color: Colors.gray[600], lineHeight: 20, backgroundColor: Colors.gray[50], borderRadius: 10, padding: 12 },
  emptyWrap: { alignItems: 'center', paddingVertical: 60, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: Colors.gray[500] },
  emptySub: { fontSize: 13, color: Colors.gray[400], textAlign: 'center', paddingHorizontal: 40 },
  emptyBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, backgroundColor: Colors.perfil[500], paddingHorizontal: 20, paddingVertical: 10, borderRadius: BorderRadius.lg },
  emptyBtnText: { color: Colors.white, fontWeight: '600', fontSize: 14 },
  interacoesHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, marginBottom: 8 },
  avancarBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.perfil[200], backgroundColor: Colors.perfil[50] },
  avancarBtnText: { fontSize: 12, fontWeight: '600', color: Colors.perfil[600] },
  infoBox: { backgroundColor: Colors.perfil[50], borderRadius: BorderRadius.md, padding: 10, gap: 6 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoRowText: { fontSize: 12, color: Colors.perfil[700] },
  infoDetail: { fontSize: 11, color: Colors.gray[600], marginLeft: 20 },
  tipoChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, backgroundColor: Colors.gray[100] },
  tipoChipActive: { backgroundColor: Colors.perfil[500] },
  tipoChipText: { fontSize: 12, fontWeight: '500', color: Colors.gray[600] },
  textArea: { backgroundColor: Colors.gray[50], borderWidth: 1, borderColor: Colors.gray[200], borderRadius: BorderRadius.lg, padding: 12, fontSize: 14, color: Colors.gray[800], height: 80, textAlignVertical: 'top' },
  saveBtn: { backgroundColor: Colors.perfil[500], paddingVertical: 12, borderRadius: BorderRadius.lg, alignItems: 'center' },
  saveBtnText: { color: Colors.white, fontWeight: '600', fontSize: 14 },
  etapaOption: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 14, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.gray[200] },
  etapaDot: { width: 10, height: 10, borderRadius: 5 },
  etapaOptionText: { fontSize: 14, color: Colors.gray[700] },
});
