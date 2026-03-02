import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize } from '../src/constants/theme';
import { agenda } from '../src/data/mockData';

const tipoConfig = {
  coleta: { label: 'Coleta', color: Colors.perfil[500], bg: Colors.perfil[50], icon: 'flask-outline' },
  regulagem: { label: 'Regulagem', color: Colors.terra[500], bg: Colors.terra[50], icon: 'wrench-outline' },
  tecnologia: { label: 'Tecnologia', color: Colors.blue[600], bg: Colors.blue[50], icon: 'satellite-variant' },
  visita: { label: 'Visita', color: Colors.purple[600], bg: Colors.purple[50], icon: 'account-eye-outline' },
};

const prioridadeCor = { alta: Colors.red[500], media: Colors.amber[500], baixa: Colors.green[500] };

const formatDate = (d) => { const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}`; };

export default function Agenda() {
  const [filtro, setFiltro] = useState('todos');
  const filtros = ['todos', 'coleta', 'regulagem', 'tecnologia', 'visita'];
  const items = filtro === 'todos' ? agenda : agenda.filter((a) => a.tipo === filtro);

  const grouped = {};
  items.forEach((item) => {
    if (!grouped[item.data]) grouped[item.data] = [];
    grouped[item.data].push(item);
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {filtros.map((f) => {
          const active = filtro === f;
          const cfg = tipoConfig[f];
          return (
            <TouchableOpacity
              key={f}
              onPress={() => setFiltro(f)}
              style={[styles.filterBtn, active && { backgroundColor: Colors.perfil[500] }]}
            >
              <Text style={[styles.filterText, active && { color: Colors.white }]}>
                {f === 'todos' ? 'Todos' : cfg?.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Events by date */}
      {Object.entries(grouped).sort().map(([date, events]) => (
        <View key={date}>
          <Text style={styles.dateHeader}>{formatDate(date)}</Text>
          {events.map((ev) => {
            const cfg = tipoConfig[ev.tipo] || {};
            return (
              <View key={ev.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={[styles.tipoBadge, { backgroundColor: cfg.bg }]}>
                    <MaterialCommunityIcons name={cfg.icon || 'circle'} size={14} color={cfg.color} />
                    <Text style={[styles.tipoText, { color: cfg.color }]}>{cfg.label}</Text>
                  </View>
                  <View style={[styles.prioDot, { backgroundColor: prioridadeCor[ev.prioridade] }]} />
                </View>
                <Text style={styles.cardTitle}>{ev.titulo}</Text>
                <Text style={styles.cardSub}>{ev.cliente}</Text>
                <Text style={styles.cardDesc} numberOfLines={2}>{ev.descricao}</Text>
                <View style={styles.cardBottom}>
                  <View style={styles.cardMeta}>
                    <MaterialCommunityIcons name="clock-outline" size={13} color={Colors.gray[400]} />
                    <Text style={styles.metaText}>{ev.horario}</Text>
                  </View>
                  <View style={styles.cardMeta}>
                    <MaterialCommunityIcons name="account-outline" size={13} color={Colors.gray[400]} />
                    <Text style={styles.metaText}>{ev.responsavel}</Text>
                  </View>
                  <View style={[styles.statusBadge, ev.status === 'confirmado' ? styles.statusConfirmado : styles.statusPendente]}>
                    <Text style={ev.status === 'confirmado' ? styles.statusTextOk : styles.statusTextPend}>
                      {ev.status === 'confirmado' ? 'Confirmado' : 'Pendente'}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      ))}
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray[50] },
  content: { padding: Spacing.lg, gap: Spacing.sm },
  filterRow: { gap: 8, paddingBottom: 4 },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.gray[200] },
  filterText: { fontSize: 12, fontWeight: '600', color: Colors.gray[600] },
  dateHeader: { fontSize: FontSize.md, fontWeight: '700', color: Colors.gray[800], marginTop: Spacing.md, marginBottom: 6 },
  card: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.gray[100] },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  tipoBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  tipoText: { fontSize: 11, fontWeight: '600' },
  prioDot: { width: 8, height: 8, borderRadius: 4 },
  cardTitle: { fontSize: FontSize.md, fontWeight: '600', color: Colors.gray[800], marginBottom: 2 },
  cardSub: { fontSize: 12, color: Colors.gray[500], marginBottom: 6 },
  cardDesc: { fontSize: 12, color: Colors.gray[500], lineHeight: 18, marginBottom: 10 },
  cardBottom: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontSize: 11, color: Colors.gray[400] },
  statusBadge: { marginLeft: 'auto', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  statusConfirmado: { backgroundColor: Colors.green[100] },
  statusPendente: { backgroundColor: Colors.gray[100] },
  statusTextOk: { fontSize: 10, fontWeight: '600', color: Colors.green[700] },
  statusTextPend: { fontSize: 10, fontWeight: '600', color: Colors.gray[500] },
});
