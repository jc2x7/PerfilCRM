import { useState } from 'react';
import {
  Search,
  Plus,
  X,
  Eye,
  FlaskConical,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Info,
  Download,
  Printer,
  Calendar,
  MapPin,
  User,
  Beaker,
} from 'lucide-react';
import { analisesSolo } from '../data/mockData';
import { interpretarAnalise, nivelCores, camposAnalise } from '../data/interpretacaoSolo';

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
};

// ───── Barra visual de nível ─────
function NivelBar({ classificacao }) {
  if (!classificacao) return <span className="text-xs text-gray-400">—</span>;
  const cores = nivelCores[classificacao.nivel];
  const nivelMap = { muito_baixo: 1, baixo: 2, medio: 3, adequado: 4, alto: 5 };
  const pos = nivelMap[classificacao.nivel] || 0;

  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex gap-0.5 flex-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full ${i <= pos ? cores.bar : 'bg-gray-200'}`}
          />
        ))}
      </div>
      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${cores.bg} ${cores.text} whitespace-nowrap`}>
        {classificacao.label}
      </span>
    </div>
  );
}

// ───── Card de parâmetro individual ─────
function ParametroCard({ label, valor, unidade, classificacao }) {
  if (valor == null) return null;
  const cores = classificacao ? nivelCores[classificacao.nivel] : null;

  return (
    <div className={`rounded-lg border p-3 ${cores ? `${cores.bg} ${cores.border}` : 'bg-gray-50 border-gray-200'}`}>
      <p className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className={`text-lg font-bold ${cores ? cores.text : 'text-gray-800'}`}>
          {typeof valor === 'number' ? valor.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) : valor}
        </span>
        {unidade && <span className="text-[10px] text-gray-400">{unidade}</span>}
      </div>
      {classificacao && (
        <p className={`text-[10px] font-semibold mt-1 ${cores.text}`}>{classificacao.label}</p>
      )}
    </div>
  );
}

// ───── Laudo completo (modal) ─────
function LaudoModal({ analise, onClose }) {
  if (!analise) return null;
  const interp = interpretarAnalise(analise);
  const temResultado = analise.phCaCl2 != null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Laudo de Análise de Solo</h2>
            <p className="text-sm text-gray-500">{analise.cliente} - {analise.fazenda}</p>
          </div>
          <div className="flex items-center gap-2">
            {temResultado && (
              <>
                <button className="btn-secondary flex items-center gap-1.5 text-xs">
                  <Printer className="w-3.5 h-3.5" /> Imprimir
                </button>
                <button className="btn-primary flex items-center gap-1.5 text-xs">
                  <Download className="w-3.5 h-3.5" /> Exportar PDF
                </button>
              </>
            )}
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Info do laudo */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-[10px] text-gray-500 uppercase">Talhão</p>
                <p className="text-sm font-medium text-gray-800">{analise.talhao}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-[10px] text-gray-500 uppercase">Data Coleta</p>
                <p className="text-sm font-medium text-gray-800">{formatDate(analise.dataColeta)}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Beaker className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-[10px] text-gray-500 uppercase">Laboratório</p>
                <p className="text-sm font-medium text-gray-800">{analise.laboratorio}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <User className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-[10px] text-gray-500 uppercase">Profundidade</p>
                <p className="text-sm font-medium text-gray-800">{analise.profundidade}</p>
              </div>
            </div>
          </div>

          {!temResultado ? (
            <div className="text-center py-12">
              <FlaskConical className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Aguardando resultado do laboratório</p>
              <p className="text-sm text-gray-400 mt-1">{analise.observacoes}</p>
            </div>
          ) : (
            <>
              {/* Resumo rápido */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Resumo da Análise</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: 'pH (CaCl₂)', valor: analise.phCaCl2, class: interp.phCaCl2 },
                    { label: 'V% (Sat. Bases)', valor: `${analise.saturacaoBases}%`, class: interp.saturacaoBases },
                    { label: 'M.O.', valor: `${analise.materiaOrganica} g/dm³`, class: interp.materiaOrganica },
                    { label: 'CTC', valor: `${analise.ctc} mmolc/dm³`, class: interp.ctc },
                    { label: 'P (Fósforo)', valor: `${analise.fosforo} mg/dm³`, class: interp.fosforo },
                    { label: 'K (Potássio)', valor: `${analise.potassio} mmolc/dm³`, class: interp.potassio },
                    { label: 'm% (Sat. Al)', valor: `${analise.saturacaoAluminio}%`, class: interp.saturacaoAluminio },
                    { label: 'Rel. Ca/Mg', valor: analise.relCaMg, class: interp.relCaMg },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-2">
                      <span className="text-xs text-gray-600 font-medium w-32 shrink-0">{item.label}</span>
                      <span className="text-xs text-gray-800 font-semibold w-24 text-right shrink-0">{item.valor}</span>
                      <div className="flex-1 min-w-0">
                        <NivelBar classificacao={item.class} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alertas */}
              {(() => {
                const alertas = [];
                if (interp.phCaCl2?.nivel === 'muito_baixo' || interp.phCaCl2?.nivel === 'baixo')
                  alertas.push({ tipo: 'danger', msg: `pH muito ácido (${analise.phCaCl2}). Recomenda-se calagem para elevar V% a 60-70%.` });
                if (interp.saturacaoBases?.nivel === 'muito_baixo' || interp.saturacaoBases?.nivel === 'baixo')
                  alertas.push({ tipo: 'danger', msg: `V% baixa (${analise.saturacaoBases}%). Solo necessita calagem para correção.` });
                if (interp.saturacaoAluminio?.nivel === 'muito_baixo' || interp.saturacaoAluminio?.nivel === 'baixo')
                  alertas.push({ tipo: 'danger', msg: `Saturação por alumínio elevada (${analise.saturacaoAluminio}%). Toxidez pode afetar o sistema radicular.` });
                if (interp.fosforo?.nivel === 'muito_baixo' || interp.fosforo?.nivel === 'baixo')
                  alertas.push({ tipo: 'warning', msg: `Fósforo ${interp.fosforo.label.toLowerCase()} (${analise.fosforo} mg/dm³). Necessita adubação fosfatada.` });
                if (interp.potassio?.nivel === 'muito_baixo' || interp.potassio?.nivel === 'baixo')
                  alertas.push({ tipo: 'warning', msg: `Potássio ${interp.potassio.label.toLowerCase()} (${analise.potassio} mmolc/dm³). Necessita adubação potássica.` });
                if (interp.boro?.nivel === 'muito_baixo' || interp.boro?.nivel === 'baixo')
                  alertas.push({ tipo: 'info', msg: `Boro ${interp.boro.label.toLowerCase()} (${analise.boro} mg/dm³). Atenção na adubação com micronutrientes.` });
                if (interp.zinco?.nivel === 'muito_baixo' || interp.zinco?.nivel === 'baixo')
                  alertas.push({ tipo: 'info', msg: `Zinco ${interp.zinco.label.toLowerCase()} (${analise.zinco} mg/dm³). Considerar aplicação de Zn.` });

                if (alertas.length === 0) {
                  alertas.push({ tipo: 'success', msg: 'Solo em boas condições gerais. Manter adubação de manutenção.' });
                }

                const iconMap = {
                  danger: <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />,
                  warning: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />,
                  info: <Info className="w-4 h-4 text-blue-500 shrink-0" />,
                  success: <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />,
                };
                const bgMap = {
                  danger: 'bg-red-50 border-red-200',
                  warning: 'bg-amber-50 border-amber-200',
                  info: 'bg-blue-50 border-blue-200',
                  success: 'bg-green-50 border-green-200',
                };

                return (
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Interpretação e Alertas</h3>
                    {alertas.map((a, i) => (
                      <div key={i} className={`flex items-start gap-2 p-3 rounded-lg border ${bgMap[a.tipo]}`}>
                        {iconMap[a.tipo]}
                        <p className="text-sm text-gray-700">{a.msg}</p>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Textura */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Textura do Solo</h3>
                <div className="grid grid-cols-4 gap-3">
                  <ParametroCard label="Argila" valor={analise.argila} unidade="%" />
                  <ParametroCard label="Silte" valor={analise.silte} unidade="%" />
                  <ParametroCard label="Areia" valor={analise.areia} unidade="%" />
                  <div className="rounded-lg border bg-gray-50 border-gray-200 p-3">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold mb-1">Classe</p>
                    <span className="text-sm font-bold text-gray-800">{analise.classeTextural || interp.classeTextural}</span>
                  </div>
                </div>
                {/* Barra de textura visual */}
                <div className="mt-2 flex rounded-full overflow-hidden h-4">
                  <div style={{ width: `${analise.argila}%` }} className="bg-terra-500 flex items-center justify-center">
                    <span className="text-[8px] text-white font-bold">{analise.argila}%</span>
                  </div>
                  <div style={{ width: `${analise.silte}%` }} className="bg-terra-300 flex items-center justify-center">
                    <span className="text-[8px] text-terra-800 font-bold">{analise.silte}%</span>
                  </div>
                  <div style={{ width: `${analise.areia}%` }} className="bg-amber-200 flex items-center justify-center">
                    <span className="text-[8px] text-amber-800 font-bold">{analise.areia}%</span>
                  </div>
                </div>
                <div className="flex gap-4 mt-1.5">
                  <span className="flex items-center gap-1 text-[10px] text-gray-500"><span className="w-2 h-2 rounded-full bg-terra-500" /> Argila</span>
                  <span className="flex items-center gap-1 text-[10px] text-gray-500"><span className="w-2 h-2 rounded-full bg-terra-300" /> Silte</span>
                  <span className="flex items-center gap-1 text-[10px] text-gray-500"><span className="w-2 h-2 rounded-full bg-amber-200" /> Areia</span>
                </div>
              </div>

              {/* Condutividade e pH */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Acidez e Condutividade</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  <ParametroCard label="CE" valor={analise.condutividadeEletrica} unidade="dS/m" classificacao={interp.condutividadeEletrica} />
                  <ParametroCard label="pH (H₂O)" valor={analise.phAgua} unidade="" />
                  <ParametroCard label="pH (CaCl₂)" valor={analise.phCaCl2} unidade="" classificacao={interp.phCaCl2} />
                  <ParametroCard label="Al³⁺" valor={analise.aluminio} unidade="mmolc/dm³" classificacao={interp.aluminio} />
                  <ParametroCard label="H+Al" valor={analise.hAl} unidade="mmolc/dm³" />
                </div>
              </div>

              {/* M.O. */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Matéria Orgânica</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <ParametroCard label="M.O." valor={analise.materiaOrganica} unidade="g/dm³" classificacao={interp.materiaOrganica} />
                </div>
              </div>

              {/* Macronutrientes */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Macronutrientes</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  <ParametroCard label="P (Fósforo)" valor={analise.fosforo} unidade="mg/dm³" classificacao={interp.fosforo} />
                  <ParametroCard label="K⁺" valor={analise.potassio} unidade="mmolc/dm³" classificacao={interp.potassio} />
                  <ParametroCard label="Ca²⁺" valor={analise.calcio} unidade="mmolc/dm³" classificacao={interp.calcio} />
                  <ParametroCard label="Mg²⁺" valor={analise.magnesio} unidade="mmolc/dm³" classificacao={interp.magnesio} />
                  <ParametroCard label="S (Enxofre)" valor={analise.enxofre} unidade="mg/dm³" classificacao={interp.enxofre} />
                </div>
              </div>

              {/* Micronutrientes */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Micronutrientes</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  <ParametroCard label="B (Boro)" valor={analise.boro} unidade="mg/dm³" classificacao={interp.boro} />
                  <ParametroCard label="Cu (Cobre)" valor={analise.cobre} unidade="mg/dm³" classificacao={interp.cobre} />
                  <ParametroCard label="Fe (Ferro)" valor={analise.ferro} unidade="mg/dm³" classificacao={interp.ferro} />
                  <ParametroCard label="Mn" valor={analise.manganes} unidade="mg/dm³" classificacao={interp.manganes} />
                  <ParametroCard label="Zn (Zinco)" valor={analise.zinco} unidade="mg/dm³" classificacao={interp.zinco} />
                </div>
              </div>

              {/* Índices calculados */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Complexo Sortivo e Relações</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  <ParametroCard label="SB (Soma Bases)" valor={analise.somaBase} unidade="mmolc/dm³" />
                  <ParametroCard label="CTC" valor={analise.ctc} unidade="mmolc/dm³" classificacao={interp.ctc} />
                  <ParametroCard label="V%" valor={analise.saturacaoBases} unidade="%" classificacao={interp.saturacaoBases} />
                  <ParametroCard label="m%" valor={analise.saturacaoAluminio} unidade="%" classificacao={interp.saturacaoAluminio} />
                  <ParametroCard label="Ca/Mg" valor={analise.relCaMg} unidade="" classificacao={interp.relCaMg} />
                  <ParametroCard label="Ca/K" valor={analise.relCaK} unidade="" />
                  <ParametroCard label="Mg/K" valor={analise.relMgK} unidade="" />
                </div>
              </div>

              {/* Observações */}
              {analise.observacoes && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Observações do Técnico</h3>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 border border-gray-100">{analise.observacoes}</p>
                </div>
              )}

              {/* Legenda */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-2">Legenda de classificação</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { nivel: 'muito_baixo', label: 'Muito Baixo' },
                    { nivel: 'baixo', label: 'Baixo' },
                    { nivel: 'medio', label: 'Médio' },
                    { nivel: 'adequado', label: 'Adequado' },
                    { nivel: 'alto', label: 'Alto' },
                  ].map((n) => (
                    <span key={n.nivel} className={`text-[10px] font-medium px-2 py-0.5 rounded ${nivelCores[n.nivel].bg} ${nivelCores[n.nivel].text}`}>
                      {n.label}
                    </span>
                  ))}
                </div>
                <p className="text-[9px] text-gray-400 mt-2">
                  Referência: Boletim 100 IAC / EMBRAPA Cerrados. Classificações podem variar conforme cultura e região.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ───── Formulário de nova análise ─────
function FormularioAnalise({ onClose, onSalvar }) {
  const [dados, setDados] = useState({});
  const [secaoAberta, setSecaoAberta] = useState('Identificação');

  const handleChange = (key, valor) => {
    setDados((prev) => ({ ...prev, [key]: valor }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSalvar(dados);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Nova Análise de Solo</h2>
            <p className="text-sm text-gray-500">Preencha os dados do boletim do laboratório</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-1">
          {camposAnalise.map((grupo) => {
            const aberta = secaoAberta === grupo.grupo;
            return (
              <div key={grupo.grupo} className="border border-gray-100 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setSecaoAberta(aberta ? null : grupo.grupo)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm font-semibold text-gray-700">{grupo.grupo}</span>
                  {aberta ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                {aberta && (
                  <div className="px-4 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {grupo.campos.map((campo) => (
                      <div key={campo.key}>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">
                          {campo.label} {campo.unidade && <span className="text-gray-400">({campo.unidade})</span>}
                        </label>
                        <input
                          type={campo.tipo}
                          step={campo.step || undefined}
                          value={dados[campo.key] || ''}
                          onChange={(e) => handleChange(campo.key, campo.tipo === 'number' ? parseFloat(e.target.value) || '' : e.target.value)}
                          className="input-field"
                          placeholder={campo.label}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div className="pt-4">
            <label className="text-xs font-medium text-gray-600 mb-1 block">Observações</label>
            <textarea
              value={dados.observacoes || ''}
              onChange={(e) => handleChange('observacoes', e.target.value)}
              className="input-field h-20 resize-none"
              placeholder="Observações sobre a amostra ou resultados..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary">Salvar Análise</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ───── Card na listagem ─────
function AnaliseCard({ analise, onClick }) {
  const temResultado = analise.phCaCl2 != null;
  const interp = interpretarAnalise(analise);

  // Contar alertas
  let alertas = 0;
  if (interp) {
    const campos = [interp.phCaCl2, interp.saturacaoBases, interp.saturacaoAluminio, interp.fosforo, interp.potassio];
    alertas = campos.filter((c) => c && (c.nivel === 'muito_baixo' || c.nivel === 'baixo')).length;
  }

  return (
    <div
      onClick={() => onClick(analise)}
      className="card cursor-pointer hover:shadow-md transition-all border-l-4 border-l-perfil-500"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-800">{analise.cliente}</h3>
          <p className="text-sm text-gray-500">{analise.fazenda} - {analise.talhao}</p>
        </div>
        {temResultado ? (
          alertas > 0 ? (
            <span className="badge bg-red-100 text-red-600">{alertas} alerta{alertas > 1 ? 's' : ''}</span>
          ) : (
            <span className="badge bg-green-100 text-green-700">OK</span>
          )
        ) : (
          <span className="badge bg-yellow-100 text-yellow-700">Aguardando</span>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
        <span>Coleta: {formatDate(analise.dataColeta)}</span>
        <span>Lab: {analise.laboratorio}</span>
        <span>{analise.profundidade}</span>
      </div>

      {temResultado ? (
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'pH', valor: analise.phCaCl2, class: interp.phCaCl2 },
            { label: 'V%', valor: `${analise.saturacaoBases}`, class: interp.saturacaoBases },
            { label: 'P', valor: analise.fosforo, class: interp.fosforo },
            { label: 'K', valor: analise.potassio, class: interp.potassio },
          ].map((item) => {
            const cores = nivelCores[item.class?.nivel] || nivelCores.medio;
            return (
              <div key={item.label} className={`text-center rounded-lg px-2 py-1.5 ${cores.bg}`}>
                <p className="text-[10px] text-gray-500">{item.label}</p>
                <p className={`text-sm font-bold ${cores.text}`}>{item.valor}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-3">
          <FlaskConical className="w-5 h-5 text-gray-300 mx-auto mb-1" />
          <p className="text-xs text-gray-400">Resultado pendente</p>
        </div>
      )}
    </div>
  );
}

// ───── Página principal ─────
export default function AnaliseSolo() {
  const [analises, setAnalises] = useState(analisesSolo);
  const [selectedAnalise, setSelectedAnalise] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [busca, setBusca] = useState('');

  const filtered = analises.filter((a) => {
    if (!busca) return true;
    const q = busca.toLowerCase();
    return (
      a.cliente.toLowerCase().includes(q) ||
      a.fazenda.toLowerCase().includes(q) ||
      a.talhao.toLowerCase().includes(q)
    );
  });

  const comResultado = analises.filter((a) => a.phCaCl2 != null);
  const semResultado = analises.filter((a) => a.phCaCl2 == null);
  const comAlerta = comResultado.filter((a) => {
    const interp = interpretarAnalise(a);
    return interp && [interp.phCaCl2, interp.saturacaoBases, interp.fosforo].some((c) => c && (c.nivel === 'muito_baixo' || c.nivel === 'baixo'));
  });

  const handleSalvar = (dados) => {
    const nova = {
      id: analises.length + 1,
      clienteId: null,
      dataResultado: null,
      responsavel: 'João Paulo',
      ...dados,
    };
    setAnalises([nova, ...analises]);
  };

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card flex items-center gap-4">
          <div className="w-11 h-11 bg-perfil-50 rounded-xl flex items-center justify-center">
            <FlaskConical className="w-5 h-5 text-perfil-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Análises</p>
            <p className="text-xl font-bold text-gray-900">{analises.length}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Com Resultado</p>
            <p className="text-xl font-bold text-gray-900">{comResultado.length}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Com Alertas</p>
            <p className="text-xl font-bold text-gray-900">{comAlerta.length}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center">
            <Beaker className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Aguardando Lab</p>
            <p className="text-xl font-bold text-gray-900">{semResultado.length}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por produtor, fazenda ou talhão..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm ml-auto">
          <Plus className="w-4 h-4" /> Nova Análise
        </button>
      </div>

      {/* Lista */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((a) => (
          <AnaliseCard key={a.id} analise={a} onClick={setSelectedAnalise} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 card text-center py-12">
            <FlaskConical className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">Nenhuma análise encontrada</p>
          </div>
        )}
      </div>

      {/* Modais */}
      {selectedAnalise && <LaudoModal analise={selectedAnalise} onClose={() => setSelectedAnalise(null)} />}
      {showForm && <FormularioAnalise onClose={() => setShowForm(false)} onSalvar={handleSalvar} />}
    </div>
  );
}
