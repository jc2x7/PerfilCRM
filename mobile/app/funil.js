import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize } from '../src/constants/theme';
import KpiCard from '../src/components/KpiCard';
import { funilVendas } from '../src/data/mockData';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(v);
const formatDate = (d) => { const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}`; };

const etapas = [
  { id: 'orcamento', label: 'Orçamento', cor: Colors.gray[400] },
  { id: 'proposta_enviada', label: 'Proposta Enviada', cor: Colors.blue[500] },
  { id: 'negociacao', label: 'Negociação', cor: Colors.amber[500] },
  { id: 'fechamento', label: 'Fechamento', cor: Colors.orange[500] },
  { id: 'venda_concluida', label: 'Concluída', cor: Colors.perfil[500] },
];

const probColor = (p) => p >= 70 ? { bg: Colors.green[50], text: Colors.green[700] } : p >= 40 ? { bg: Colors.amber[50], text: Colors.amber[700] } : { bg: Colors.red[50], text: Colors.red[600] };

export default function FunilVendas() {
  const [selected, setSelected] = useState(null);
  const [etapaFiltro, setEtapaFiltro] = useState('todos');

  const filtros = ['todos', ...etapas.map((e) => e.id)];
  const deals = etapaFiltro === 'todos' ? funilVendas : funilVendas.filter((d) => d.etapa === etapaFiltro);

  const totalPipeline = funilVendas.filter((d) => d.etapa !== 'venda_concluida').reduce((s, d) => s + d.valor, 0);
  const totalPonderado = funilVendas.filter((d) => d.etapa !== 'venda_concluida').reduce((s, d) => s + d.valor * d.probabilidade / 100, 0);
  const totalFechado = funilVendas.filter((d) => d.etapa === 'venda_concluida').reduce((s, d) => s + d.valor, 0);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* KPIs */}
        <View style={styles.kpiRow}>
          <KpiCard
            icon={<MaterialCommunityIcons name="target" size={20} color={Colors.blue[600]} />}
            iconBg={Colors.blue[50]} label="Pipeline" value={formatCurrency(totalPipeline)}
          />
          <KpiCard
            icon={<MaterialCommunityIcons name="scale-balance" size={20} color={Colors.purple[600]} />}
            iconBg={Colors.purple[50]} label="Ponderado" value={formatCurrency(totalPonderado)}
          />
        </View>
        <View style={styles.kpiRow}>
          <KpiCard
            icon={<MaterialCommunityIcons name="check-circle-outline" size={20} color={Colors.perfil[600]} />}
            iconBg={Colors.perfil[50]} label="Fechado" value={formatCurrency(totalFechado)}
          />
          <KpiCard
            icon={<MaterialCommunityIcons name="handshake-outline" size={20} color={Colors.amber[600]} />}
            iconBg={Colors.amber[50]} label="Negócios" value={funilVendas.filter((d) => d.etapa !== 'venda_concluida').length}
          />
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {filtros.map((f) => {
            const active = etapaFiltro === f;
            const etapa = etapas.find((e) => e.id === f);
            return (
              <TouchableOpacity key={f} onPress={() => setEtapaFiltro(f)}
                style={[styles.filterBtn, active && { backgroundColor: Colors.perfil[500] }]}>
                {etapa && <View style={[styles.filterDot, { backgroundColor: etapa.cor }]} />}
                <Text style={[styles.filterText, active && { color: Colors.white }]}>
                  {f === 'todos' ? 'Todos' : etapa?.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Deal cards */}
        {deals.map((d) => {
          const etapa = etapas.find((e) => e.id === d.etapa);
          const pc = probColor(d.probabilidade);
          return (
            <TouchableOpacity key={d.id} style={[styles.card, { borderLeftWidth: 4, borderLeftColor: etapa?.cor }]} onPress={() => setSelected(d)} activeOpacity={0.7}>
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.dealTitle} numberOfLines={1}>{d.titulo}</Text>
                  <Text style={styles.dealSub}>{d.cliente} - {d.fazenda}</Text>
                </View>
                <View style={[styles.probBadge, { backgroundColor: pc.bg }]}>
                  <Text style={[styles.probText, { color: pc.text }]}>{d.probabilidade}%</Text>
                </View>
              </View>
              <View style={styles.svcRow}>
                {d.servicos.slice(0, 2).map((s) => (
                  <View key={s} style={styles.svcBadge}><Text style={styles.svcText}>{s}</Text></View>
                ))}
                {d.servicos.length > 2 && <Text style={styles.svcMore}>+{d.servicos.length - 2}</Text>}
              </View>
              <View style={styles.cardBottom}>
                <Text style={styles.dealValor}>{formatCurrency(d.valor)}</Text>
                <Text style={styles.metaText}>{d.responsavel.split(' ')[0]} - {formatDate(d.ultimaInteracao)}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Modal */}
      <Modal visible={!!selected} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            {selected && (
              <>
                <View style={styles.modalHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalTitle}>{selected.titulo}</Text>
                    <Text style={styles.modalSub}>{selected.cliente}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelected(null)}>
                    <MaterialCommunityIcons name="close" size={22} color={Colors.gray[400]} />
                  </TouchableOpacity>
                </View>
                <ScrollView style={{ padding: 20 }}>
                  <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                    <View style={[styles.etapaBadge, { backgroundColor: etapas.find((e) => e.id === selected.etapa)?.cor + '20' }]}>
                      <Text style={{ fontSize: 12, fontWeight: '600', color: etapas.find((e) => e.id === selected.etapa)?.cor }}>
                        {etapas.find((e) => e.id === selected.etapa)?.label}
                      </Text>
                    </View>
                    <View style={[styles.probBadge, { backgroundColor: probColor(selected.probabilidade).bg }]}>
                      <Text style={[styles.probText, { color: probColor(selected.probabilidade).text }]}>{selected.probabilidade}%</Text>
                    </View>
                  </View>

                  <View style={styles.valorRow}>
                    <View style={styles.valorCard}>
                      <Text style={styles.dl}>Valor</Text>
                      <Text style={styles.valorNum}>{formatCurrency(selected.valor)}</Text>
                    </View>
                    <View style={styles.valorCard}>
                      <Text style={styles.dl}>Ponderado</Text>
                      <Text style={[styles.valorNum, { color: Colors.perfil[600] }]}>{formatCurrency(selected.valor * selected.probabilidade / 100)}</Text>
                    </View>
                  </View>

                  <View style={{ gap: 10, marginTop: 12 }}>
                    {[
                      { l: 'Fazenda', v: selected.fazenda },
                      { l: 'Responsável', v: selected.responsavel },
                      { l: 'Abertura', v: formatDate(selected.dataAbertura) },
                      { l: 'Previsão Fech.', v: formatDate(selected.previsaoFechamento) },
                    ].map((i) => (
                      <View key={i.l}><Text style={styles.dl}>{i.l}</Text><Text style={styles.dv}>{i.v}</Text></View>
                    ))}
                    {selected.dataFechamento && (
                      <View><Text style={styles.dl}>Fechamento</Text><Text style={[styles.dv, { color: Colors.perfil[600], fontWeight: '700' }]}>{formatDate(selected.dataFechamento)}</Text></View>
                    )}
                  </View>

                  <Text style={styles.section}>Serviços</Text>
                  <View style={[styles.svcRow, { flexWrap: 'wrap' }]}>
                    {selected.servicos.map((s) => (
                      <View key={s} style={[styles.svcBadge, { backgroundColor: Colors.perfil[50] }]}>
                        <Text style={[styles.svcText, { color: Colors.perfil[700] }]}>{s}</Text>
                      </View>
                    ))}
                  </View>

                  <Text style={styles.section}>Observações</Text>
                  <Text style={styles.obs}>{selected.observacoes}</Text>

                  {selected.etapa !== 'venda_concluida' && (
                    <TouchableOpacity style={styles.advBtn}>
                      <Text style={styles.advBtnText}>Avançar Etapa</Text>
                    </TouchableOpacity>
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
  content: { padding: Spacing.lg, gap: Spacing.md },
  kpiRow: { flexDirection: 'row', gap: Spacing.md },
  filterRow: { gap: 8, paddingBottom: 4 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.gray[200] },
  filterDot: { width: 8, height: 8, borderRadius: 4 },
  filterText: { fontSize: 12, fontWeight: '600', color: Colors.gray[600] },
  card: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.gray[100] },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  dealTitle: { fontSize: FontSize.md, fontWeight: '600', color: Colors.gray[800] },
  dealSub: { fontSize: 12, color: Colors.gray[500], marginTop: 1 },
  probBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  probText: { fontSize: 11, fontWeight: '700' },
  svcRow: { flexDirection: 'row', gap: 4, marginBottom: 8 },
  svcBadge: { backgroundColor: Colors.gray[100], paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  svcText: { fontSize: 10, color: Colors.gray[600] },
  svcMore: { fontSize: 10, color: Colors.gray[400], alignSelf: 'center' },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dealValor: { fontSize: 16, fontWeight: '700', color: Colors.gray[900] },
  metaText: { fontSize: 11, color: Colors.gray[400] },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.gray[100] },
  modalTitle: { fontSize: 18, fontWeight: '700', color: Colors.gray[900] },
  modalSub: { fontSize: 13, color: Colors.gray[500] },
  etapaBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999 },
  valorRow: { flexDirection: 'row', gap: 10 },
  valorCard: { flex: 1, backgroundColor: Colors.gray[50], borderRadius: 10, padding: 12 },
  valorNum: { fontSize: 18, fontWeight: '700', color: Colors.gray[900], marginTop: 2 },
  dl: { fontSize: 11, color: Colors.gray[500] },
  dv: { fontSize: 14, fontWeight: '500', color: Colors.gray[800] },
  section: { fontSize: 11, fontWeight: '700', color: Colors.gray[500], textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 16, marginBottom: 8 },
  obs: { fontSize: 13, color: Colors.gray[600], lineHeight: 20, backgroundColor: Colors.gray[50], borderRadius: 10, padding: 12 },
  advBtn: { backgroundColor: Colors.perfil[500], borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 20 },
  advBtnText: { color: Colors.white, fontWeight: '600', fontSize: 15 },
});
