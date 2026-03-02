import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize } from '../src/constants/theme';
import KpiCard from '../src/components/KpiCard';
import { analisesSolo } from '../src/data/mockData';
import { interpretarAnalise, nivelCores } from '../src/data/interpretacaoSolo';

const formatDate = (d) => { if (!d) return '—'; const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}`; };

const rnNivelCores = {
  muito_baixo: { bg: Colors.red[100], text: Colors.red[700], bar: Colors.red[500] },
  baixo: { bg: Colors.orange[100], text: '#9a3412', bar: Colors.orange[400] },
  medio: { bg: Colors.amber[100], text: Colors.amber[700], bar: Colors.amber[500] },
  adequado: { bg: Colors.green[100], text: Colors.green[700], bar: Colors.green[500] },
  alto: { bg: Colors.blue[100], text: Colors.blue[700], bar: Colors.blue[500] },
};

function NivelBar({ classificacao }) {
  if (!classificacao) return null;
  const cores = rnNivelCores[classificacao.nivel];
  const nivelMap = { muito_baixo: 1, baixo: 2, medio: 3, adequado: 4, alto: 5 };
  const pos = nivelMap[classificacao.nivel] || 0;
  return (
    <View style={styles.nivelRow}>
      <View style={styles.nivelBars}>
        {[1, 2, 3, 4, 5].map((i) => (
          <View key={i} style={[styles.nivelSeg, { backgroundColor: i <= pos ? cores.bar : Colors.gray[200] }]} />
        ))}
      </View>
      <View style={[styles.nivelBadge, { backgroundColor: cores.bg }]}>
        <Text style={[styles.nivelText, { color: cores.text }]}>{classificacao.label}</Text>
      </View>
    </View>
  );
}

function ParamCard({ label, valor, unidade, classificacao }) {
  if (valor == null) return null;
  const cores = classificacao ? rnNivelCores[classificacao.nivel] : null;
  return (
    <View style={[styles.paramCard, cores && { backgroundColor: cores.bg, borderColor: cores.bg }]}>
      <Text style={styles.paramLabel}>{label}</Text>
      <Text style={[styles.paramVal, cores && { color: cores.text }]}>
        {typeof valor === 'number' ? valor.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) : valor}
        {unidade ? <Text style={styles.paramUnit}> {unidade}</Text> : null}
      </Text>
      {classificacao && <Text style={[styles.paramClass, { color: cores.text }]}>{classificacao.label}</Text>}
    </View>
  );
}

function LaudoModal({ analise, onClose }) {
  if (!analise) return null;
  const interp = interpretarAnalise(analise);
  const temResultado = analise.phCaCl2 != null;

  return (
    <Modal visible animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.modalTitle}>Laudo de Análise</Text>
              <Text style={styles.modalSub}>{analise.cliente} - {analise.fazenda}</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={22} color={Colors.gray[400]} />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ padding: 20 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              {[
                { l: 'Talhão', v: analise.talhao },
                { l: 'Coleta', v: formatDate(analise.dataColeta) },
                { l: 'Lab', v: analise.laboratorio },
                { l: 'Prof.', v: analise.profundidade },
              ].map((i) => (
                <View key={i.l}><Text style={styles.dl}>{i.l}</Text><Text style={styles.dv}>{i.v}</Text></View>
              ))}
            </View>

            {!temResultado ? (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <MaterialCommunityIcons name="flask-empty-outline" size={48} color={Colors.gray[300]} />
                <Text style={{ color: Colors.gray[500], marginTop: 8 }}>Aguardando resultado</Text>
              </View>
            ) : (
              <>
                {/* Summary */}
                <View style={styles.summaryBox}>
                  <Text style={styles.sectionTitle}>Resumo</Text>
                  {[
                    { l: 'pH (CaCl₂)', v: analise.phCaCl2, c: interp.phCaCl2 },
                    { l: 'V%', v: `${analise.saturacaoBases}%`, c: interp.saturacaoBases },
                    { l: 'M.O.', v: `${analise.materiaOrganica} g/dm³`, c: interp.materiaOrganica },
                    { l: 'CTC', v: `${analise.ctc}`, c: interp.ctc },
                    { l: 'P', v: `${analise.fosforo} mg/dm³`, c: interp.fosforo },
                    { l: 'K', v: `${analise.potassio} mmolc/dm³`, c: interp.potassio },
                  ].map((item) => (
                    <View key={item.l} style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>{item.l}</Text>
                      <Text style={styles.summaryVal}>{item.v}</Text>
                      <View style={{ flex: 1 }}><NivelBar classificacao={item.c} /></View>
                    </View>
                  ))}
                </View>

                {/* Alerts */}
                {(() => {
                  const alerts = [];
                  if (interp.phCaCl2?.nivel === 'muito_baixo' || interp.phCaCl2?.nivel === 'baixo')
                    alerts.push({ t: 'danger', m: `pH ácido (${analise.phCaCl2}). Necessita calagem.` });
                  if (interp.saturacaoBases?.nivel === 'muito_baixo' || interp.saturacaoBases?.nivel === 'baixo')
                    alerts.push({ t: 'danger', m: `V% baixa (${analise.saturacaoBases}%). Corrigir com calagem.` });
                  if (interp.fosforo?.nivel === 'muito_baixo' || interp.fosforo?.nivel === 'baixo')
                    alerts.push({ t: 'warning', m: `P baixo (${analise.fosforo} mg/dm³). Adubação fosfatada.` });
                  if (alerts.length === 0) alerts.push({ t: 'ok', m: 'Solo em boas condições gerais.' });

                  const alertColors = { danger: Colors.red, warning: Colors.amber, ok: Colors.green };
                  return alerts.map((a, i) => (
                    <View key={i} style={[styles.alertBox, { backgroundColor: alertColors[a.t][50], borderColor: alertColors[a.t][100] }]}>
                      <MaterialCommunityIcons name={a.t === 'ok' ? 'check-circle' : 'alert-circle'} size={16} color={alertColors[a.t][600]} />
                      <Text style={[styles.alertText, { color: Colors.gray[700] }]}>{a.m}</Text>
                    </View>
                  ));
                })()}

                {/* Texture bar */}
                <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Textura do Solo</Text>
                <View style={styles.textureBar}>
                  <View style={[styles.texSeg, { flex: analise.argila, backgroundColor: Colors.terra[500] }]}>
                    <Text style={styles.texSegText}>{analise.argila}%</Text>
                  </View>
                  <View style={[styles.texSeg, { flex: analise.silte, backgroundColor: Colors.terra[300] }]}>
                    <Text style={[styles.texSegText, { color: Colors.terra[700] }]}>{analise.silte}%</Text>
                  </View>
                  <View style={[styles.texSeg, { flex: analise.areia, backgroundColor: Colors.amber[100] }]}>
                    <Text style={[styles.texSegText, { color: Colors.amber[700] }]}>{analise.areia}%</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 6, marginBottom: 12 }}>
                  {[{ l: 'Argila', c: Colors.terra[500] }, { l: 'Silte', c: Colors.terra[300] }, { l: 'Areia', c: Colors.amber[100] }].map((i) => (
                    <View key={i.l} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: i.c }} />
                      <Text style={{ fontSize: 10, color: Colors.gray[500] }}>{i.l}</Text>
                    </View>
                  ))}
                </View>

                {/* Macro */}
                <Text style={styles.sectionTitle}>Macronutrientes</Text>
                <View style={styles.paramGrid}>
                  <ParamCard label="P" valor={analise.fosforo} unidade="mg/dm³" classificacao={interp.fosforo} />
                  <ParamCard label="K⁺" valor={analise.potassio} unidade="mmolc" classificacao={interp.potassio} />
                  <ParamCard label="Ca²⁺" valor={analise.calcio} unidade="mmolc" classificacao={interp.calcio} />
                  <ParamCard label="Mg²⁺" valor={analise.magnesio} unidade="mmolc" classificacao={interp.magnesio} />
                  <ParamCard label="S" valor={analise.enxofre} unidade="mg/dm³" classificacao={interp.enxofre} />
                </View>

                {/* Micro */}
                <Text style={styles.sectionTitle}>Micronutrientes</Text>
                <View style={styles.paramGrid}>
                  <ParamCard label="B" valor={analise.boro} unidade="mg/dm³" classificacao={interp.boro} />
                  <ParamCard label="Cu" valor={analise.cobre} unidade="mg/dm³" classificacao={interp.cobre} />
                  <ParamCard label="Fe" valor={analise.ferro} unidade="mg/dm³" classificacao={interp.ferro} />
                  <ParamCard label="Mn" valor={analise.manganes} unidade="mg/dm³" classificacao={interp.manganes} />
                  <ParamCard label="Zn" valor={analise.zinco} unidade="mg/dm³" classificacao={interp.zinco} />
                </View>

                {/* Complex */}
                <Text style={styles.sectionTitle}>Complexo Sortivo</Text>
                <View style={styles.paramGrid}>
                  <ParamCard label="CTC" valor={analise.ctc} unidade="mmolc" classificacao={interp.ctc} />
                  <ParamCard label="V%" valor={analise.saturacaoBases} unidade="%" classificacao={interp.saturacaoBases} />
                  <ParamCard label="m%" valor={analise.saturacaoAluminio} unidade="%" classificacao={interp.saturacaoAluminio} />
                  <ParamCard label="Ca/Mg" valor={analise.relCaMg} classificacao={interp.relCaMg} />
                </View>

                {/* Legend */}
                <View style={styles.legend}>
                  {[{ n: 'muito_baixo', l: 'Muito Baixo' }, { n: 'baixo', l: 'Baixo' }, { n: 'medio', l: 'Médio' }, { n: 'adequado', l: 'Adequado' }, { n: 'alto', l: 'Alto' }].map((i) => (
                    <View key={i.n} style={[styles.legendBadge, { backgroundColor: rnNivelCores[i.n].bg }]}>
                      <Text style={[styles.legendText, { color: rnNivelCores[i.n].text }]}>{i.l}</Text>
                    </View>
                  ))}
                </View>
                <Text style={{ fontSize: 9, color: Colors.gray[400], marginTop: 4 }}>Ref: Boletim 100 IAC / EMBRAPA Cerrados</Text>
              </>
            )}

            {analise.observacoes && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Observações</Text>
                <Text style={styles.obs}>{analise.observacoes}</Text>
              </>
            )}
            <View style={{ height: 32 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function AnaliseSolo() {
  const [selected, setSelected] = useState(null);
  const [busca, setBusca] = useState('');

  const filtered = analisesSolo.filter((a) => {
    if (!busca) return true;
    const q = busca.toLowerCase();
    return a.cliente.toLowerCase().includes(q) || a.fazenda.toLowerCase().includes(q) || a.talhao.toLowerCase().includes(q);
  });

  const comResultado = analisesSolo.filter((a) => a.phCaCl2 != null);
  const comAlerta = comResultado.filter((a) => {
    const interp = interpretarAnalise(a);
    return interp && [interp.phCaCl2, interp.saturacaoBases, interp.fosforo].some((c) => c && (c.nivel === 'muito_baixo' || c.nivel === 'baixo'));
  });

  return (
    <View style={styles.container}>
      {/* KPIs */}
      <View style={{ padding: Spacing.lg, gap: Spacing.md }}>
        <View style={styles.kpiRow}>
          <KpiCard icon={<MaterialCommunityIcons name="flask" size={20} color={Colors.perfil[600]} />} iconBg={Colors.perfil[50]} label="Total" value={analisesSolo.length} />
          <KpiCard icon={<MaterialCommunityIcons name="check-circle" size={20} color={Colors.green[600]} />} iconBg={Colors.green[50]} label="Resultado" value={comResultado.length} />
        </View>
        <View style={styles.kpiRow}>
          <KpiCard icon={<MaterialCommunityIcons name="alert" size={20} color={Colors.amber[600]} />} iconBg={Colors.amber[50]} label="Alertas" value={comAlerta.length} />
          <KpiCard icon={<MaterialCommunityIcons name="test-tube" size={20} color={Colors.blue[600]} />} iconBg={Colors.blue[50]} label="Aguardando" value={analisesSolo.length - comResultado.length} />
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <MaterialCommunityIcons name="magnify" size={18} color={Colors.gray[400]} />
        <TextInput style={styles.searchInput} placeholder="Buscar análise..." placeholderTextColor={Colors.gray[400]} value={busca} onChangeText={setBusca} />
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {filtered.map((a) => {
          const temRes = a.phCaCl2 != null;
          const interp = interpretarAnalise(a);
          let alertCount = 0;
          if (interp) {
            alertCount = [interp.phCaCl2, interp.saturacaoBases, interp.saturacaoAluminio, interp.fosforo, interp.potassio]
              .filter((c) => c && (c.nivel === 'muito_baixo' || c.nivel === 'baixo')).length;
          }
          return (
            <TouchableOpacity key={a.id} style={[styles.card, { borderLeftWidth: 4, borderLeftColor: Colors.perfil[500] }]} onPress={() => setSelected(a)} activeOpacity={0.7}>
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{a.cliente}</Text>
                  <Text style={styles.cardSub}>{a.fazenda} - {a.talhao}</Text>
                </View>
                {temRes ? (
                  alertCount > 0 ? (
                    <View style={[styles.badge, { backgroundColor: Colors.red[100] }]}><Text style={[styles.badgeText, { color: Colors.red[600] }]}>{alertCount} alerta{alertCount > 1 ? 's' : ''}</Text></View>
                  ) : (
                    <View style={[styles.badge, { backgroundColor: Colors.green[100] }]}><Text style={[styles.badgeText, { color: Colors.green[700] }]}>OK</Text></View>
                  )
                ) : (
                  <View style={[styles.badge, { backgroundColor: Colors.amber[100] }]}><Text style={[styles.badgeText, { color: Colors.amber[700] }]}>Aguardando</Text></View>
                )}
              </View>
              <Text style={{ fontSize: 11, color: Colors.gray[400], marginBottom: 8 }}>Coleta: {formatDate(a.dataColeta)} - {a.laboratorio}</Text>
              {temRes && (
                <View style={styles.quickRow}>
                  {[{ l: 'pH', v: a.phCaCl2, c: interp.phCaCl2 }, { l: 'V%', v: a.saturacaoBases, c: interp.saturacaoBases }, { l: 'P', v: a.fosforo, c: interp.fosforo }, { l: 'K', v: a.potassio, c: interp.potassio }].map((item) => {
                    const cor = rnNivelCores[item.c?.nivel] || rnNivelCores.medio;
                    return (
                      <View key={item.l} style={[styles.quickItem, { backgroundColor: cor.bg }]}>
                        <Text style={{ fontSize: 9, color: Colors.gray[500] }}>{item.l}</Text>
                        <Text style={[styles.quickVal, { color: cor.text }]}>{item.v}</Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 32 }} />
      </ScrollView>

      {selected && <LaudoModal analise={selected} onClose={() => setSelected(null)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray[50] },
  kpiRow: { flexDirection: 'row', gap: Spacing.md },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: Spacing.lg, marginBottom: Spacing.md, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: Colors.white, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.gray[200] },
  searchInput: { flex: 1, fontSize: 14, color: Colors.gray[800] },
  list: { paddingHorizontal: Spacing.lg, gap: Spacing.sm },
  card: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.gray[100] },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  cardTitle: { fontSize: FontSize.md, fontWeight: '600', color: Colors.gray[800] },
  cardSub: { fontSize: 12, color: Colors.gray[500], marginTop: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  badgeText: { fontSize: 10, fontWeight: '600' },
  quickRow: { flexDirection: 'row', gap: 6 },
  quickItem: { flex: 1, borderRadius: 8, padding: 6, alignItems: 'center' },
  quickVal: { fontSize: 14, fontWeight: '700', marginTop: 1 },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '92%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.gray[100] },
  modalTitle: { fontSize: 18, fontWeight: '700', color: Colors.gray[900] },
  modalSub: { fontSize: 13, color: Colors.gray[500] },
  dl: { fontSize: 11, color: Colors.gray[500] },
  dv: { fontSize: 14, fontWeight: '500', color: Colors.gray[800] },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: Colors.gray[500], textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  summaryBox: { backgroundColor: Colors.gray[50], borderRadius: 12, padding: 12, marginBottom: 12 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  summaryLabel: { fontSize: 12, color: Colors.gray[600], fontWeight: '500', width: 55 },
  summaryVal: { fontSize: 12, color: Colors.gray[800], fontWeight: '600', width: 70, textAlign: 'right' },
  nivelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  nivelBars: { flexDirection: 'row', gap: 2, flex: 1 },
  nivelSeg: { flex: 1, height: 6, borderRadius: 3 },
  nivelBadge: { paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4 },
  nivelText: { fontSize: 8, fontWeight: '700' },
  alertBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 10, borderRadius: 10, borderWidth: 1, marginBottom: 6 },
  alertText: { fontSize: 12, flex: 1, lineHeight: 18 },
  textureBar: { flexDirection: 'row', height: 16, borderRadius: 8, overflow: 'hidden' },
  texSeg: { justifyContent: 'center', alignItems: 'center' },
  texSegText: { fontSize: 8, fontWeight: '700', color: Colors.white },
  paramGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  paramCard: { width: '31%', borderRadius: 10, padding: 8, borderWidth: 1, borderColor: Colors.gray[200], backgroundColor: Colors.gray[50] },
  paramLabel: { fontSize: 9, color: Colors.gray[500], textTransform: 'uppercase', fontWeight: '600' },
  paramVal: { fontSize: 15, fontWeight: '700', color: Colors.gray[800], marginTop: 2 },
  paramUnit: { fontSize: 9, fontWeight: '400', color: Colors.gray[400] },
  paramClass: { fontSize: 8, fontWeight: '600', marginTop: 2 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 12 },
  legendBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  legendText: { fontSize: 9, fontWeight: '600' },
  obs: { fontSize: 13, color: Colors.gray[600], lineHeight: 20, backgroundColor: Colors.gray[50], borderRadius: 10, padding: 12 },
});
