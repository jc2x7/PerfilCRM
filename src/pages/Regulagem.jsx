import { useState } from 'react';
import { Plus, Wrench, Eye, X, Gauge, Zap } from 'lucide-react';
import { regulagens } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';

const tipoIcons = {
  Pulverizador: '🚜',
  Plantadeira: '🌱',
  Distribuidor: '📦',
};

export default function Regulagem() {
  const [selectedReg, setSelectedReg] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    cliente: '', fazenda: '', maquina: '', tipo: 'Pulverizador', data: '', observacoes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowForm(false);
    setFormData({ cliente: '', fazenda: '', maquina: '', tipo: 'Pulverizador', data: '', observacoes: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {['Pulverizador', 'Plantadeira', 'Distribuidor'].map((tipo) => {
            const count = regulagens.filter((r) => r.tipo === tipo).length;
            return (
              <div key={tipo} className="flex items-center gap-2 text-sm text-gray-500">
                <span>{tipoIcons[tipo]}</span>
                <span>{tipo}: <strong className="text-gray-700">{count}</strong></span>
              </div>
            );
          })}
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nova Regulagem
        </button>
      </div>

      {showForm && (
        <div className="card border-terra-200 bg-terra-50/30">
          <h3 className="font-semibold text-gray-800 mb-4">Registrar Nova Regulagem</h3>
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
              <label className="block text-sm font-medium text-gray-600 mb-1">Máquina / Equipamento</label>
              <input className="input-field" value={formData.maquina} onChange={(e) => setFormData({ ...formData, maquina: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Tipo</label>
              <select className="input-field" value={formData.tipo} onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}>
                <option value="Pulverizador">Pulverizador</option>
                <option value="Plantadeira">Plantadeira</option>
                <option value="Distribuidor">Distribuidor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Data</label>
              <input type="date" className="input-field" value={formData.data} onChange={(e) => setFormData({ ...formData, data: e.target.value })} required />
            </div>
            <div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {regulagens.map((reg) => (
          <div key={reg.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{tipoIcons[reg.tipo]}</span>
                <div>
                  <h3 className="font-semibold text-gray-800">{reg.maquina}</h3>
                  <p className="text-sm text-gray-500">{reg.cliente} · {reg.fazenda}</p>
                </div>
              </div>
              <StatusBadge status={reg.status} />
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <p className="text-xs text-gray-400">Tipo</p>
                <p className="text-sm font-medium text-gray-700">{reg.tipo}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <p className="text-xs text-gray-400">Data</p>
                <p className="text-sm font-medium text-gray-700">
                  {new Date(reg.data + 'T12:00:00').toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <p className="text-xs text-gray-400">Velocidade</p>
                <p className="text-sm font-medium text-gray-700">{reg.velocidade} km/h</p>
              </div>
            </div>

            {reg.observacoes && (
              <p className="text-sm text-gray-500 mb-3">{reg.observacoes}</p>
            )}

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedReg(reg)}
                className="text-perfil-600 hover:text-perfil-700 text-sm font-medium flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" /> Ver Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedReg && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedReg(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-terra-500" />
                Detalhes da Regulagem
              </h3>
              <button onClick={() => setSelectedReg(null)} className="p-1 rounded hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400">Máquina</p>
                <p className="font-medium">{selectedReg.maquina}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Cliente</p>
                  <p className="font-medium">{selectedReg.cliente}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Fazenda</p>
                  <p className="font-medium">{selectedReg.fazenda}</p>
                </div>
              </div>

              {selectedReg.tipo === 'Pulverizador' && (
                <div className="p-4 bg-blue-50 rounded-xl">
                  <h4 className="text-sm font-semibold text-blue-700 mb-3 flex items-center gap-2">
                    <Gauge className="w-4 h-4" /> Dados de Pulverização
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Vazão Desejada</p>
                      <p className="font-bold">{selectedReg.vazaoDesejada} L/min</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Vazão Real</p>
                      <p className="font-bold">{selectedReg.vazaoReal ?? '---'} L/min</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Pressão</p>
                      <p className="font-bold">{selectedReg.pressao} bar</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Volume de Calda</p>
                      <p className="font-bold">{selectedReg.volumeCalda}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Pontas/Bicos</p>
                      <p className="font-bold">{selectedReg.pontasBicos}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Largura da Barra</p>
                      <p className="font-bold">{selectedReg.larguraBarra}m</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedReg.tipo === 'Plantadeira' && (
                <div className="p-4 bg-green-50 rounded-xl">
                  <h4 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4" /> Dados de Plantio
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-gray-400">População</p>
                      <p className="font-bold">{selectedReg.populacao?.toLocaleString('pt-BR')} sem/ha</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Espaçamento</p>
                      <p className="font-bold">{selectedReg.espacamento}m</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Profundidade</p>
                      <p className="font-bold">{selectedReg.profundidade}cm</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Discos de Corte</p>
                      <p className="font-bold">{selectedReg.discosCorte}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedReg.tipo === 'Distribuidor' && (
                <div className="p-4 bg-orange-50 rounded-xl">
                  <h4 className="text-sm font-semibold text-orange-700 mb-3">Dados de Distribuição</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Taxa de Aplicação</p>
                      <p className="font-bold">{selectedReg.taxaAplicacao} kg/ha</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Largura Efetiva</p>
                      <p className="font-bold">{selectedReg.larguraEfetiva}m</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedReg.observacoes && (
                <div>
                  <p className="text-sm text-gray-400">Observações</p>
                  <p className="text-sm text-gray-600">{selectedReg.observacoes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
