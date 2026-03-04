import { useState } from 'react';
import {
  ScrollView, View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, Switch,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize } from '../src/constants/theme';
import { criarProdutor, criarPropriedade, criarTalhao, criarHistorico } from '../src/services/produtorService';

const FASES = [
  { id: 'primeiro_contato', label: 'Primeiro Contato' },
  { id: 'visita_inicial', label: 'Visita Inicial' },
  { id: 'levantamento', label: 'Levantamento' },
  { id: 'apresentacao', label: 'Apresentação' },
  { id: 'relacionamento', label: 'Relacionamento' },
];

const TEMPERATURAS = [
  { id: 'frio', label: 'Frio', icon: 'snowflake', color: Colors.blue[500] },
  { id: 'morno', label: 'Morno', icon: 'white-balance-sunny', color: Colors.amber[500] },
  { id: 'quente', label: 'Quente', icon: 'fire', color: Colors.red[500] },
];

const STEP_TITLES = [
  'Dados do Produtor',
  'Prospecção',
  'Propriedade',
  'Talhões',
  'Histórico',
];

function StepIndicator({ current, total }) {
  return (
    <View style={styles.stepRow}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={styles.stepItem}>
          <View style={[styles.stepDot, i <= current && styles.stepDotActive]}>
            {i < current ? (
              <MaterialCommunityIcons name="check" size={14} color={Colors.white} />
            ) : (
              <Text style={[styles.stepNum, i <= current && styles.stepNumActive]}>{i + 1}</Text>
            )}
          </View>
          {i < total - 1 && <View style={[styles.stepLine, i < current && styles.stepLineActive]} />}
        </View>
      ))}
    </View>
  );
}

function Field({ label, value, onChangeText, placeholder, multiline, keyboardType, required }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>
        {label}{required && <Text style={{ color: Colors.red[500] }}> *</Text>}
      </Text>
      <TextInput
        style={[styles.fieldInput, multiline && { height: 80, textAlignVertical: 'top' }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.gray[400]}
        multiline={multiline}
        keyboardType={keyboardType}
      />
    </View>
  );
}

export default function CadastroProdutor() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Step 0: Dados do produtor
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');

  // Step 1: Prospecção
  const [faseProspeccao, setFaseProspeccao] = useState('primeiro_contato');
  const [temperatura, setTemperatura] = useState('frio');
  const [origem, setOrigem] = useState('');
  const [indicadoPor, setIndicadoPor] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [proximaAcao, setProximaAcao] = useState('');
  const [intencoes, setIntencoes] = useState('');
  const [expectativas, setExpectativas] = useState('');
  const [conheceServico, setConheceServico] = useState(false);
  const [jaTrabalhou, setJaTrabalhou] = useState(false);
  const [servicoAnterior, setServicoAnterior] = useState('');
  const [observacoes, setObservacoes] = useState('');

  // Step 2: Propriedade
  const [propNome, setPropNome] = useState('');
  const [propCidade, setPropCidade] = useState('');
  const [propEstado, setPropEstado] = useState('');
  const [propArea, setPropArea] = useState('');
  const [propCulturas, setPropCulturas] = useState('');

  // Step 3: Talhões
  const [talhoes, setTalhoes] = useState([{ nome: '', area: '', cultura: '', solo: '' }]);

  // Step 4: Históricos
  const [historicos, setHistoricos] = useState([{ tipo: 'calagem', descricao: '', produto: '', dosagem: '' }]);

  const addTalhao = () => setTalhoes([...talhoes, { nome: '', area: '', cultura: '', solo: '' }]);
  const updateTalhao = (i, field, val) => {
    const copy = [...talhoes];
    copy[i] = { ...copy[i], [field]: val };
    setTalhoes(copy);
  };
  const removeTalhao = (i) => {
    if (talhoes.length > 1) setTalhoes(talhoes.filter((_, idx) => idx !== i));
  };

  const addHistorico = () => setHistoricos([...historicos, { tipo: 'calagem', descricao: '', produto: '', dosagem: '' }]);
  const updateHistorico = (i, field, val) => {
    const copy = [...historicos];
    copy[i] = { ...copy[i], [field]: val };
    setHistoricos(copy);
  };
  const removeHistorico = (i) => {
    if (historicos.length > 1) setHistoricos(historicos.filter((_, idx) => idx !== i));
  };

  const validate = () => {
    if (step === 0 && !nome.trim()) {
      Alert.alert('Atenção', 'Nome do produtor é obrigatório.');
      return false;
    }
    if (step === 2 && !propNome.trim()) {
      Alert.alert('Atenção', 'Nome da propriedade é obrigatório.');
      return false;
    }
    return true;
  };

  const next = () => {
    if (!validate()) return;
    setStep(step + 1);
  };
  const prev = () => setStep(step - 1);

  const handleSave = async () => {
    setLoading(true);
    try {
      // 1. Criar produtor
      const { data: prod, error: prodErr } = await criarProdutor({
        nome: nome.trim(),
        telefone: telefone.trim() || null,
        email: email.trim() || null,
        cpf_cnpj: cpfCnpj.trim() || null,
        cidade: cidade.trim() || null,
        estado: estado.trim() || null,
        fase_prospeccao: faseProspeccao,
        temperatura,
        origem: origem.trim() || null,
        indicado_por: indicadoPor.trim() || null,
        responsavel: responsavel.trim() || null,
        proxima_acao: proximaAcao.trim() || null,
        intencoes: intencoes.trim() || null,
        expectativas: expectativas.trim() || null,
        conhece_servico: conheceServico,
        ja_trabalhou_com_servico: jaTrabalhou,
        servico_anterior_detalhes: servicoAnterior.trim() || null,
        observacoes: observacoes.trim() || null,
      });
      if (prodErr) throw prodErr;

      // 2. Criar propriedade (se preenchida)
      let propId = null;
      if (propNome.trim()) {
        const { data: prop, error: propErr } = await criarPropriedade({
          produtor_id: prod.id,
          nome: propNome.trim(),
          cidade: propCidade.trim() || null,
          estado: propEstado.trim() || null,
          area_total_ha: propArea ? parseFloat(propArea) : null,
          culturas: propCulturas.trim() ? propCulturas.split(',').map((c) => c.trim()) : null,
        });
        if (propErr) throw propErr;
        propId = prop.id;

        // 3. Criar talhões
        for (const t of talhoes) {
          if (t.nome.trim() && t.area) {
            const { error: tErr } = await criarTalhao({
              propriedade_id: propId,
              nome: t.nome.trim(),
              area_ha: parseFloat(t.area),
              cultura_atual: t.cultura.trim() || null,
              solo_tipo: t.solo.trim() || null,
            });
            if (tErr) throw tErr;
          }
        }

        // 4. Criar históricos
        for (const h of historicos) {
          if (h.descricao.trim()) {
            const { error: hErr } = await criarHistorico({
              propriedade_id: propId,
              tipo: h.tipo,
              descricao: h.descricao.trim(),
              produto: h.produto.trim() || null,
              dosagem: h.dosagem.trim() || null,
            });
            if (hErr) throw hErr;
          }
        }
      }

      Alert.alert('Sucesso', 'Produtor cadastrado com sucesso!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err) {
      Alert.alert('Erro', err.message || 'Erro ao salvar produtor.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep0 = () => (
    <View style={styles.stepContent}>
      <Field label="Nome" value={nome} onChangeText={setNome} placeholder="Nome completo do produtor" required />
      <Field label="Telefone" value={telefone} onChangeText={setTelefone} placeholder="(00) 00000-0000" keyboardType="phone-pad" />
      <Field label="E-mail" value={email} onChangeText={setEmail} placeholder="email@exemplo.com" keyboardType="email-address" />
      <Field label="CPF/CNPJ" value={cpfCnpj} onChangeText={setCpfCnpj} placeholder="000.000.000-00" />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 2 }}>
          <Field label="Cidade" value={cidade} onChangeText={setCidade} placeholder="Cidade" />
        </View>
        <View style={{ flex: 1 }}>
          <Field label="UF" value={estado} onChangeText={setEstado} placeholder="GO" />
        </View>
      </View>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.sectionTitle}>Fase da Prospecção</Text>
      <View style={styles.chipRow}>
        {FASES.map((f) => (
          <TouchableOpacity
            key={f.id}
            style={[styles.chip, faseProspeccao === f.id && styles.chipActive]}
            onPress={() => setFaseProspeccao(f.id)}
          >
            <Text style={[styles.chipText, faseProspeccao === f.id && styles.chipTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Temperatura</Text>
      <View style={styles.chipRow}>
        {TEMPERATURAS.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[styles.chip, temperatura === t.id && { backgroundColor: t.color }]}
            onPress={() => setTemperatura(t.id)}
          >
            <MaterialCommunityIcons name={t.icon} size={14} color={temperatura === t.id ? Colors.white : Colors.gray[500]} />
            <Text style={[styles.chipText, temperatura === t.id && { color: Colors.white }]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Field label="Origem" value={origem} onChangeText={setOrigem} placeholder="Ex: Indicação, Feira, Redes Sociais" />
      <Field label="Indicado por" value={indicadoPor} onChangeText={setIndicadoPor} placeholder="Nome de quem indicou" />
      <Field label="Responsável" value={responsavel} onChangeText={setResponsavel} placeholder="Responsável pelo atendimento" />
      <Field label="Próxima Ação" value={proximaAcao} onChangeText={setProximaAcao} placeholder="O que fazer a seguir?" />

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Conhece nosso serviço?</Text>
        <Switch value={conheceServico} onValueChange={setConheceServico} trackColor={{ true: Colors.perfil[400] }} />
      </View>
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Já trabalhou com este tipo de serviço?</Text>
        <Switch value={jaTrabalhou} onValueChange={setJaTrabalhou} trackColor={{ true: Colors.perfil[400] }} />
      </View>
      {jaTrabalhou && (
        <Field label="Detalhes do serviço anterior" value={servicoAnterior} onChangeText={setServicoAnterior} placeholder="Com quem trabalhou, o que fez..." multiline />
      )}

      <Field label="Intenções" value={intencoes} onChangeText={setIntencoes} placeholder="O que o produtor pretende?" multiline />
      <Field label="Expectativas" value={expectativas} onChangeText={setExpectativas} placeholder="O que espera dos serviços?" multiline />
      <Field label="Observações" value={observacoes} onChangeText={setObservacoes} placeholder="Anotações gerais..." multiline />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Field label="Nome da Propriedade" value={propNome} onChangeText={setPropNome} placeholder="Ex: Fazenda Santa Maria" required />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 2 }}>
          <Field label="Cidade" value={propCidade} onChangeText={setPropCidade} placeholder="Cidade" />
        </View>
        <View style={{ flex: 1 }}>
          <Field label="UF" value={propEstado} onChangeText={setPropEstado} placeholder="GO" />
        </View>
      </View>
      <Field label="Área Total (ha)" value={propArea} onChangeText={setPropArea} placeholder="Ex: 1200" keyboardType="numeric" />
      <Field label="Culturas" value={propCulturas} onChangeText={setPropCulturas} placeholder="Soja, Milho, Algodão (separado por vírgula)" />
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.sectionTitle}>Talhões da Propriedade</Text>
      {talhoes.map((t, i) => (
        <View key={i} style={styles.itemCard}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>Talhão {i + 1}</Text>
            {talhoes.length > 1 && (
              <TouchableOpacity onPress={() => removeTalhao(i)}>
                <MaterialCommunityIcons name="close-circle-outline" size={20} color={Colors.red[500]} />
              </TouchableOpacity>
            )}
          </View>
          <Field label="Nome" value={t.nome} onChangeText={(v) => updateTalhao(i, 'nome', v)} placeholder="Ex: Talhão A1" />
          <Field label="Área (ha)" value={t.area} onChangeText={(v) => updateTalhao(i, 'area', v)} placeholder="Ex: 150" keyboardType="numeric" />
          <Field label="Cultura Atual" value={t.cultura} onChangeText={(v) => updateTalhao(i, 'cultura', v)} placeholder="Ex: Soja" />
          <Field label="Tipo de Solo" value={t.solo} onChangeText={(v) => updateTalhao(i, 'solo', v)} placeholder="Ex: Argiloso" />
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={addTalhao}>
        <MaterialCommunityIcons name="plus" size={18} color={Colors.perfil[600]} />
        <Text style={styles.addButtonText}>Adicionar Talhão</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.sectionTitle}>Histórico (Calagens, Adubações, Manejos)</Text>
      {historicos.map((h, i) => (
        <View key={i} style={styles.itemCard}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>Registro {i + 1}</Text>
            {historicos.length > 1 && (
              <TouchableOpacity onPress={() => removeHistorico(i)}>
                <MaterialCommunityIcons name="close-circle-outline" size={20} color={Colors.red[500]} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.fieldLabel}>Tipo</Text>
          <View style={styles.chipRow}>
            {[
              { id: 'calagem', label: 'Calagem' },
              { id: 'adubacao', label: 'Adubação' },
              { id: 'manejo', label: 'Manejo' },
              { id: 'outro', label: 'Outro' },
            ].map((tp) => (
              <TouchableOpacity
                key={tp.id}
                style={[styles.chip, h.tipo === tp.id && styles.chipActive]}
                onPress={() => updateHistorico(i, 'tipo', tp.id)}
              >
                <Text style={[styles.chipText, h.tipo === tp.id && styles.chipTextActive]}>{tp.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Field label="Descrição" value={h.descricao} onChangeText={(v) => updateHistorico(i, 'descricao', v)} placeholder="O que foi feito..." multiline />
          <Field label="Produto" value={h.produto} onChangeText={(v) => updateHistorico(i, 'produto', v)} placeholder="Ex: Calcário dolomítico" />
          <Field label="Dosagem" value={h.dosagem} onChangeText={(v) => updateHistorico(i, 'dosagem', v)} placeholder="Ex: 2.5 t/ha" />
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={addHistorico}>
        <MaterialCommunityIcons name="plus" size={18} color={Colors.perfil[600]} />
        <Text style={styles.addButtonText}>Adicionar Histórico</Text>
      </TouchableOpacity>
    </View>
  );

  const steps = [renderStep0, renderStep1, renderStep2, renderStep3, renderStep4];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <StepIndicator current={step} total={STEP_TITLES.length} />
        <Text style={styles.headerTitle}>{STEP_TITLES[step]}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {steps[step]()}
      </ScrollView>

      <View style={styles.footer}>
        {step > 0 ? (
          <TouchableOpacity style={styles.backBtn} onPress={prev}>
            <MaterialCommunityIcons name="chevron-left" size={20} color={Colors.gray[600]} />
            <Text style={styles.backBtnText}>Voltar</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        {step < STEP_TITLES.length - 1 ? (
          <TouchableOpacity style={styles.nextBtn} onPress={next}>
            <Text style={styles.nextBtnText}>Próximo</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.white} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.nextBtn, { backgroundColor: Colors.perfil[600] }]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <>
                <MaterialCommunityIcons name="check" size={18} color={Colors.white} />
                <Text style={styles.nextBtnText}>Salvar</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray[50] },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.gray[100] },
  headerTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.gray[800], textAlign: 'center', marginTop: 8 },
  scroll: { padding: Spacing.lg, paddingBottom: 100 },
  stepContent: { gap: 12 },
  stepRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  stepItem: { flexDirection: 'row', alignItems: 'center' },
  stepDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.gray[200], alignItems: 'center', justifyContent: 'center' },
  stepDotActive: { backgroundColor: Colors.perfil[500] },
  stepNum: { fontSize: 12, fontWeight: '600', color: Colors.gray[500] },
  stepNumActive: { color: Colors.white },
  stepLine: { width: 24, height: 2, backgroundColor: Colors.gray[200], marginHorizontal: 4 },
  stepLineActive: { backgroundColor: Colors.perfil[400] },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: Colors.gray[600], textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4, marginBottom: 2 },
  fieldWrap: { gap: 4 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: Colors.gray[600] },
  fieldInput: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.gray[200], borderRadius: BorderRadius.lg, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: Colors.gray[800] },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, backgroundColor: Colors.gray[100] },
  chipActive: { backgroundColor: Colors.perfil[500] },
  chipText: { fontSize: 12, fontWeight: '500', color: Colors.gray[600] },
  chipTextActive: { color: Colors.white },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.white, padding: 12, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.gray[200] },
  switchLabel: { fontSize: 13, color: Colors.gray[700], flex: 1 },
  itemCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: 14, borderWidth: 1, borderColor: Colors.gray[200], gap: 10 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemTitle: { fontSize: 13, fontWeight: '700', color: Colors.gray[700] },
  addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.perfil[200], borderStyle: 'dashed', backgroundColor: Colors.perfil[50] },
  addButtonText: { fontSize: 13, fontWeight: '600', color: Colors.perfil[600] },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: 12, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.gray[100] },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 10, paddingHorizontal: 14 },
  backBtnText: { fontSize: 14, fontWeight: '500', color: Colors.gray[600] },
  nextBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.perfil[500], paddingVertical: 10, paddingHorizontal: 20, borderRadius: BorderRadius.lg },
  nextBtnText: { fontSize: 14, fontWeight: '600', color: Colors.white },
});
