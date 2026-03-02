import { useState } from 'react';
import {
  Filter,
  Plus,
  DollarSign,
  Clock,
  User,
  ChevronRight,
  X,
  TrendingUp,
  Target,
  CheckCircle2,
  AlertCircle,
  GripVertical,
  Calendar,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { funilVendas } from '../data/mockData';

const etapas = [
  {
    id: 'orcamento',
    label: 'Orçamento',
    cor: 'bg-gray-500',
    corClara: 'bg-gray-50 border-gray-200',
    corTexto: 'text-gray-700',
    icone: FileText,
  },
  {
    id: 'proposta_enviada',
    label: 'Proposta Enviada',
    cor: 'bg-blue-500',
    corClara: 'bg-blue-50 border-blue-200',
    corTexto: 'text-blue-700',
    icone: ArrowRight,
  },
  {
    id: 'negociacao',
    label: 'Negociação',
    cor: 'bg-amber-500',
    corClara: 'bg-amber-50 border-amber-200',
    corTexto: 'text-amber-700',
    icone: Target,
  },
  {
    id: 'fechamento',
    label: 'Fechamento',
    cor: 'bg-orange-500',
    corClara: 'bg-orange-50 border-orange-200',
    corTexto: 'text-orange-700',
    icone: AlertCircle,
  },
  {
    id: 'venda_concluida',
    label: 'Venda Concluída',
    cor: 'bg-perfil-500',
    corClara: 'bg-perfil-50 border-perfil-200',
    corTexto: 'text-perfil-700',
    icone: CheckCircle2,
  },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(value);

const formatDate = (dateStr) => {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
};

function KanbanCard({ deal, onClick }) {
  const probColor =
    deal.probabilidade >= 70
      ? 'text-green-600 bg-green-50'
      : deal.probabilidade >= 40
        ? 'text-amber-600 bg-amber-50'
        : 'text-red-500 bg-red-50';

  return (
    <div
      onClick={() => onClick(deal)}
      className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md hover:border-gray-300 transition-all group"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-800 leading-tight pr-2">{deal.titulo}</h4>
        <GripVertical className="w-4 h-4 text-gray-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <p className="text-xs text-gray-500 mb-3">{deal.cliente} - {deal.fazenda}</p>

      <div className="flex flex-wrap gap-1 mb-3">
        {deal.servicos.slice(0, 2).map((s) => (
          <span key={s} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
            {s}
          </span>
        ))}
        {deal.servicos.length > 2 && (
          <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
            +{deal.servicos.length - 2}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-gray-900">{formatCurrency(deal.valor)}</span>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${probColor}`}>
          {deal.probabilidade}%
        </span>
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1 text-[11px] text-gray-400">
          <Clock className="w-3 h-3" />
          {formatDate(deal.ultimaInteracao)}
        </div>
        <div className="flex items-center gap-1 text-[11px] text-gray-400">
          <User className="w-3 h-3" />
          {deal.responsavel.split(' ')[0]}
        </div>
      </div>
    </div>
  );
}

function DealModal({ deal, onClose }) {
  if (!deal) return null;
  const etapa = etapas.find((e) => e.id === deal.etapa);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{deal.titulo}</h2>
            <p className="text-sm text-gray-500">{deal.cliente}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${etapa.corClara} ${etapa.corTexto} border`}>
              <etapa.icone className="w-3.5 h-3.5" />
              {etapa.label}
            </span>
            <span className={`text-xs font-bold px-2 py-1 rounded ${deal.probabilidade >= 70 ? 'text-green-600 bg-green-50' : deal.probabilidade >= 40 ? 'text-amber-600 bg-amber-50' : 'text-red-500 bg-red-50'}`}>
              {deal.probabilidade}% probabilidade
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Valor</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(deal.valor)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Valor Ponderado</p>
              <p className="text-lg font-bold text-perfil-600">{formatCurrency(deal.valor * deal.probabilidade / 100)}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Fazenda</p>
                <p className="text-sm font-medium text-gray-800">{deal.fazenda}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Responsável</p>
                <p className="text-sm font-medium text-gray-800">{deal.responsavel}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Abertura / Previsão de Fechamento</p>
                <p className="text-sm font-medium text-gray-800">
                  {formatDate(deal.dataAbertura)} <ChevronRight className="w-3 h-3 inline text-gray-400" /> {formatDate(deal.previsaoFechamento)}
                </p>
              </div>
            </div>
            {deal.dataFechamento && (
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-perfil-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Data do Fechamento</p>
                  <p className="text-sm font-bold text-perfil-600">{formatDate(deal.dataFechamento)}</p>
                </div>
              </div>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Serviços</p>
            <div className="flex flex-wrap gap-1.5">
              {deal.servicos.map((s) => (
                <span key={s} className="text-xs bg-perfil-50 text-perfil-700 px-2.5 py-1 rounded-lg border border-perfil-100">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Observações</p>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{deal.observacoes}</p>
          </div>

          {deal.etapa !== 'venda_concluida' && (
            <div className="flex gap-2 pt-2">
              <button className="btn-primary flex-1 text-sm">Avançar Etapa</button>
              <button className="btn-secondary text-sm">Editar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FunilVendas() {
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [filtroResponsavel, setFiltroResponsavel] = useState('todos');

  const responsaveis = [...new Set(funilVendas.map((d) => d.responsavel))];

  const deals = filtroResponsavel === 'todos'
    ? funilVendas
    : funilVendas.filter((d) => d.responsavel === filtroResponsavel);

  const totalPipeline = deals.filter((d) => d.etapa !== 'venda_concluida').reduce((sum, d) => sum + d.valor, 0);
  const totalPonderado = deals.filter((d) => d.etapa !== 'venda_concluida').reduce((sum, d) => sum + (d.valor * d.probabilidade) / 100, 0);
  const totalFechado = deals.filter((d) => d.etapa === 'venda_concluida').reduce((sum, d) => sum + d.valor, 0);
  const totalDeals = deals.filter((d) => d.etapa !== 'venda_concluida').length;

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card flex items-center gap-4">
          <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center">
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Negócios Abertos</p>
            <p className="text-xl font-bold text-gray-900">{totalDeals}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Pipeline</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(totalPipeline)}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-11 h-11 bg-purple-50 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Valor Ponderado</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(totalPonderado)}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-11 h-11 bg-perfil-50 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-perfil-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Fechado no Mês</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(totalFechado)}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filtroResponsavel}
            onChange={(e) => setFiltroResponsavel(e.target.value)}
            className="input-field w-auto text-sm"
          >
            <option value="todos">Todos os responsáveis</option>
            {responsaveis.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Novo Negócio
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {etapas.map((etapa) => {
          const colDeals = deals.filter((d) => d.etapa === etapa.id);
          const colTotal = colDeals.reduce((sum, d) => sum + d.valor, 0);

          return (
            <div key={etapa.id} className="flex-shrink-0 w-72">
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${etapa.cor}`} />
                  <h3 className="text-sm font-semibold text-gray-700">{etapa.label}</h3>
                  <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full ml-auto">
                    {colDeals.length}
                  </span>
                </div>
                <p className="text-xs text-gray-400 pl-[18px]">{formatCurrency(colTotal)}</p>
              </div>

              <div className="space-y-3 min-h-[100px]">
                {colDeals.map((deal) => (
                  <KanbanCard key={deal.id} deal={deal} onClick={setSelectedDeal} />
                ))}
                {colDeals.length === 0 && (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                    <p className="text-xs text-gray-400">Nenhum negócio</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Deal detail modal */}
      {selectedDeal && <DealModal deal={selectedDeal} onClose={() => setSelectedDeal(null)} />}
    </div>
  );
}
