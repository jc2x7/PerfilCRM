import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, FontSize } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }
    if (!isLogin && !nome.trim()) {
      Alert.alert('Atenção', 'Preencha seu nome.');
      return;
    }

    setLoading(true);
    const { error } = isLogin
      ? await signIn(email.trim(), password)
      : await signUp(email.trim(), password, nome.trim());
    setLoading(false);

    if (error) {
      Alert.alert('Erro', error.message);
    } else if (!isLogin) {
      Alert.alert('Sucesso', 'Conta criada! Verifique seu e-mail se necessário.');
      setIsLogin(true);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      bounces={false}
    >
      {/* Logo */}
      <View style={styles.logoArea}>
        <View style={styles.logoCircle}>
          <MaterialCommunityIcons name="leaf" size={40} color={Colors.perfil[600]} />
        </View>
        <Text style={styles.brand}>Perfil</Text>
        <Text style={styles.brandSub}>Soluções Agronômicas</Text>
      </View>

      {/* Form */}
      <View style={styles.card}>
        <Text style={styles.title}>{isLogin ? 'Entrar' : 'Criar Conta'}</Text>

        {!isLogin && (
          <View style={styles.inputWrap}>
            <MaterialCommunityIcons name="account-outline" size={20} color={Colors.gray[400]} />
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              placeholderTextColor={Colors.gray[400]}
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>
        )}

        <View style={styles.inputWrap}>
          <MaterialCommunityIcons name="email-outline" size={20} color={Colors.gray[400]} />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor={Colors.gray[400]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputWrap}>
          <MaterialCommunityIcons name="lock-outline" size={20} color={Colors.gray[400]} />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor={Colors.gray[400]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPass}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity onPress={() => setShowPass(!showPass)}>
            <MaterialCommunityIcons
              name={showPass ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={Colors.gray[400]}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.buttonText}>{isLogin ? 'Entrar' : 'Cadastrar'}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.toggle}>
          <Text style={styles.toggleText}>
            {isLogin ? 'Não tem conta? ' : 'Já tem conta? '}
            <Text style={styles.toggleLink}>{isLogin ? 'Cadastre-se' : 'Entrar'}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, backgroundColor: Colors.perfil[700] },
  logoArea: { alignItems: 'center', marginBottom: 32 },
  logoCircle: {
    width: 80, height: 80, borderRadius: 20, backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  brand: { fontSize: 28, fontWeight: '700', color: Colors.white },
  brandSub: { fontSize: 14, color: Colors.perfil[200], marginTop: 2 },
  card: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: 24, gap: 16,
  },
  title: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.gray[800], textAlign: 'center' },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.gray[50], borderRadius: BorderRadius.lg,
    paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    borderWidth: 1, borderColor: Colors.gray[200],
  },
  input: { flex: 1, fontSize: 15, color: Colors.gray[800], padding: 0 },
  button: {
    backgroundColor: Colors.perfil[600], borderRadius: BorderRadius.lg,
    paddingVertical: 14, alignItems: 'center', marginTop: 4,
  },
  buttonText: { color: Colors.white, fontSize: 16, fontWeight: '600' },
  toggle: { alignItems: 'center', paddingTop: 4 },
  toggleText: { fontSize: 14, color: Colors.gray[500] },
  toggleLink: { color: Colors.perfil[600], fontWeight: '600' },
});
