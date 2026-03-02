import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize } from '../src/constants/theme';
import StatusBadge from '../src/components/StatusBadge';
import { coletasSolo } from '../src/data/mockData';

const formatDate = (d) => { const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}`; };

export default function ColetaSolo() {
  const [selected, setSelected] = useState(null);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {coletasSolo.map((c) => (
          <TouchableOpacity key={c.id} style={styles.card} onPress={() => setSelected(c)} activeOpacity={0.7}>
            <View style={styles.cardTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{c.cliente}</Text>
                <Text style={styles.sub}>{c.fazenda} - {c.talhao}</Text>
              </View>
              <StatusBadge status={c.status} />
            </View>
            <View style={styles.metaRow}>
              <View style={styles.meta}><MaterialCommunityIcons name="calendar" size={13} color={Colors.gray[400]} /><Text style={styles.metaText}>{formatDate(c.dataColeta)}</Text></View>
              <View style={styles.meta}><MaterialCommunityIcons name="test-tube" size={13} color={Colors.gray[400]} /><Text style={styles.metaText}>{c.amostras} amostras</Text></View>
              <View style={styles.meta}><MaterialCommunityIcons name="arrow-expand-vertical" size={13} color={Colors.gray[400]} /><Text style={styles.metaText}>{c.profundidade}</Text></View>
            </View>
            {c.resultadoLab && (
              <View style={styles.labRow}>
                {[{ l: 'pH', v: c.ph }, { l: 'M.O.', v: c.materiaOrganica }, { l: 'P', v: c.fosforo }, { l: 'K', v: c.potassio }].map((item) => (
                  <View key={item.l} style={styles.labItem}>
                    <Text style={styles.labLabel}>{item.l}</Text>
                    <Text style={styles.labValue}>{item.v}</Text>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>
        ))}
        <View style={{ height: 32 }} />
      </ScrollView>

      <Modal visible={!!selected} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            {selected && (
              <>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalTitle}>{selected.cliente}</Text>
                    <Text style={styles.modalSub}>{selected.fazenda} - {selected.talhao}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelected(null)}>
                    <MaterialCommunityIcons name="close" size={22} color={Colors.gray[400]} />
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.modalBody}>
                  <StatusBadge status={selected.status} />
                  <View style={{ gap: 12, marginTop: 12 }}>
                    {[
                      { l: 'Data Coleta', v: formatDate(selected.dataColeta) },
                      { l: 'Amostras', v: selected.amostras },
                      { l: 'Profundidade', v: selected.profundidade },
                    ].map((i) => (
                      <View key={i.l}>
                        <Text style={styles.detailLabel}>{i.l}</Text>
                        <Text style={styles.detailValue}>{i.v}</Text>
                      </View>
                    ))}
                    {selected.resultadoLab && (
                      <>
                        <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Resultado Laboratorial</Text>
                        <View style={styles.labGrid}>
                          {[
                            { l: 'pH', v: selected.ph, u: '' },
                            { l: 'M.O.', v: selected.materiaOrganica, u: 'g/dm³' },
                            { l: 'Fósforo (P)', v: selected.fosforo, u: 'mg/dm³' },
                            { l: 'Potássio (K)', v: selected.potassio, u: 'mmolc/dm³' },
                          ].map((i) => (
                            <View key={i.l} style={styles.labCard}>
                              <Text style={styles.labCardLabel}>{i.l}</Text>
                              <Text style={styles.labCardValue}>{i.v} <Text style={styles.labCardUnit}>{i.u}</Text></Text>
                            </View>
                          ))}
                        </View>
                      </>
                    )}
                    <Text style={styles.sectionTitle}>Observações</Text>
                    <Text style={styles.obs}>{selected.observacoes}</Text>
                  </View>
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
  content: { padding: Spacing.lg, gap: Spacing.sm },
  card: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.gray[100] },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  title: { fontSize: FontSize.md, fontWeight: '600', color: Colors.gray[800] },
  sub: { fontSize: 12, color: Colors.gray[500], marginTop: 1 },
  metaRow: { flexDirection: 'row', gap: 14, marginBottom: 8, flexWrap: 'wrap' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, color: Colors.gray[500] },
  labRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  labItem: { flex: 1, backgroundColor: Colors.perfil[50], borderRadius: 8, padding: 8, alignItems: 'center' },
  labLabel: { fontSize: 10, color: Colors.gray[500] },
  labValue: { fontSize: 15, fontWeight: '700', color: Colors.perfil[700] },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.gray[100] },
  modalTitle: { fontSize: 18, fontWeight: '700', color: Colors.gray[900] },
  modalSub: { fontSize: 13, color: Colors.gray[500] },
  modalBody: { padding: 20 },
  detailLabel: { fontSize: 11, color: Colors.gray[500] },
  detailValue: { fontSize: 14, fontWeight: '500', color: Colors.gray[800] },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: Colors.gray[500], textTransform: 'uppercase', letterSpacing: 0.5 },
  labGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  labCard: { width: '47%', backgroundColor: Colors.perfil[50], borderRadius: 10, padding: 12, borderWidth: 1, borderColor: Colors.perfil[100] },
  labCardLabel: { fontSize: 11, color: Colors.gray[500] },
  labCardValue: { fontSize: 18, fontWeight: '700', color: Colors.perfil[700], marginTop: 2 },
  labCardUnit: { fontSize: 11, fontWeight: '400', color: Colors.gray[400] },
  obs: { fontSize: 13, color: Colors.gray[600], lineHeight: 20, backgroundColor: Colors.gray[50], borderRadius: 10, padding: 12 },
});
