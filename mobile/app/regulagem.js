import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize } from '../src/constants/theme';
import StatusBadge from '../src/components/StatusBadge';
import { regulagens } from '../src/data/mockData';

const formatDate = (d) => { const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}`; };

const tipoIcon = { Pulverizador: 'spray', Plantadeira: 'seed-outline', Distribuidor: 'truck-delivery-outline' };
const tipoCor = { Pulverizador: Colors.blue[600], Plantadeira: Colors.perfil[500], Distribuidor: Colors.terra[500] };

export default function Regulagem() {
  const [selected, setSelected] = useState(null);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {regulagens.map((r) => (
          <TouchableOpacity key={r.id} style={styles.card} onPress={() => setSelected(r)} activeOpacity={0.7}>
            <View style={styles.cardTop}>
              <View style={[styles.tipoIcon, { backgroundColor: tipoCor[r.tipo] + '15' }]}>
                <MaterialCommunityIcons name={tipoIcon[r.tipo] || 'cog'} size={20} color={tipoCor[r.tipo]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{r.maquina}</Text>
                <Text style={styles.sub}>{r.cliente} - {r.fazenda}</Text>
              </View>
              <StatusBadge status={r.status} />
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>{formatDate(r.data)}</Text>
              <Text style={styles.metaText}>{r.tipo}</Text>
              {r.velocidade && <Text style={styles.metaText}>{r.velocidade} km/h</Text>}
            </View>
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
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalTitle}>{selected.maquina}</Text>
                    <Text style={styles.modalSub}>{selected.cliente}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelected(null)}>
                    <MaterialCommunityIcons name="close" size={22} color={Colors.gray[400]} />
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.modalBody}>
                  <StatusBadge status={selected.status} />
                  <View style={{ gap: 12, marginTop: 12 }}>
                    {[
                      { l: 'Tipo', v: selected.tipo },
                      { l: 'Data', v: formatDate(selected.data) },
                      { l: 'Fazenda', v: selected.fazenda },
                      { l: 'Velocidade', v: selected.velocidade ? `${selected.velocidade} km/h` : '—' },
                    ].map((i) => (
                      <View key={i.l}><Text style={styles.dl}>{i.l}</Text><Text style={styles.dv}>{i.v}</Text></View>
                    ))}

                    {selected.tipo === 'Pulverizador' && (
                      <>
                        <Text style={styles.section}>Dados do Pulverizador</Text>
                        <View style={styles.grid}>
                          {[
                            { l: 'Vazão Desejada', v: `${selected.vazaoDesejada} L/min` },
                            { l: 'Vazão Real', v: selected.vazaoReal ? `${selected.vazaoReal} L/min` : '—' },
                            { l: 'Pressão', v: `${selected.pressao} bar` },
                            { l: 'Bicos', v: selected.pontasBicos },
                            { l: 'Volume Calda', v: selected.volumeCalda },
                            { l: 'Barra', v: `${selected.larguraBarra} m` },
                          ].map((i) => (
                            <View key={i.l} style={styles.gridItem}>
                              <Text style={styles.dl}>{i.l}</Text>
                              <Text style={styles.gridVal}>{i.v}</Text>
                            </View>
                          ))}
                        </View>
                      </>
                    )}

                    {selected.tipo === 'Plantadeira' && (
                      <>
                        <Text style={styles.section}>Dados da Plantadeira</Text>
                        <View style={styles.grid}>
                          {[
                            { l: 'População', v: selected.populacao?.toLocaleString('pt-BR') + ' sem/ha' },
                            { l: 'Espaçamento', v: `${selected.espacamento} m` },
                            { l: 'Profundidade', v: `${selected.profundidade} cm` },
                            { l: 'Discos', v: selected.discosCorte },
                          ].map((i) => (
                            <View key={i.l} style={styles.gridItem}>
                              <Text style={styles.dl}>{i.l}</Text>
                              <Text style={styles.gridVal}>{i.v}</Text>
                            </View>
                          ))}
                        </View>
                      </>
                    )}

                    {selected.tipo === 'Distribuidor' && (
                      <>
                        <Text style={styles.section}>Dados do Distribuidor</Text>
                        <View style={styles.grid}>
                          {[
                            { l: 'Taxa', v: `${selected.taxaAplicacao} kg/ha` },
                            { l: 'Largura', v: `${selected.larguraEfetiva} m` },
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
  tipoIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 13, fontWeight: '600', color: Colors.gray[800] },
  sub: { fontSize: 12, color: Colors.gray[500], marginTop: 1 },
  metaRow: { flexDirection: 'row', gap: 14, flexWrap: 'wrap' },
  metaText: { fontSize: 11, color: Colors.gray[400] },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.gray[100] },
  modalTitle: { fontSize: 16, fontWeight: '700', color: Colors.gray[900] },
  modalSub: { fontSize: 13, color: Colors.gray[500] },
  modalBody: { padding: 20 },
  dl: { fontSize: 11, color: Colors.gray[500] },
  dv: { fontSize: 14, fontWeight: '500', color: Colors.gray[800] },
  section: { fontSize: 11, fontWeight: '700', color: Colors.gray[500], textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  gridItem: { width: '47%', backgroundColor: Colors.gray[50], borderRadius: 10, padding: 10 },
  gridVal: { fontSize: 14, fontWeight: '600', color: Colors.gray[800], marginTop: 2 },
  obs: { fontSize: 13, color: Colors.gray[600], lineHeight: 20, backgroundColor: Colors.gray[50], borderRadius: 10, padding: 12 },
});
