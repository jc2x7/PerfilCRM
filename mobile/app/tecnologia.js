import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize } from '../src/constants/theme';
import StatusBadge from '../src/components/StatusBadge';
import { tecnologiaAplicacao } from '../src/data/mockData';

const formatDate = (d) => { const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}`; };

const tipoConfig = {
  'Taxa Variável': { icon: 'chart-line', color: Colors.perfil[500] },
  'Mapeamento NDVI': { icon: 'satellite-variant', color: Colors.blue[600] },
  'Mapa de Colheita': { icon: 'map-outline', color: Colors.terra[500] },
  'Prescrição de Sementes': { icon: 'seed-outline', color: Colors.purple[600] },
};

export default function Tecnologia() {
  const [selected, setSelected] = useState(null);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {tecnologiaAplicacao.map((t) => {
          const cfg = tipoConfig[t.tipo] || { icon: 'cog', color: Colors.gray[500] };
          return (
            <TouchableOpacity key={t.id} style={styles.card} onPress={() => setSelected(t)} activeOpacity={0.7}>
              <View style={styles.cardTop}>
                <View style={[styles.icon, { backgroundColor: cfg.color + '15' }]}>
                  <MaterialCommunityIcons name={cfg.icon} size={20} color={cfg.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{t.tipo}</Text>
                  <Text style={styles.sub}>{t.cliente} - {t.fazenda}</Text>
                </View>
                <StatusBadge status={t.status} />
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>{formatDate(t.data)}</Text>
                <Text style={styles.metaText}>{t.area.toLocaleString('pt-BR')} ha</Text>
                {t.produto && <Text style={styles.metaText}>{t.produto}</Text>}
                {t.mapaGerado && (
                  <View style={styles.mapaBadge}>
                    <MaterialCommunityIcons name="check-circle" size={12} color={Colors.perfil[600]} />
                    <Text style={styles.mapaText}>Mapa Gerado</Text>
                  </View>
                )}
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
                  <View>
                    <Text style={styles.modalTitle}>{selected.tipo}</Text>
                    <Text style={styles.modalSub}>{selected.cliente} - {selected.fazenda}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelected(null)}>
                    <MaterialCommunityIcons name="close" size={22} color={Colors.gray[400]} />
                  </TouchableOpacity>
                </View>
                <ScrollView style={{ padding: 20 }}>
                  <StatusBadge status={selected.status} />
                  <View style={{ gap: 12, marginTop: 12 }}>
                    {[
                      { l: 'Data', v: formatDate(selected.data) },
                      { l: 'Área', v: `${selected.area.toLocaleString('pt-BR')} ha` },
                      { l: 'Produto', v: selected.produto || '—' },
                      { l: 'Mapa Gerado', v: selected.mapaGerado ? 'Sim' : 'Não' },
                    ].map((i) => (
                      <View key={i.l}><Text style={styles.dl}>{i.l}</Text><Text style={styles.dv}>{i.v}</Text></View>
                    ))}
                    {selected.taxaMedia && (
                      <>
                        <Text style={styles.section}>Taxas de Aplicação</Text>
                        <View style={styles.grid}>
                          {[
                            { l: 'Média', v: selected.taxaMedia },
                            { l: 'Mínima', v: selected.taxaMinima },
                            { l: 'Máxima', v: selected.taxaMaxima },
                            { l: 'Economia', v: `${selected.economia}%` },
                          ].map((i) => (
                            <View key={i.l} style={styles.gridItem}>
                              <Text style={styles.dl}>{i.l}</Text>
                              <Text style={styles.gridVal}>{i.v}</Text>
                            </View>
                          ))}
                        </View>
                      </>
                    )}
                    <Text style={styles.section}>Observações</Text>
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
  cardTop: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginBottom: 8 },
  icon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: FontSize.md, fontWeight: '600', color: Colors.gray[800] },
  sub: { fontSize: 12, color: Colors.gray[500], marginTop: 1 },
  metaRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' },
  metaText: { fontSize: 11, color: Colors.gray[400] },
  mapaBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: Colors.perfil[50], paddingHorizontal: 6, paddingVertical: 2, borderRadius: 999 },
  mapaText: { fontSize: 10, color: Colors.perfil[600], fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.gray[100] },
  modalTitle: { fontSize: 18, fontWeight: '700', color: Colors.gray[900] },
  modalSub: { fontSize: 13, color: Colors.gray[500] },
  dl: { fontSize: 11, color: Colors.gray[500] },
  dv: { fontSize: 14, fontWeight: '500', color: Colors.gray[800] },
  section: { fontSize: 11, fontWeight: '700', color: Colors.gray[500], textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  gridItem: { width: '47%', backgroundColor: Colors.gray[50], borderRadius: 10, padding: 10 },
  gridVal: { fontSize: 14, fontWeight: '600', color: Colors.gray[800], marginTop: 2 },
  obs: { fontSize: 13, color: Colors.gray[600], lineHeight: 20, backgroundColor: Colors.gray[50], borderRadius: 10, padding: 12 },
});
