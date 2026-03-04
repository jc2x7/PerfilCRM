import { useState, useEffect, useCallback } from 'react';
import {
  ScrollView, View, Text, StyleSheet, TouchableOpacity,
  RefreshControl, ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Card from '../src/components/Card';
import KpiCard from '../src/components/KpiCard';
import { Colors, Spacing, BorderRadius, FontSize } from '../src/constants/theme';
import { supabase } from '../src/lib/supabase';

const FASES_CONFIG = {
  primeiro_contato: { label: 'Primeiro Contato', cor: Colors.gray[400] },
  visita_inicial: { label: 'Visita Inicial', cor: Colors.blue[500] },
  levantamento: { label: 'Levantamento', cor: Colors.amber[500] },
  apresentacao: { label: 'Apresentação', cor: Colors.orange[400] },
  relacionamento: { label: 'Relacionamento', cor: Colors.perfil[400] },
  cliente: { label: 'Cliente', cor: Colors.perfil[600] },
};

const TEMP_CONFIG = {
  quente: { icon: 'fire', color: Colors.red[500], bg: Colors.red[50] },
  morno: { icon: 'white-balance-sunny', color: Colors.amber[500], bg: Colors.amber[50] },
  frio: { icon: 'snowflake', color: Colors.blue[500], bg: Colors.blue[50] },
};

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [produtores, setProdutores] = useState([]);
  const [propriedades, setPropriedades] = useState([]);
  const [talhoes, setTalhoes] = useState([]);

  const fetchData = useCallback(async () => {
    const [
      { data: prods },
      { data: props },
      { data: talhs },
    ] = await Promise.all([
      supabase.from('produtores').select('*').order('created_at', { ascending: false }),
      supabase.from('propriedades').select('*'),
      supabase.from('talhoes').select('*'),
    ]);
    setProdutores(prods || []);
    setPropriedades(props || []);
    setTalhoes(talhs || []);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  const onRefresh = () => { setRefreshing(true); fetchData(); };

  // KPIs
  const totalProdutores = produtores.length;
  const clientes = produtores.filter((p) => p.fase_prospeccao === 'cliente').length;
  const prospectos = produtores.filter((p) => p.fase_prospeccao !== 'cliente').length;
  const areaTotal = propriedades.reduce((s, p) => s + (p.area_total_ha || 0), 0);
  const totalTalhoes = talhoes.length;
  const areaTalhoes = talhoes.reduce((s, t) => s + (t.area_ha || 0), 0);

  // Prospectos por fase (excluindo clientes)
  const faseCount = {};
  produtores.forEach((p) => {
    if (p.fase_prospeccao !== 'cliente') {
      faseCount[p.fase_prospeccao] = (faseCount[p.fase_prospeccao] || 0) + 1;
    }
  });

  // Temperatura dos prospectos
  const tempCount = { quente: 0, morno: 0, frio: 0 };
  produtores.forEach((p) => {
    if (p.fase_prospeccao !== 'cliente' && p.temperatura) {
      tempCount[p.temperatura] = (tempCount[p.temperatura] || 0) + 1;
    }
  });

  // Últimos produtores cadastrados
  const recentes = produtores.slice(0, 5);

  // Próximas ações
  const proximasAcoes = produtores
    .filter((p) => p.proxima_acao && p.data_proxima_acao)
    .sort((a, b) => (a.data_proxima_acao || '').localeCompare(b.data_proxima_acao || ''))
    .slice(0, 5);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.perfil[500]} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.perfil[500]} />}
    >
      {/* KPIs */}
      <View style={styles.kpiRow}>
        <KpiCard
          icon={<Feather name="users" size={20} color={Colors.perfil[600]} />}
          iconBg={Colors.perfil[50]}
          label="Total Produtores"
          value={totalProdutores}
        />
        <KpiCard
          icon={<MaterialCommunityIcons name="account-check-outline" size={20} color={Colors.blue[600]} />}
          iconBg={Colors.blue[50]}
          label="Clientes"
          value={clientes}
        />
      </View>
      <View style={styles.kpiRow}>
        <KpiCard
          icon={<MaterialCommunityIcons name="account-search-outline" size={20} color={Colors.amber[600]} />}
          iconBg={Colors.amber[50]}
          label="Prospectos"
          value={prospectos}
        />
        <KpiCard
          icon={<MaterialCommunityIcons name="map-marker-radius" size={20} color={Colors.terra[500]} />}
          iconBg={Colors.terra[50]}
          label="Área Total (ha)"
          value={areaTotal.toLocaleString('pt-BR')}
        />
      </View>
      <View style={styles.kpiRow}>
        <KpiCard
          icon={<MaterialCommunityIcons name="grid" size={20} color={Colors.perfil[500]} />}
          iconBg={Colors.perfil[50]}
          label="Talhões"
          value={totalTalhoes}
        />
        <KpiCard
          icon={<MaterialCommunityIcons name="texture-box" size={20} color={Colors.purple[600]} />}
          iconBg={Colors.purple[50]}
          label="Área Talhões (ha)"
          value={areaTalhoes.toLocaleString('pt-BR')}
        />
      </View>

      {/* Pipeline de Prospecção */}
      <Card>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Pipeline de Prospecção</Text>
          <TouchableOpacity onPress={() => router.push('/prospeccao')}>
            <Text style={styles.linkText}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        {Object.entries(FASES_CONFIG)
          .filter(([id]) => id !== 'cliente')
          .map(([id, config]) => {
            const count = faseCount[id] || 0;
            const maxCount = Math.max(...Object.values(faseCount), 1);
            const pct = (count / maxCount) * 100;
            return (
              <View key={id} style={styles.barRow}>
                <Text style={styles.barLabel} numberOfLines={1}>{config.label}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: config.cor }]} />
                </View>
                <Text style={styles.barValue}>{count}</Text>
              </View>
            );
          })}
      </Card>

      {/* Temperatura dos prospectos */}
      <Card>
        <Text style={styles.cardTitle}>Temperatura dos Prospectos</Text>
        <View style={styles.tempRow}>
          {Object.entries(TEMP_CONFIG).map(([key, cfg]) => (
            <View key={key} style={[styles.tempCard, { backgroundColor: cfg.bg }]}>
              <MaterialCommunityIcons name={cfg.icon} size={22} color={cfg.color} />
              <Text style={[styles.tempValue, { color: cfg.color }]}>{tempCount[key]}</Text>
              <Text style={styles.tempLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Próximas Ações */}
      {proximasAcoes.length > 0 && (
        <Card>
          <Text style={styles.cardTitle}>Próximas Ações</Text>
          {proximasAcoes.map((p, i) => {
            const [y, m, d] = (p.data_proxima_acao || '').split('-');
            return (
              <View key={p.id} style={[styles.actionRow, i < proximasAcoes.length - 1 && styles.actionBorder]}>
                <View style={styles.actionDateBox}>
                  <Text style={styles.actionDay}>{d}</Text>
                  <Text style={styles.actionMonth}>{m}/{y?.slice(2)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.actionName} numberOfLines={1}>{p.nome}</Text>
                  <Text style={styles.actionDesc} numberOfLines={1}>{p.proxima_acao}</Text>
                </View>
                <View style={[styles.actionTempDot, { backgroundColor: (TEMP_CONFIG[p.temperatura] || TEMP_CONFIG.frio).bg }]}>
                  <MaterialCommunityIcons
                    name={(TEMP_CONFIG[p.temperatura] || TEMP_CONFIG.frio).icon}
                    size={12}
                    color={(TEMP_CONFIG[p.temperatura] || TEMP_CONFIG.frio).color}
                  />
                </View>
              </View>
            );
          })}
        </Card>
      )}

      {/* Últimos cadastros */}
      <Card>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Últimos Cadastros</Text>
          <TouchableOpacity onPress={() => router.push('/cadastro-produtor')}>
            <View style={styles.addMini}>
              <MaterialCommunityIcons name="plus" size={14} color={Colors.white} />
            </View>
          </TouchableOpacity>
        </View>
        {recentes.length === 0 ? (
          <View style={styles.emptyMini}>
            <MaterialCommunityIcons name="account-plus-outline" size={32} color={Colors.gray[300]} />
            <Text style={styles.emptyText}>Nenhum produtor cadastrado</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/cadastro-produtor')}>
              <Text style={styles.emptyBtnText}>Cadastrar Produtor</Text>
            </TouchableOpacity>
          </View>
        ) : (
          recentes.map((p, i) => {
            const fase = FASES_CONFIG[p.fase_prospeccao] || FASES_CONFIG.primeiro_contato;
            return (
              <View key={p.id} style={[styles.recentRow, i < recentes.length - 1 && styles.actionBorder]}>
                <View style={[styles.recentAvatar, { backgroundColor: fase.cor + '20' }]}>
                  <Text style={[styles.recentInitial, { color: fase.cor }]}>
                    {p.nome?.charAt(0)?.toUpperCase() || '?'}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.recentName} numberOfLines={1}>{p.nome}</Text>
                  <Text style={styles.recentSub} numberOfLines={1}>
                    {p.cidade ? `${p.cidade}${p.estado ? `/${p.estado}` : ''}` : fase.label}
                  </Text>
                </View>
                <View style={[styles.faseBadge, { backgroundColor: fase.cor + '18' }]}>
                  <Text style={[styles.faseBadgeText, { color: fase.cor }]}>{fase.label}</Text>
                </View>
              </View>
            );
          })
        )}
      </Card>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray[50] },
  content: { padding: Spacing.lg, gap: Spacing.md },
  kpiRow: { flexDirection: 'row', gap: Spacing.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  cardTitle: { fontSize: FontSize.md, fontWeight: '600', color: Colors.gray[800], marginBottom: Spacing.sm },
  linkText: { fontSize: 12, fontWeight: '600', color: Colors.perfil[500] },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  barLabel: { width: 100, fontSize: 12, color: Colors.gray[600] },
  barTrack: { flex: 1, height: 8, borderRadius: 4, backgroundColor: Colors.gray[100] },
  barFill: { height: 8, borderRadius: 4 },
  barValue: { width: 28, textAlign: 'right', fontSize: 12, fontWeight: '700', color: Colors.gray[700] },
  tempRow: { flexDirection: 'row', gap: 10 },
  tempCard: { flex: 1, borderRadius: BorderRadius.lg, padding: 14, alignItems: 'center', gap: 4 },
  tempValue: { fontSize: 24, fontWeight: '700' },
  tempLabel: { fontSize: 11, color: Colors.gray[500] },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  actionBorder: { borderBottomWidth: 1, borderBottomColor: Colors.gray[100] },
  actionDateBox: { width: 40, alignItems: 'center' },
  actionDay: { fontSize: 18, fontWeight: '700', color: Colors.gray[800] },
  actionMonth: { fontSize: 10, color: Colors.gray[400] },
  actionName: { fontSize: 13, fontWeight: '600', color: Colors.gray[800] },
  actionDesc: { fontSize: 11, color: Colors.gray[500], marginTop: 2 },
  actionTempDot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  recentRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  recentAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  recentInitial: { fontSize: 15, fontWeight: '700' },
  recentName: { fontSize: 13, fontWeight: '600', color: Colors.gray[800] },
  recentSub: { fontSize: 11, color: Colors.gray[500], marginTop: 1 },
  faseBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  faseBadgeText: { fontSize: 9, fontWeight: '600' },
  addMini: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.perfil[500], alignItems: 'center', justifyContent: 'center' },
  emptyMini: { alignItems: 'center', paddingVertical: 20, gap: 6 },
  emptyText: { fontSize: 13, color: Colors.gray[400] },
  emptyBtn: { marginTop: 8, backgroundColor: Colors.perfil[500], paddingHorizontal: 16, paddingVertical: 8, borderRadius: BorderRadius.md },
  emptyBtnText: { color: Colors.white, fontWeight: '600', fontSize: 13 },
});
