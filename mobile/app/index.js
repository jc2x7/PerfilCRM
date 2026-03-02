import { ScrollView, View, Text, StyleSheet, Dimensions } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import Card from '../src/components/Card';
import KpiCard from '../src/components/KpiCard';
import { Colors, Spacing, BorderRadius, FontSize } from '../src/constants/theme';
import { dashboardStats, faturamentoMensal, agenda, servicosPorTipo } from '../src/data/mockData';

const screenW = Dimensions.get('window').width;

const formatCurrency = (v) => `R$ ${(v / 1000).toFixed(0)}k`;

export default function Dashboard() {
  const nextEvents = agenda.slice(0, 4);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* KPI Row 1 */}
      <View style={styles.kpiRow}>
        <KpiCard
          icon={<Feather name="users" size={20} color={Colors.perfil[600]} />}
          iconBg={Colors.perfil[50]}
          label="Clientes Ativos"
          value={dashboardStats.clientesAtivos}
        />
        <KpiCard
          icon={<Feather name="activity" size={20} color={Colors.blue[600]} />}
          iconBg={Colors.blue[50]}
          label="Serviços/Mês"
          value={dashboardStats.servicosMes}
        />
      </View>
      <View style={styles.kpiRow}>
        <KpiCard
          icon={<MaterialCommunityIcons name="map-marker-radius" size={20} color={Colors.terra[500]} />}
          iconBg={Colors.terra[50]}
          label="Área (ha)"
          value={dashboardStats.areaAtendida.toLocaleString('pt-BR')}
        />
        <KpiCard
          icon={<MaterialCommunityIcons name="flask-outline" size={20} color={Colors.amber[600]} />}
          iconBg={Colors.amber[50]}
          label="Coletas Pend."
          value={dashboardStats.coletasPendentes}
        />
      </View>

      {/* Revenue Chart */}
      <Card style={styles.chartCard}>
        <Text style={styles.chartTitle}>Faturamento Mensal</Text>
        <LineChart
          data={{
            labels: faturamentoMensal.map((f) => f.mes),
            datasets: [{ data: faturamentoMensal.map((f) => f.valor) }],
          }}
          width={screenW - 64}
          height={200}
          yAxisSuffix="k"
          formatYLabel={(v) => `${Math.round(v / 1000)}`}
          chartConfig={{
            backgroundGradientFrom: Colors.white,
            backgroundGradientTo: Colors.white,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(45, 140, 60, ${opacity})`,
            labelColor: () => Colors.gray[400],
            propsForDots: { r: '5', strokeWidth: '2', stroke: Colors.perfil[500] },
            propsForBackgroundLines: { strokeDasharray: '4', stroke: Colors.gray[200] },
          }}
          bezier
          style={styles.chart}
        />
      </Card>

      {/* Services by type */}
      <Card>
        <Text style={styles.chartTitle}>Serviços por Tipo</Text>
        {servicosPorTipo.map((s) => {
          const max = Math.max(...servicosPorTipo.map((x) => x.quantidade));
          const pct = (s.quantidade / max) * 100;
          return (
            <View key={s.nome} style={styles.barRow}>
              <Text style={styles.barLabel}>{s.nome}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: s.cor }]} />
              </View>
              <Text style={styles.barValue}>{s.quantidade}</Text>
            </View>
          );
        })}
      </Card>

      {/* Next events */}
      <Card>
        <Text style={styles.chartTitle}>Próximos Agendamentos</Text>
        {nextEvents.map((ev, i) => {
          const [y, m, d] = ev.data.split('-');
          const tipoColor = {
            coleta: Colors.perfil[500],
            regulagem: Colors.terra[500],
            tecnologia: Colors.blue[500],
            visita: Colors.purple[500],
          };
          return (
            <View key={ev.id} style={[styles.eventRow, i < nextEvents.length - 1 && styles.eventBorder]}>
              <View style={[styles.eventDot, { backgroundColor: tipoColor[ev.tipo] || Colors.gray[400] }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.eventTitle} numberOfLines={1}>{ev.titulo}</Text>
                <Text style={styles.eventSub}>{ev.cliente} - {ev.horario}</Text>
              </View>
              <Text style={styles.eventDate}>{d}/{m}</Text>
            </View>
          );
        })}
      </Card>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray[50] },
  content: { padding: Spacing.lg, gap: Spacing.md },
  kpiRow: { flexDirection: 'row', gap: Spacing.md },
  chartCard: { paddingHorizontal: Spacing.sm },
  chartTitle: { fontSize: FontSize.md, fontWeight: '600', color: Colors.gray[800], marginBottom: Spacing.md, paddingHorizontal: Spacing.sm },
  chart: { borderRadius: BorderRadius.lg, marginLeft: -8 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  barLabel: { width: 100, fontSize: 12, color: Colors.gray[600] },
  barTrack: { flex: 1, height: 8, borderRadius: 4, backgroundColor: Colors.gray[100] },
  barFill: { height: 8, borderRadius: 4 },
  barValue: { width: 28, textAlign: 'right', fontSize: 12, fontWeight: '700', color: Colors.gray[700] },
  eventRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  eventBorder: { borderBottomWidth: 1, borderBottomColor: Colors.gray[100] },
  eventDot: { width: 8, height: 8, borderRadius: 4 },
  eventTitle: { fontSize: 13, fontWeight: '600', color: Colors.gray[800] },
  eventSub: { fontSize: 11, color: Colors.gray[500], marginTop: 2 },
  eventDate: { fontSize: 12, fontWeight: '600', color: Colors.gray[400] },
});
