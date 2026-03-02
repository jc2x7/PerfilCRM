import { useState } from 'react';
import { Plus, Clock, MapPin, User, Filter } from 'lucide-react';
import { agenda } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';

const tipoLabels = {
  coleta: { label: 'Coleta de Solo', color: 'bg-perfil-500' },
  regulagem: { label: 'Regulagem', color: 'bg-terra-500' },
  tecnologia: { label: 'Tecnologia', color: 'bg-blue-500' },
  visita: { label: 'Visita', color: 'bg-purple-500' },
};

const prioridadeColors = {
  alta: 'border-l-red-500',
  media: 'border-l-yellow-500',
  baixa: 'border-l-blue-300',
};

export default function Agenda() {
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '', cliente: '', data: '', horario: '', tipo: 'coleta', prioridade: 'media', responsavel: '', descricao: '',
  });

  const filtered = filtroTipo === 'todos' ? agenda : agenda.filter((a) => a.tipo === filtroTipo);

  const grouped = filtered.reduce((acc, item) => {
    const dateKey = item.data;
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(item);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowForm(false);
    setFormData({ titulo: '', cliente: '', data: '', horario: '', tipo: 'coleta', prioridade: 'media', responsavel: '', descricao: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-400" />
          {['todos', 'coleta', 'regulagem', 'tecnologia', 'visita'].map((tipo) => (
            <button
              key={tipo}
              onClick={() => setFiltroTipo(tipo)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filtroTipo === tipo
                  ? 'bg-perfil-500 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tipo === 'todos' ? 'Todos' : tipoLabels[tipo].label}
            </button>
          ))}
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Agendamento
        </button>
      </div>

      {showForm && (
        <div className="card border-perfil-200 bg-perfil-50/30">
          <h3 className="font-semibold text-gray-800 mb-4">Novo Agendamento</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Título</label>
              <input className="input-field" value={formData.titulo} onChange={(e) => setFormData({ ...formData, titulo: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Cliente</label>
              <input className="input-field" value={formData.cliente} onChange={(e) => setFormData({ ...formData, cliente: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Data</label>
              <input type="date" className="input-field" value={formData.data} onChange={(e) => setFormData({ ...formData, data: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Horário</label>
              <input type="time" className="input-field" value={formData.horario} onChange={(e) => setFormData({ ...formData, horario: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Tipo</label>
              <select className="input-field" value={formData.tipo} onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}>
                <option value="coleta">Coleta de Solo</option>
                <option value="regulagem">Regulagem</option>
                <option value="tecnologia">Tecnologia</option>
                <option value="visita">Visita</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Prioridade</label>
              <select className="input-field" value={formData.prioridade} onChange={(e) => setFormData({ ...formData, prioridade: e.target.value })}>
                <option value="alta">Alta</option>
                <option value="media">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Responsável</label>
              <input className="input-field" value={formData.responsavel} onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">Descrição</label>
              <input className="input-field" value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} />
            </div>
            <div className="flex items-end gap-2">
              <button type="submit" className="btn-primary">Salvar</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {sortedDates.map((date) => (
          <div key={date}>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
              })}
            </h3>
            <div className="space-y-3">
              {grouped[date].map((item) => (
                <div
                  key={item.id}
                  className={`card border-l-4 ${prioridadeColors[item.prioridade]} py-4`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${tipoLabels[item.tipo].color} shrink-0 hidden sm:block`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium text-gray-800">{item.titulo}</h4>
                        <span className={`badge bg-gray-100 text-gray-600`}>
                          {tipoLabels[item.tipo].label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{item.descricao}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {item.horario}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" /> {item.responsavel}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {item.cliente}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
