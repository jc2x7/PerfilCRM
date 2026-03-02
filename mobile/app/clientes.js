import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize } from '../src/constants/theme';
import StatusBadge from '../src/components/StatusBadge';
import { clientes } from '../src/data/mockData';

const formatDate = (d) => { const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}`; };

export default function Clientes() {
  const [busca, setBusca] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = clientes.filter((c) => {
    if (!busca) return true;
    const q = busca.toLowerCase();
    return c.nome.toLowerCase().includes(q) || c.fazenda.toLowerCase().includes(q) || c.cidade.toLowerCase().includes(q);
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <MaterialCommunityIcons name="magnify" size={18} color={Colors.gray[400]} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar produtor, fazenda..."
          placeholderTextColor={Colors.gray[400]}
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {filtered.map((c) => (
          <TouchableOpacity key={c.id} style={styles.card} onPress={() => setSelected(c)} activeOpacity={0.7}>
            <View style={styles.cardTop}>
              <View>
                <Text style={styles.nome}>{c.nome}</Text>
                <Text style={styles.fazenda}>{c.fazenda}</Text>
              </View>
              <StatusBadge status={c.status} />
            </View>
            <View style={styles.infoRow}>
              <View style={styles.info}>
                <MaterialCommunityIcons name="map-marker-outline" size={13} color={Colors.gray[400]} />
                <Text style={styles.infoText}>{c.cidade}/{c.estado}</Text>
              </View>
              <View style={styles.info}>
                <MaterialCommunityIcons name="ruler-square" size={13} color={Colors.gray[400]} />
                <Text style={styles.infoText}>{c.area.toLocaleString('pt-BR')} ha</Text>
              </View>
            </View>
            <View style={styles.culturaRow}>
              {c.culturas.map((cu) => (
                <View key={cu} style={styles.culturaBadge}>
                  <Text style={styles.culturaText}>{cu}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Detail Modal */}
      <Modal visible={!!selected} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            {selected && (
              <>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalTitle}>{selected.nome}</Text>
                    <Text style={styles.modalSub}>{selected.fazenda}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelected(null)}>
                    <MaterialCommunityIcons name="close" size={22} color={Colors.gray[400]} />
                  </TouchableOpacity>
                </View>
                <ScrollView>
                  <View style={styles.modalBody}>
                    <StatusBadge status={selected.status} />
                    {[
                      { icon: 'map-marker', label: 'Localização', value: `${selected.cidade}/${selected.estado}` },
                      { icon: 'ruler-square', label: 'Área', value: `${selected.area.toLocaleString('pt-BR')} ha` },
                      { icon: 'phone-outline', label: 'Telefone', value: selected.telefone },
                      { icon: 'email-outline', label: 'E-mail', value: selected.email },
                      { icon: 'calendar', label: 'Último Serviço', value: formatDate(selected.ultimoServico) },
                    ].map((item) => (
                      <View key={item.label} style={styles.detailRow}>
                        <MaterialCommunityIcons name={item.icon} size={16} color={Colors.gray[400]} />
                        <View>
                          <Text style={styles.detailLabel}>{item.label}</Text>
                          <Text style={styles.detailValue}>{item.value}</Text>
                        </View>
                      </View>
                    ))}
                    <Text style={styles.detailLabel}>Culturas</Text>
                    <View style={styles.culturaRow}>
                      {selected.culturas.map((cu) => (
                        <View key={cu} style={styles.culturaBadge}><Text style={styles.culturaText}>{cu}</Text></View>
                      ))}
                    </View>
                  </View>
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
  fazenda: { fontSize: 12, color: Colors.gray[500], marginTop: 1 },
  infoRow: { flexDirection: 'row', gap: 16, marginBottom: 8 },
  info: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  infoText: { fontSize: 12, color: Colors.gray[500] },
  culturaRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  culturaBadge: { backgroundColor: Colors.perfil[50], paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  culturaText: { fontSize: 11, color: Colors.perfil[700], fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.gray[100] },
  modalTitle: { fontSize: 18, fontWeight: '700', color: Colors.gray[900] },
  modalSub: { fontSize: 13, color: Colors.gray[500] },
  modalBody: { padding: 20, gap: 14 },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  detailLabel: { fontSize: 11, color: Colors.gray[500] },
  detailValue: { fontSize: 14, fontWeight: '500', color: Colors.gray[800] },
});
