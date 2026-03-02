import { ScrollView, View, Text, StyleSheet, Dimensions } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { BarChart, LineChart } from 'react-native-chart-kit';
import Card from '../src/components/Card';
import KpiCard from '../src/components/KpiCard';
import { Colors, Spacing, BorderRadius, FontSize } from '../src/constants/theme';
import { clientes, coletasSolo, regulagens, tecnologiaAplicacao, faturamentoMensal, servicosPorTipo } from '../src/data/mockData';

const screenW = Dimensions.get('window').width;

const formatCurrency = (v) => `R$ ${(v / 1000).toFixed(0)}k`;

export default function Relatorios() {
  const totalArea = clientes.reduce((s, c) => s + c.area, 0);
  const totalAmostras = coletasSolo.reduce((s, c) => s + c.amostras, 0);

  const chartConfig = {
    backgroundGradientFrom: Colors.white,
    backgroundGradientTo: Colors.white,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(45, 140, 60, ${opacity})`,
    labelColor: () => Colors.gray[400],
    propsForBackgroundLines: { strokeDasharray: '4', stroke: Colors.gray[200] },
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* KPIs */}
      <View style={styles.kpiRow}>
        <KpiCard icon={<Feather name="users" size={18} color={Colors.perfil[600]} />} iconBg={Colors.perfil[50]} label="Produtores" value={clientes.length} />
        <KpiCard icon={<MaterialCommunityIcons name="map-marker-radius" size={18} color={Colors.terra[500]} />} iconBg={Colors.terra[50]} label="Hectares" value={totalArea.toLocaleString('pt-BR')} />
      </View>
      <View style={styles.kpiRow}>
        <KpiCard icon={<MaterialCommunityIcons name="flask" size={18} color={Colors.blue[600]} />} iconBg={Colors.blue[50]} label="Amostras" value={totalAmostras} />
        <KpiCard icon={<MaterialCommunityIcons name="chart-line" size={18} color={Colors.purple[600]} />} iconBg={Colors.purple[50]} label="Mapas" value={tecnologiaAplicacao.filter((t) => t.mapaGerado).length} />
      </View>

      {/* Revenue Chart */}
      <Card>
        <Text style={styles.chartTitle}>Faturamento Mensal</Text>
        <BarChart
          data={{
            labels: faturamentoMensal.map((f) => f.mes),
            datasets: [{ data: faturamentoMensal.map((f) => f.valor / 1000) }],
          }}
          width={screenW - 64}
          height={200}
          yAxisSuffix="k"
          chartConfig={{ ...chartConfig, barPercentage: 0.6 }}
          style={{ borderRadius: BorderRadius.lg, marginLeft: -16 }}
          showValuesOnTopOfBars
        />
      </Card>

      {/* Services */}
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

      {/* Producer summary */}
      <Card>
        <Text style={styles.chartTitle}>Resumo por Produtor</Text>
        {clientes.filter((c) => c.status === 'ativo').map((c) => {
          const nCol = coletasSolo.filter((col) => col.clienteId === c.id).length;
          const nReg = regulagens.filter((r) => r.clienteId === c.id).length;
          const nTec = tecnologiaAplicacao.filter((t) => t.clienteId === c.id).length;
          return (
            <View key={c.id} style={styles.prodRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.prodName}>{c.nome}</Text>
                <Text style={styles.prodFarm}>{c.fazenda}</Text>
              </View>
              <View style={styles.prodStats}>
                <View style={[styles.prodBadge, nCol > 0 ? styles.prodBadgeGreen : styles.prodBadgeGray]}>
                  <Text style={nCol > 0 ? styles.prodBadgeTextGreen : styles.prodBadgeTextGray}>{nCol}</Text>
                </View>
                <View style={[styles.prodBadge, nReg > 0 ? styles.prodBadgeOrange : styles.prodBadgeGray]}>
                  <Text style={nReg > 0 ? styles.prodBadgeTextOrange : styles.prodBadgeTextGray}>{nReg}</Text>
                </View>
                <View style={[styles.prodBadge, nTec > 0 ? styles.prodBadgeBlue : styles.prodBadgeGray]}>
                  <Text style={nTec > 0 ? styles.prodBadgeTextBlue : styles.prodBadgeTextGray}>{nTec}</Text>
                </View>
              </View>
            </View>
          );
        })}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: Colors.perfil[500] }]} /><Text style={styles.legendText}>Coletas</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: Colors.terra[500] }]} /><Text style={styles.legendText}>Regulagens</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: Colors.blue[500] }]} /><Text style={styles.legendText}>Tec. Aplicação</Text></View>
        </View>
      </Card>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray[50] },
  content: { padding: Spacing.lg, gap: Spacing.md },
  kpiRow: { flexDirection: 'row', gap: Spacing.md },
  chartTitle: { fontSize: FontSize.md, fontWeight: '600', color: Colors.gray[800], marginBottom: Spacing.md },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  barLabel: { width: 100, fontSize: 12, color: Colors.gray[600] },
  barTrack: { flex: 1, height: 8, borderRadius: 4, backgroundColor: Colors.gray[100] },
  barFill: { height: 8, borderRadius: 4 },
  barValue: { width: 28, textAlign: 'right', fontSize: 12, fontWeight: '700', color: Colors.gray[700] },
  prodRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.gray[100] },
  prodName: { fontSize: 13, fontWeight: '600', color: Colors.gray[800] },
  prodFarm: { fontSize: 11, color: Colors.gray[500] },
  prodStats: { flexDirection: 'row', gap: 6 },
  prodBadge: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  prodBadgeGreen: { backgroundColor: Colors.perfil[50] },
  prodBadgeOrange: { backgroundColor: Colors.terra[50] },
  prodBadgeBlue: { backgroundColor: Colors.blue[50] },
  prodBadgeGray: { backgroundColor: Colors.gray[100] },
  prodBadgeTextGreen: { fontSize: 11, fontWeight: '700', color: Colors.perfil[700] },
  prodBadgeTextOrange: { fontSize: 11, fontWeight: '700', color: Colors.terra[700] },
  prodBadgeTextBlue: { fontSize: 11, fontWeight: '700', color: Colors.blue[700] },
  prodBadgeTextGray: { fontSize: 11, fontWeight: '700', color: Colors.gray[400] },
  legendRow: { flexDirection: 'row', gap: 16, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 10, color: Colors.gray[500] },
});
