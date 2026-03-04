import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { Colors } from '../src/constants/theme';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import LoginScreen from '../src/screens/LoginScreen';

function DrawerHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.logoWrap}>
        <MaterialCommunityIcons name="leaf" size={24} color={Colors.perfil[600]} />
      </View>
      <View>
        <Text style={styles.headerTitle}>Perfil</Text>
        <Text style={styles.headerSub}>Soluções Agronômicas</Text>
      </View>
    </View>
  );
}

function DrawerFooter() {
  const { user, signOut } = useAuth();
  const nome = user?.user_metadata?.nome || user?.email?.split('@')[0] || 'Usuário';
  const initials = nome.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <View style={styles.footer}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.footerName} numberOfLines={1}>{nome}</Text>
        <Text style={styles.footerRole}>{user?.email}</Text>
      </View>
      <TouchableOpacity onPress={signOut} style={{ padding: 4 }}>
        <MaterialCommunityIcons name="logout" size={20} color={Colors.perfil[300]} />
      </TouchableOpacity>
    </View>
  );
}

function SectionLabel({ title }) {
  return (
    <View style={styles.sectionLabelWrap}>
      <Text style={styles.sectionLabel}>{title}</Text>
    </View>
  );
}

function CustomDrawerContent(props) {
  const { state, descriptors, navigation } = props;

  const sections = [
    { label: null, indices: [0, 1] },
    { label: 'Comercial', indices: [2, 3, 4] },
    { label: 'Serviços', indices: [5, 6, 7] },
    { label: 'Gestão', indices: [8, 9] },
  ];

  return (
    <View style={styles.drawerContainer}>
      <DrawerHeader />
      <View style={styles.drawerScroll}>
        {sections.map((section, si) => (
          <View key={si} style={si > 0 ? { marginTop: 12 } : undefined}>
            {section.label && <SectionLabel title={section.label} />}
            {section.indices.map((i) => {
              const route = state.routes[i];
              if (!route) return null;
              const { options } = descriptors[route.key];
              const isFocused = state.index === i;
              return (
                <View key={route.key}
                  style={[styles.drawerItem, isFocused && styles.drawerItemActive]}
                >
                  <Text
                    onPress={() => navigation.navigate(route.name)}
                    style={[styles.drawerItemInner]}
                  >
                    <View style={styles.drawerItemRow}>
                      {options.drawerIcon?.({ color: isFocused ? Colors.white : Colors.perfil[100], size: 20 })}
                      <Text style={[styles.drawerLabel, isFocused && styles.drawerLabelActive]}>
                        {options.drawerLabel || options.title || route.name}
                      </Text>
                    </View>
                  </Text>
                </View>
              );
            })}
          </View>
        ))}
      </View>
      <DrawerFooter />
    </View>
  );
}

function AppContent() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.perfil[700] }}>
        <ActivityIndicator size="large" color={Colors.white} />
      </View>
    );
  }

  if (!session) {
    return <LoginScreen />;
  }

  const screenOpts = {
    headerStyle: { backgroundColor: Colors.white },
    headerTintColor: Colors.gray[800],
    headerTitleStyle: { fontWeight: '600', fontSize: 17 },
    headerShadowVisible: false,
    headerLeftContainerStyle: { paddingLeft: 8 },
  };

  const icon = (name, lib = 'mci') => ({ color, size }) => {
    if (lib === 'ion') return <Ionicons name={name} size={size} color={color} />;
    if (lib === 'feather') return <Feather name={name} size={size} color={color} />;
    return <MaterialCommunityIcons name={name} size={size} color={color} />;
  };

  return (
    <Drawer
      drawerContent={CustomDrawerContent}
      screenOptions={{
        ...screenOpts,
        drawerStyle: { backgroundColor: Colors.perfil[700], width: 280 },
        drawerActiveTintColor: Colors.white,
        drawerInactiveTintColor: Colors.perfil[100],
      }}
    >
      <Drawer.Screen name="index" options={{ title: 'Dashboard', drawerLabel: 'Dashboard', drawerIcon: icon('view-dashboard-outline') }} />
      <Drawer.Screen name="agenda" options={{ title: 'Agenda', drawerLabel: 'Agenda', drawerIcon: icon('calendar-month-outline') }} />
      <Drawer.Screen name="prospeccao" options={{ title: 'Prospecção', drawerLabel: 'Prospecção', drawerIcon: icon('account-plus-outline') }} />
      <Drawer.Screen name="funil" options={{ title: 'Funil de Vendas', drawerLabel: 'Funil de Vendas', drawerIcon: icon('filter-outline') }} />
      <Drawer.Screen name="clientes" options={{ title: 'Produtores', drawerLabel: 'Produtores', drawerIcon: icon('people-outline', 'ion') }} />
      <Drawer.Screen name="coleta" options={{ title: 'Coleta de Solo', drawerLabel: 'Coleta de Solo', drawerIcon: icon('flask-outline') }} />
      <Drawer.Screen name="regulagem" options={{ title: 'Regulagem', drawerLabel: 'Regulagem', drawerIcon: icon('wrench-outline') }} />
      <Drawer.Screen name="tecnologia" options={{ title: 'Tecnologia', drawerLabel: 'Tecnologia', drawerIcon: icon('satellite-variant') }} />
      <Drawer.Screen name="analise" options={{ title: 'Análise de Solo', drawerLabel: 'Análise de Solo', drawerIcon: icon('test-tube') }} />
      <Drawer.Screen name="relatorios" options={{ title: 'Relatórios', drawerLabel: 'Relatórios', drawerIcon: icon('bar-chart-2', 'feather') }} />
      {/* Hidden screens */}
      <Drawer.Screen name="cadastro-produtor" options={{ title: 'Cadastro de Produtor', drawerItemStyle: { display: 'none' } }} />
    </Drawer>
  );
}

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerContainer: { flex: 1, backgroundColor: Colors.perfil[700] },
  drawerScroll: { flex: 1, paddingHorizontal: 10, paddingTop: 8 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingTop: 52, paddingBottom: 20,
    borderBottomWidth: 1, borderBottomColor: Colors.perfil[600],
  },
  logoWrap: {
    width: 40, height: 40, borderRadius: 10, backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontWeight: '700', fontSize: 16, color: Colors.white },
  headerSub: { fontSize: 11, color: Colors.perfil[300] },
  footer: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 16,
    borderTopWidth: 1, borderTopColor: Colors.perfil[600],
  },
  avatar: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.perfil[500],
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: Colors.white, fontWeight: '600', fontSize: 13 },
  footerName: { color: Colors.white, fontWeight: '500', fontSize: 13 },
  footerRole: { color: Colors.perfil[300], fontSize: 11 },
  sectionLabelWrap: { paddingHorizontal: 12, marginBottom: 4 },
  sectionLabel: { fontSize: 9, fontWeight: '700', color: Colors.perfil[300], letterSpacing: 1, textTransform: 'uppercase' },
  drawerItem: { borderRadius: 10, marginVertical: 1 },
  drawerItemActive: { backgroundColor: Colors.perfil[600] },
  drawerItemInner: { paddingVertical: 10, paddingHorizontal: 12 },
  drawerItemRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  drawerLabel: { fontSize: 14, fontWeight: '500', color: Colors.perfil[100] },
  drawerLabelActive: { color: Colors.white, fontWeight: '600' },
});
