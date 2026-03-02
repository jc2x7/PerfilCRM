import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

const statusConfig = {
  concluido: { label: 'Concluído', bg: Colors.green[100], text: Colors.green[700] },
  em_analise: { label: 'Em Análise', bg: Colors.blue[100], text: Colors.blue[700] },
  agendado: { label: 'Agendado', bg: Colors.amber[100], text: Colors.amber[700] },
  em_campo: { label: 'Em Campo', bg: Colors.orange[100], text: Colors.orange[500] },
  em_andamento: { label: 'Em Andamento', bg: Colors.orange[100], text: Colors.orange[500] },
  pendente: { label: 'Pendente', bg: Colors.gray[100], text: Colors.gray[600] },
  confirmado: { label: 'Confirmado', bg: Colors.green[100], text: Colors.green[700] },
  ativo: { label: 'Ativo', bg: Colors.green[100], text: Colors.green[700] },
  inativo: { label: 'Inativo', bg: Colors.red[100], text: Colors.red[600] },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || { label: status, bg: Colors.gray[100], text: Colors.gray[600] };
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.text }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 },
  text: { fontSize: 11, fontWeight: '600' },
});
