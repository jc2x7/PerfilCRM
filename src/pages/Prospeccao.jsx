import { useState } from 'react';
import {
  UserPlus,
  Search,
  Filter,
  Phone,
  MapPin,
  Calendar,
  ChevronRight,
  X,
  MessageSquare,
  Eye,
  Thermometer,
  ArrowRight,
  Plus,
  Clock,
  User,
  Mail,
  Landmark,
} from 'lucide-react';
import { prospeccao } from '../data/mockData';

const etapasProspeccao = [
  { id: 'primeiro_contato', label: 'Primeiro Contato', cor: 'bg-gray-400', corBorda: 'border-l-gray-400', step: 1 },
  { id: 'visita_inicial', label: 'Visita Inicial', cor: 'bg-blue-400', corBorda: 'border-l-blue-400', step: 2 },
  { id: 'levantamento', label: 'Levantamento', cor: 'bg-amber-400', corBorda: 'border-l-amber-400', step: 3 },
  { id: 'apresentacao', label: 'Apresentação', cor: 'bg-orange-400', corBorda: 'border-l-orange-400', step: 4 },
  { id: 'relacionamento', label: 'Relacionamento', cor: 'bg-perfil-400', corBorda: 'border-l-perfil-400', step: 5 },
];

const temperaturaConfig = {
  quente: { label: 'Quente', cor: 'bg-red-50 text-red-600 border-red-200', icone: '🔥' },
  morno: { label: 'Morno', cor: 'bg-amber-50 text-amber-600 border-amber-200', icone: '🌤' },
  frio: { label: 'Frio', cor: 'bg-blue-50 text-blue-600 border-blue-200', icone: '❄' },
};

const origemConfig = {
  'Indicação': 'bg-perfil-50 text-perfil-700',
  'Feira Agro': 'bg-purple-50 text-purple-700',
  'Redes Sociais': 'bg-pink-50 text-pink-700',
  'Evento': 'bg-blue-50 text-blue-700',
};

const formatDate = (dateStr) => {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
};

const tipoInteracaoIcon = {
  'Ligação': Phone,
  'Visita': MapPin,
  'Reunião': Landmark,
  'WhatsApp': MessageSquare,
  'Feira': UserPlus,
  'Evento': UserPlus,
};

function ProspectModal({ prospect, onClose }) {
  if (!prospect) return null;
  const etapa = etapasProspeccao.find((e) => e.id === prospect.etapa);
  const temp = temperaturaConfig[prospect.temperatura];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{prospect.nome}</h2>
            <p className="text-sm text-gray-500">{prospect.fazenda} - {prospect.cidade}/{prospect.estado}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Pipeline progress */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Progresso no Pipeline</p>
            <div className="flex items-center gap-1">
              {etapasProspeccao.map((e, i) => {
                const isActive = e.step <= etapa.step;
                const isCurrent = e.id === prospect.etapa;
                return (
                  <div key={e.id} className="flex items-center flex-1">
                    <div className={`flex-1 h-2 rounded-full ${isActive ? e.cor : 'bg-gray-200'} transition-colors ${isCurrent ? 'ring-2 ring-offset-1 ring-gray-300' : ''}`} />
                    {i < etapasProspeccao.length - 1 && <ChevronRight className="w-3 h-3 text-gray-300 mx-0.5 shrink-0" />}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-1.5">
              {etapasProspeccao.map((e) => (
                <p key={e.id} className={`text-[9px] text-center flex-1 ${e.id === prospect.etapa ? 'font-bold text-gray-700' : 'text-gray-400'}`}>
                  {e.label}
                </p>
              ))}
            </div>
          </div>

          {/* Info badges */}
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${temp.cor}`}>
              {temp.icone} {temp.label}
            </span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${origemConfig[prospect.origem] || 'bg-gray-100 text-gray-600'}`}>
              {prospect.origem}
            </span>
            {prospect.indicadoPor && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                Indicado por {prospect.indicadoPor}
              </span>
            )}
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Área</p>
                  <p className="text-sm font-medium text-gray-800">{prospect.area.toLocaleString('pt-BR')} ha</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Telefone</p>
                  <p className="text-sm font-medium text-gray-800">{prospect.telefone}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">E-mail</p>
                  <p className="text-sm font-medium text-gray-800">{prospect.email}</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Responsável</p>
                  <p className="text-sm font-medium text-gray-800">{prospect.responsavel}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Primeiro Contato</p>
                  <p className="text-sm font-medium text-gray-800">{formatDate(prospect.dataPrimeiroContato)}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Culturas</p>
                <div className="flex flex-wrap gap-1">
                  {prospect.culturas.map((c) => (
                    <span key={c} className="text-xs bg-perfil-50 text-perfil-700 px-2 py-0.5 rounded">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Next action */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Próxima Ação</p>
            <p className="text-sm font-medium text-amber-800">{prospect.proximaAcao}</p>
            <p className="text-xs text-amber-600 mt-1">
              <Clock className="w-3 h-3 inline mr-1" />
              {formatDate(prospect.dataProximaAcao)}
            </p>
          </div>

          {/* Observations */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Observações</p>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{prospect.observacoes}</p>
          </div>

          {/* Timeline */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Histórico de Interações</p>
            <div className="space-y-0">
              {[...prospect.interacoes].reverse().map((inter, i) => {
                const Icon = tipoInteracaoIcon[inter.tipo] || MessageSquare;
                return (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                      {i < prospect.interacoes.length - 1 && (
                        <div className="w-px h-full bg-gray-200 my-1" />
                      )}
                    </div>
                    <div className="pb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-700">{inter.tipo}</span>
                        <span className="text-[10px] text-gray-400">{formatDate(inter.data)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5">{inter.descricao}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-gray-100">
            <button className="btn-primary flex-1 text-sm flex items-center justify-center gap-2">
              <ArrowRight className="w-4 h-4" /> Avançar Etapa
            </button>
            <button className="btn-secondary text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> Nova Interação
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProspectCard({ prospect, onClick }) {
  const etapa = etapasProspeccao.find((e) => e.id === prospect.etapa);
  const temp = temperaturaConfig[prospect.temperatura];

  return (
    <div
      onClick={() => onClick(prospect)}
      className={`card border-l-4 ${etapa.corBorda} cursor-pointer hover:shadow-md transition-all`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-800">{prospect.nome}</h3>
          <p className="text-sm text-gray-500">{prospect.fazenda} - {prospect.cidade}/{prospect.estado}</p>
        </div>
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${temp.cor}`}>
          {temp.icone} {temp.label}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${origemConfig[prospect.origem] || 'bg-gray-100 text-gray-600'}`}>
          {prospect.origem}
        </span>
        <span className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          {prospect.area.toLocaleString('pt-BR')} ha
        </span>
        {prospect.culturas.map((c) => (
          <span key={c} className="text-[11px] bg-perfil-50 text-perfil-700 px-2 py-0.5 rounded-full">{c}</span>
        ))}
      </div>

      {/* Mini pipeline */}
      <div className="flex items-center gap-0.5 mb-3">
        {etapasProspeccao.map((e) => (
          <div
            key={e.id}
            className={`h-1.5 flex-1 rounded-full ${e.step <= etapa.step ? e.cor : 'bg-gray-200'}`}
          />
        ))}
      </div>

      <div className="bg-amber-50 rounded-lg p-2 mb-3">
        <p className="text-xs text-amber-700 font-medium">{prospect.proximaAcao}</p>
        <p className="text-[10px] text-amber-500 mt-0.5">{formatDate(prospect.dataProximaAcao)}</p>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          {prospect.responsavel}
        </div>
        <div className="flex items-center gap-1">
          <MessageSquare className="w-3 h-3" />
          {prospect.interacoes.length} interações
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatDate(prospect.dataUltimaInteracao)}
        </div>
      </div>
    </div>
  );
}

export default function Prospeccao() {
  const [selectedProspect, setSelectedProspect] = useState(null);
  const [busca, setBusca] = useState('');
  const [filtroEtapa, setFiltroEtapa] = useState('todos');
  const [filtroTemperatura, setFiltroTemperatura] = useState('todos');
  const [modoVisualizacao, setModoVisualizacao] = useState('pipeline');

  const prospects = prospeccao.filter((p) => {
    const matchBusca = busca === '' ||
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.fazenda.toLowerCase().includes(busca.toLowerCase()) ||
      p.cidade.toLowerCase().includes(busca.toLowerCase());
    const matchEtapa = filtroEtapa === 'todos' || p.etapa === filtroEtapa;
    const matchTemp = filtroTemperatura === 'todos' || p.temperatura === filtroTemperatura;
    return matchBusca && matchEtapa && matchTemp;
  });

  const stats = {
    total: prospeccao.length,
    quentes: prospeccao.filter((p) => p.temperatura === 'quente').length,
    areaTotal: prospeccao.reduce((sum, p) => sum + p.area, 0),
    acoesPendentes: prospeccao.filter((p) => new Date(p.dataProximaAcao) <= new Date('2026-03-05')).length,
  };

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card flex items-center gap-4">
          <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Prospects Ativos</p>
            <p className="text-xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center">
            <Thermometer className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Leads Quentes</p>
            <p className="text-xl font-bold text-gray-900">{stats.quentes}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-11 h-11 bg-perfil-50 rounded-xl flex items-center justify-center">
            <MapPin className="w-5 h-5 text-perfil-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Área Potencial</p>
            <p className="text-xl font-bold text-gray-900">{stats.areaTotal.toLocaleString('pt-BR')} ha</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Ações Pendentes</p>
            <p className="text-xl font-bold text-gray-900">{stats.acoesPendentes}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, fazenda ou cidade..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filtroEtapa}
            onChange={(e) => setFiltroEtapa(e.target.value)}
            className="input-field w-auto text-sm"
          >
            <option value="todos">Todas as etapas</option>
            {etapasProspeccao.map((e) => (
              <option key={e.id} value={e.id}>{e.label}</option>
            ))}
          </select>
          <select
            value={filtroTemperatura}
            onChange={(e) => setFiltroTemperatura(e.target.value)}
            className="input-field w-auto text-sm"
          >
            <option value="todos">Todas temperaturas</option>
            <option value="quente">Quente</option>
            <option value="morno">Morno</option>
            <option value="frio">Frio</option>
          </select>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5 ml-auto">
          <button
            onClick={() => setModoVisualizacao('pipeline')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${modoVisualizacao === 'pipeline' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'}`}
          >
            Pipeline
          </button>
          <button
            onClick={() => setModoVisualizacao('lista')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${modoVisualizacao === 'lista' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'}`}
          >
            Lista
          </button>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Novo Prospect
        </button>
      </div>

      {/* Pipeline view */}
      {modoVisualizacao === 'pipeline' ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {etapasProspeccao.map((etapa) => {
            const colProspects = prospects.filter((p) => p.etapa === etapa.id);
            return (
              <div key={etapa.id} className="flex-shrink-0 w-80">
                <div className="mb-3 flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${etapa.cor}`} />
                  <h3 className="text-sm font-semibold text-gray-700">{etapa.label}</h3>
                  <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full ml-auto">
                    {colProspects.length}
                  </span>
                </div>
                <div className="space-y-3 min-h-[100px]">
                  {colProspects.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProspect(p)}
                      className={`bg-white rounded-lg border border-gray-200 border-l-4 ${etapa.corBorda} p-4 cursor-pointer hover:shadow-md transition-all`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-semibold text-gray-800">{p.nome}</h4>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${temperaturaConfig[p.temperatura].cor}`}>
                          {temperaturaConfig[p.temperatura].icone}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{p.fazenda} - {p.cidade}/{p.estado}</p>
                      <p className="text-xs text-gray-400 mb-2">{p.area.toLocaleString('pt-BR')} ha</p>
                      <div className="bg-amber-50 rounded p-2 mb-2">
                        <p className="text-[11px] text-amber-700 font-medium">{p.proximaAcao}</p>
                        <p className="text-[10px] text-amber-500 mt-0.5">{formatDate(p.dataProximaAcao)}</p>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-gray-400">
                        <span>{p.responsavel}</span>
                        <span>{p.interacoes.length} interações</span>
                      </div>
                    </div>
                  ))}
                  {colProspects.length === 0 && (
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                      <p className="text-xs text-gray-400">Nenhum prospect</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List view */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {prospects.map((p) => (
            <ProspectCard key={p.id} prospect={p} onClick={setSelectedProspect} />
          ))}
          {prospects.length === 0 && (
            <div className="col-span-2 card text-center py-12">
              <Eye className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400">Nenhum prospect encontrado</p>
            </div>
          )}
        </div>
      )}

      {/* Prospect detail modal */}
      {selectedProspect && <ProspectModal prospect={selectedProspect} onClose={() => setSelectedProspect(null)} />}
    </div>
  );
}
