import { useState } from 'react';
import { Plus, Search, MapPin, Phone, Mail, Wheat, Eye, X } from 'lucide-react';
import { clientes } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';

export default function Clientes() {
  const [busca, setBusca] = useState('');
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nome: '', fazenda: '', cidade: '', estado: '', area: '', telefone: '', email: '', culturas: '',
  });

  const filtered = clientes.filter(
    (c) =>
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.fazenda.toLowerCase().includes(busca.toLowerCase()) ||
      c.cidade.toLowerCase().includes(busca.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowForm(false);
    setFormData({ nome: '', fazenda: '', cidade: '', estado: '', area: '', telefone: '', email: '', culturas: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center bg-white rounded-lg px-3 py-2 gap-2 border border-gray-200 w-full sm:w-auto">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar produtor, fazenda ou cidade..."
            className="bg-transparent text-sm outline-none w-full sm:w-64 placeholder-gray-400"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Produtor
        </button>
      </div>

      {showForm && (
        <div className="card border-perfil-200 bg-perfil-50/30">
          <h3 className="font-semibold text-gray-800 mb-4">Cadastrar Produtor</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nome Completo</label>
              <input className="input-field" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nome da Fazenda</label>
              <input className="input-field" value={formData.fazenda} onChange={(e) => setFormData({ ...formData, fazenda: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Cidade</label>
              <input className="input-field" value={formData.cidade} onChange={(e) => setFormData({ ...formData, cidade: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Estado</label>
              <select className="input-field" value={formData.estado} onChange={(e) => setFormData({ ...formData, estado: e.target.value })} required>
                <option value="">Selecione</option>
                <option value="GO">GO</option>
                <option value="MT">MT</option>
                <option value="MS">MS</option>
                <option value="BA">BA</option>
                <option value="MG">MG</option>
                <option value="SP">SP</option>
                <option value="PR">PR</option>
                <option value="RS">RS</option>
                <option value="TO">TO</option>
                <option value="MA">MA</option>
                <option value="PI">PI</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Área Total (ha)</label>
              <input type="number" className="input-field" value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Telefone</label>
              <input className="input-field" value={formData.telefone} onChange={(e) => setFormData({ ...formData, telefone: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <input type="email" className="input-field" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Culturas (separadas por vírgula)</label>
              <input className="input-field" placeholder="Soja, Milho" value={formData.culturas} onChange={(e) => setFormData({ ...formData, culturas: e.target.value })} />
            </div>
            <div className="flex items-end gap-2">
              <button type="submit" className="btn-primary">Cadastrar</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((cliente) => (
          <div key={cliente.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-800">{cliente.nome}</h3>
                <p className="text-sm text-perfil-600 font-medium">{cliente.fazenda}</p>
              </div>
              <StatusBadge status={cliente.status} />
            </div>

            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                {cliente.cidade} - {cliente.estado}
              </div>
              <div className="flex items-center gap-2">
                <Wheat className="w-4 h-4 text-gray-400" />
                {cliente.area.toLocaleString('pt-BR')} ha · {cliente.culturas.join(', ')}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                {cliente.telefone}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                {cliente.email}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                Último serviço: {new Date(cliente.ultimoServico + 'T12:00:00').toLocaleDateString('pt-BR')}
              </span>
              <button
                onClick={() => setSelectedCliente(cliente)}
                className="text-perfil-600 hover:text-perfil-700 text-sm font-medium flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" /> Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedCliente && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedCliente(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Detalhes do Produtor</h3>
              <button onClick={() => setSelectedCliente(null)} className="p-1 rounded hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400">Nome</p>
                <p className="font-medium">{selectedCliente.nome}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Fazenda</p>
                <p className="font-medium">{selectedCliente.fazenda}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Cidade/UF</p>
                  <p className="font-medium">{selectedCliente.cidade} - {selectedCliente.estado}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Área Total</p>
                  <p className="font-medium">{selectedCliente.area.toLocaleString('pt-BR')} ha</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Telefone</p>
                  <p className="font-medium">{selectedCliente.telefone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="font-medium text-sm">{selectedCliente.email}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400">Culturas</p>
                <div className="flex gap-2 mt-1">
                  {selectedCliente.culturas.map((c) => (
                    <span key={c} className="badge bg-perfil-100 text-perfil-700">{c}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <StatusBadge status={selectedCliente.status} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
