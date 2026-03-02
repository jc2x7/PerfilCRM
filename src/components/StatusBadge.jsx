const statusConfig = {
  concluido: { label: 'Concluído', classes: 'bg-green-100 text-green-700' },
  em_analise: { label: 'Em Análise', classes: 'bg-blue-100 text-blue-700' },
  agendado: { label: 'Agendado', classes: 'bg-yellow-100 text-yellow-700' },
  em_campo: { label: 'Em Campo', classes: 'bg-orange-100 text-orange-700' },
  em_andamento: { label: 'Em Andamento', classes: 'bg-orange-100 text-orange-700' },
  pendente: { label: 'Pendente', classes: 'bg-gray-100 text-gray-600' },
  confirmado: { label: 'Confirmado', classes: 'bg-green-100 text-green-700' },
  ativo: { label: 'Ativo', classes: 'bg-green-100 text-green-700' },
  inativo: { label: 'Inativo', classes: 'bg-red-100 text-red-600' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || { label: status, classes: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`badge ${config.classes}`}>
      {config.label}
    </span>
  );
}
