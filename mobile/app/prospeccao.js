import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize } from '../src/constants/theme';
import { prospeccao } from '../src/data/mockData';

const formatDate = (d) => { const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}`; };

const etapas = [
  { id: 'primeiro_contato', label: 'Primeiro Contato', cor: Colors.gray[400] },
  { id: 'visita_inicial', label: 'Visita Inicial', cor: Colors.blue[500] },
  { id: 'levantamento', label: 'Levantamento', cor: Colors.amber[500] },
  { id: 'apresentacao', label: 'Apresentação', cor: Colors.orange[400] },
  { id: 'relacionamento', label: 'Relacionamento', cor: Colors.perfil[400] },
];

const tempConfig = {
  quente: { label: 'Quente', bg: Colors.red[50], text: Colors.red[600], emoji: '🔥' },
  morno: { label: 'Morno', bg: Colors.amber[50], text: Colors.amber[600], emoji: '🌤' },
  frio: { label: 'Frio', bg: Colors.blue[50], text: Colors.blue[600], emoji: '❄' },
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

export default function Prospeccao() {
  const [selected, setSelected] = useState(null);
  const [busca, setBusca] = useState('');

  const filtered = prospeccao.filter((p) => {
    if (!busca) return true;
    const q = busca.toLowerCase();
    return p.nome.toLowerCase().includes(q) || p.fazenda.toLowerCase().includes(q) || p.cidade.toLowerCase().includes(q);
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <MaterialCommunityIcons name="magnify" size={18} color={Colors.gray[400]} />
        <TextInput style={styles.searchInput} placeholder="Buscar prospect..." placeholderTextColor={Colors.gray[400]} value={busca} onChangeText={setBusca} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {filtered.map((p) => {
          const temp = tempConfig[p.temperatura];
          const etapa = etapas.find((e) => e.id === p.etapa);
          return (
            <TouchableOpacity key={p.id} style={[styles.card, { borderLeftWidth: 4, borderLeftColor: etapa?.cor }]} onPress={() => setSelected(p)} activeOpacity={0.7}>
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.nome}>{p.nome}</Text>
                  <Text style={styles.sub}>{p.fazenda} - {p.cidade}/{p.estado}</Text>
                </View>
                <View style={[styles.tempBadge, { backgroundColor: temp.bg }]}>
                  <Text style={{ fontSize: 10 }}>{temp.emoji}</Text>
                  <Text style={[styles.tempText, { color: temp.text }]}>{temp.label}</Text>
                </View>
              </View>
              <PipelineBar etapaId={p.etapa} />
              <View style={styles.actionBox}>
                <Text style={styles.actionText} numberOfLines={1}>{p.proximaAcao}</Text>
                <Text style={styles.actionDate}>{formatDate(p.dataProximaAcao)}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>{p.area.toLocaleString('pt-BR')} ha</Text>
                <Text style={styles.metaText}>{p.responsavel}</Text>
                <Text style={styles.metaText}>{p.interacoes.length} interações</Text>
              </View>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 32 }} />
      </ScrollView>

      <Modal visible={!!selected} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            {selected && (
              <>
                <View style={styles.modalHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalTitle}>{selected.nome}</Text>
                    <Text style={styles.modalSub}>{selected.fazenda} - {selected.cidade}/{selected.estado}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelected(null)}>
                    <MaterialCommunityIcons name="close" size={22} color={Colors.gray[400]} />
                  </TouchableOpacity>
                </View>
                <ScrollView style={{ padding: 20 }}>
                  <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                    <View style={[styles.tempBadge, { backgroundColor: tempConfig[selected.temperatura].bg }]}>
                      <Text style={{ fontSize: 10 }}>{tempConfig[selected.temperatura].emoji}</Text>
                      <Text style={[styles.tempText, { color: tempConfig[selected.temperatura].text }]}>{tempConfig[selected.temperatura].label}</Text>
                    </View>
                    <View style={[styles.tempBadge, { backgroundColor: Colors.gray[100] }]}>
                      <Text style={[styles.tempText, { color: Colors.gray[600] }]}>{selected.origem}</Text>
                    </View>
                  </View>

                  <PipelineBar etapaId={selected.etapa} />
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, marginBottom: 16 }}>
                    {etapas.map((e) => (
                      <Text key={e.id} style={{ fontSize: 8, textAlign: 'center', flex: 1, color: e.id === selected.etapa ? Colors.gray[800] : Colors.gray[400], fontWeight: e.id === selected.etapa ? '700' : '400' }}>
                        {e.label}
                      </Text>
                    ))}
                  </View>

                  <View style={{ gap: 10 }}>
                    {[
                      { l: 'Área', v: `${selected.area.toLocaleString('pt-BR')} ha` },
                      { l: 'Telefone', v: selected.telefone },
                      { l: 'E-mail', v: selected.email },
                      { l: 'Responsável', v: selected.responsavel },
                      { l: 'Primeiro Contato', v: formatDate(selected.dataPrimeiroContato) },
                    ].map((i) => (
                      <View key={i.l}><Text style={styles.dl}>{i.l}</Text><Text style={styles.dv}>{i.v}</Text></View>
                    ))}
                    <View style={styles.actionBoxModal}>
                      <Text style={{ fontSize: 11, fontWeight: '600', color: Colors.amber[700] }}>Próxima Ação</Text>
                      <Text style={{ fontSize: 13, fontWeight: '500', color: Colors.amber[800], marginTop: 2 }}>{selected.proximaAcao}</Text>
                      <Text style={{ fontSize: 11, color: Colors.amber[600], marginTop: 2 }}>{formatDate(selected.dataProximaAcao)}</Text>
                    </View>
                  </View>

                  <Text style={styles.section}>Histórico de Interações</Text>
                  {[...selected.interacoes].reverse().map((inter, i) => (
                    <View key={i} style={styles.timelineRow}>
                      <View style={styles.timelineDot} />
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.gray[700] }}>{inter.tipo}</Text>
                          <Text style={{ fontSize: 10, color: Colors.gray[400] }}>{formatDate(inter.data)}</Text>
                        </View>
                        <Text style={{ fontSize: 12, color: Colors.gray[600], marginTop: 2 }}>{inter.descricao}</Text>
                      </View>
                    </View>
                  ))}

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray[50] },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, margin: Spacing.lg, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: Colors.white, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.gray[200] },
  searchInput: { flex: 1, fontSize: 14, color: Colors.gray[800] },
  content: { paddingHorizontal: Spacing.lg, gap: Spacing.sm },
  card: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.gray[100] },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  nome: { fontSize: FontSize.md, fontWeight: '600', color: Colors.gray[800] },
  sub: { fontSize: 12, color: Colors.gray[500], marginTop: 1 },
  tempBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
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
});
