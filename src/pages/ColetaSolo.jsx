import { useState } from 'react';
import { Plus, FlaskConical, TestTube, Beaker, Eye, X } from 'lucide-react';
import { coletasSolo } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';

export default function ColetaSolo() {
  const [selectedColeta, setSelectedColeta] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    cliente: '', fazenda: '', talhao: '', dataColeta: '', amostras: '', profundidade: '0-20cm / 20-40cm', observacoes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowForm(false);
    setFormData({ cliente: '', fazenda: '', talhao: '', dataColeta: '', amostras: '', profundidade: '0-20cm / 20-40cm', observacoes: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            {['concluido', 'em_analise', 'em_campo', 'agendado'].map((status) => {
              const count = coletasSolo.filter((c) => c.status === status).length;
              return (
                <div key={status} className="text-center">
                  <StatusBadge status={status} />
                  <p className="text-xs text-gray-400 mt-1">{count}</p>
                </div>
              );
            })}
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nova Coleta
        </button>
      </div>

      {showForm && (
        <div className="card border-perfil-200 bg-perfil-50/30">
          <h3 className="font-semibold text-gray-800 mb-4">Registrar Nova Coleta</h3>
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
              <label className="block text-sm font-medium text-gray-600 mb-1">Talhão</label>
              <input className="input-field" value={formData.talhao} onChange={(e) => setFormData({ ...formData, talhao: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Data da Coleta</label>
              <input type="date" className="input-field" value={formData.dataColeta} onChange={(e) => setFormData({ ...formData, dataColeta: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nº de Amostras</label>
              <input type="number" className="input-field" value={formData.amostras} onChange={(e) => setFormData({ ...formData, amostras: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Profundidade</label>
              <select className="input-field" value={formData.profundidade} onChange={(e) => setFormData({ ...formData, profundidade: e.target.value })}>
                <option value="0-20cm">0-20cm</option>
                <option value="0-20cm / 20-40cm">0-20cm / 20-40cm</option>
                <option value="0-20cm / 20-40cm / 40-60cm">0-20cm / 20-40cm / 40-60cm</option>
              </select>
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

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide py-3 px-4">Cliente / Fazenda</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide py-3 px-4">Talhão</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide py-3 px-4">Data</th>
              <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide py-3 px-4">Amostras</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide py-3 px-4">Profundidade</th>
              <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide py-3 px-4">Status</th>
              <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide py-3 px-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {coletasSolo.map((coleta) => (
              <tr key={coleta.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <p className="text-sm font-medium text-gray-800">{coleta.cliente}</p>
                  <p className="text-xs text-gray-500">{coleta.fazenda}</p>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{coleta.talhao}</td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {new Date(coleta.dataColeta + 'T12:00:00').toLocaleDateString('pt-BR')}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 text-center">{coleta.amostras}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{coleta.profundidade}</td>
                <td className="py-3 px-4 text-center">
                  <StatusBadge status={coleta.status} />
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => setSelectedColeta(coleta)}
                    className="text-perfil-600 hover:text-perfil-700 p-1"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedColeta && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedColeta(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-perfil-500" />
                Detalhes da Coleta
              </h3>
              <button onClick={() => setSelectedColeta(null)} className="p-1 rounded hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Cliente</p>
                  <p className="font-medium">{selectedColeta.cliente}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Fazenda</p>
                  <p className="font-medium">{selectedColeta.fazenda}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Talhão</p>
                  <p className="font-medium">{selectedColeta.talhao}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Amostras</p>
                  <p className="font-medium">{selectedColeta.amostras}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <StatusBadge status={selectedColeta.status} />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400">Profundidade</p>
                <p className="font-medium">{selectedColeta.profundidade}</p>
              </div>

              {selectedColeta.resultadoLab && (
                <div className="mt-4 p-4 bg-perfil-50 rounded-xl">
                  <h4 className="text-sm font-semibold text-perfil-700 mb-3 flex items-center gap-2">
                    <TestTube className="w-4 h-4" /> Resultado Laboratorial
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-gray-400">pH</p>
                      <p className="text-lg font-bold text-gray-800">{selectedColeta.ph}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-gray-400">M.O. (%)</p>
                      <p className="text-lg font-bold text-gray-800">{selectedColeta.materiaOrganica}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Fósforo (mg/dm³)</p>
                      <p className="text-lg font-bold text-gray-800">{selectedColeta.fosforo}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Potássio (mg/dm³)</p>
                      <p className="text-lg font-bold text-gray-800">{selectedColeta.potassio}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedColeta.observacoes && (
                <div>
                  <p className="text-sm text-gray-400">Observações</p>
                  <p className="text-sm text-gray-600">{selectedColeta.observacoes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
