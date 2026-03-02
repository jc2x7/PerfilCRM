import { useState } from 'react';
import { Plus, Satellite, Map, Eye, X, ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { tecnologiaAplicacao } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';

const tipoColors = {
  'Taxa Variável': 'bg-blue-100 text-blue-700',
  'Mapeamento NDVI': 'bg-green-100 text-green-700',
  'Mapa de Colheita': 'bg-purple-100 text-purple-700',
  'Prescrição de Sementes': 'bg-orange-100 text-orange-700',
};

export default function Tecnologia() {
  const [selectedTec, setSelectedTec] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    cliente: '', fazenda: '', data: '', tipo: 'Taxa Variável', produto: '', area: '', observacoes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowForm(false);
    setFormData({ cliente: '', fazenda: '', data: '', tipo: 'Taxa Variável', produto: '', area: '', observacoes: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {Object.entries(tipoColors).map(([tipo, classes]) => {
            const count = tecnologiaAplicacao.filter((t) => t.tipo === tipo).length;
            return (
              <span key={tipo} className={`badge ${classes}`}>
                {tipo}: {count}
              </span>
            );
          })}
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Serviço
        </button>
      </div>

      {showForm && (
        <div className="card border-blue-200 bg-blue-50/30">
          <h3 className="font-semibold text-gray-800 mb-4">Novo Serviço de Tecnologia</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Cliente</label>
              <input className="input-field" value={formData.cliente} onChange={(e) => setFormData({ ...formData, cliente: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Fazenda</label>
              <input className="input-field" value={formData.fazenda} onChange={(e) => setFormData({ ...formData, fazenda: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Tipo de Serviço</label>
              <select className="input-field" value={formData.tipo} onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}>
                <option value="Taxa Variável">Taxa Variável</option>
                <option value="Mapeamento NDVI">Mapeamento NDVI</option>
                <option value="Mapa de Colheita">Mapa de Colheita</option>
                <option value="Prescrição de Sementes">Prescrição de Sementes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Data</label>
              <input type="date" className="input-field" value={formData.data} onChange={(e) => setFormData({ ...formData, data: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Produto (se aplicável)</label>
              <input className="input-field" value={formData.produto} onChange={(e) => setFormData({ ...formData, produto: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Área (ha)</label>
              <input type="number" className="input-field" value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })} required />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">Observações</label>
              <input className="input-field" value={formData.observacoes} onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })} />
            </div>
            <div className="flex items-end gap-2">
              <button type="submit" className="btn-primary">Registrar</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {tecnologiaAplicacao.map((tec) => (
          <div key={tec.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <span className={`badge ${tipoColors[tec.tipo]}`}>{tec.tipo}</span>
              <StatusBadge status={tec.status} />
            </div>

            <h3 className="font-semibold text-gray-800">{tec.cliente}</h3>
            <p className="text-sm text-gray-500 mb-3">{tec.fazenda}</p>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <p className="text-xs text-gray-400">Área</p>
                <p className="text-sm font-medium text-gray-700">{tec.area} ha</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <p className="text-xs text-gray-400">Data</p>
                <p className="text-sm font-medium text-gray-700">
                  {new Date(tec.data + 'T12:00:00').toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            {tec.produto && (
              <p className="text-sm text-gray-500 mb-2">
                <strong>Produto:</strong> {tec.produto}
              </p>
            )}

            <div className="flex items-center gap-2 mb-3">
              <Map className={`w-4 h-4 ${tec.mapaGerado ? 'text-perfil-500' : 'text-gray-300'}`} />
              <span className={`text-sm ${tec.mapaGerado ? 'text-perfil-600 font-medium' : 'text-gray-400'}`}>
                {tec.mapaGerado ? 'Mapa Gerado' : 'Mapa Pendente'}
              </span>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedTec(tec)}
                className="text-perfil-600 hover:text-perfil-700 text-sm font-medium flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" /> Ver Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedTec && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedTec(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Satellite className="w-5 h-5 text-blue-500" />
                Detalhes do Serviço
              </h3>
              <button onClick={() => setSelectedTec(null)} className="p-1 rounded hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Cliente</p>
                  <p className="font-medium">{selectedTec.cliente}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Fazenda</p>
                  <p className="font-medium">{selectedTec.fazenda}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Tipo</p>
                  <span className={`badge ${tipoColors[selectedTec.tipo]}`}>{selectedTec.tipo}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Área</p>
                  <p className="font-medium">{selectedTec.area} ha</p>
                </div>
              </div>

              {selectedTec.taxaMedia && (
                <div className="p-4 bg-blue-50 rounded-xl">
                  <h4 className="text-sm font-semibold text-blue-700 mb-3">Dados de Taxa Variável</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white p-3 rounded-lg text-center">
                      <ArrowDown className="w-4 h-4 text-green-500 mx-auto mb-1" />
                      <p className="text-xs text-gray-400">Mínima</p>
                      <p className="font-bold text-sm">{selectedTec.taxaMinima}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg text-center">
                      <Minus className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                      <p className="text-xs text-gray-400">Média</p>
                      <p className="font-bold text-sm">{selectedTec.taxaMedia}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg text-center">
                      <ArrowUp className="w-4 h-4 text-red-500 mx-auto mb-1" />
                      <p className="text-xs text-gray-400">Máxima</p>
                      <p className="font-bold text-sm">{selectedTec.taxaMaxima}</p>
                    </div>
                  </div>
                  {selectedTec.economia && (
                    <p className="text-sm text-green-600 font-medium mt-3 text-center">
                      Economia estimada: {selectedTec.economia}% de insumo
                    </p>
                  )}
                </div>
              )}

              {selectedTec.observacoes && (
                <div>
                  <p className="text-sm text-gray-400">Observações</p>
                  <p className="text-sm text-gray-600">{selectedTec.observacoes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
