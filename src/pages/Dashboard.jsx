import {
  Users,
  ClipboardList,
  MapPin,
  FlaskConical,
  Wrench,
  Map,
  TrendingUp,
  ArrowUpRight,
  Calendar,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { dashboardStats, faturamentoMensal, servicosPorTipo, agenda } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';

const kpis = [
  { label: 'Clientes Ativos', value: dashboardStats.clientesAtivos, icon: Users, color: 'bg-perfil-500', trend: '+2 este mês' },
  { label: 'Serviços no Mês', value: dashboardStats.servicosMes, icon: ClipboardList, color: 'bg-blue-500', trend: '+5 vs. mês anterior' },
  { label: 'Área Atendida (ha)', value: dashboardStats.areaAtendida.toLocaleString('pt-BR'), icon: MapPin, color: 'bg-terra-500', trend: '14.520 hectares' },
  { label: 'Coletas Pendentes', value: dashboardStats.coletasPendentes, icon: FlaskConical, color: 'bg-yellow-500', trend: '3 para agendar' },
  { label: 'Regulagens no Mês', value: dashboardStats.regulagensMes, icon: Wrench, color: 'bg-orange-500', trend: '+3 vs. mês anterior' },
  { label: 'Mapas Gerados', value: dashboardStats.mapasGerados, icon: Map, color: 'bg-purple-500', trend: '12 mapas entregues' },
];

const proximosAgendamentos = agenda.slice(0, 4);

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(value);

const tipoIcons = {
  coleta: '🧪',
  regulagem: '🔧',
  tecnologia: '🛰️',
  visita: '📋',
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="card flex items-start gap-4">
            <div className={`${kpi.color} text-white p-3 rounded-xl shrink-0`}>
              <kpi.icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-gray-500">{kpi.label}</p>
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {kpi.trend}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Faturamento Mensal</h3>
            <span className="badge bg-perfil-100 text-perfil-700">Últimos 6 meses</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={faturamentoMensal}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#888' }} />
              <YAxis tick={{ fontSize: 12, fill: '#888' }} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip
                formatter={(value) => [formatCurrency(value), 'Faturamento']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="valor" fill="#2d8c3c" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Serviços por Tipo</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={servicosPorTipo}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={4}
                dataKey="quantidade"
                nameKey="nome"
              >
                {servicosPorTipo.map((entry) => (
                  <Cell key={entry.nome} fill={entry.cor} />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
              />
              <Tooltip
                formatter={(value, name) => [`${value} serviços`, name]}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-perfil-500" />
            Próximos Agendamentos
          </h3>
          <a href="/agenda" className="text-sm text-perfil-600 hover:text-perfil-700 font-medium flex items-center gap-1">
            Ver todos <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="divide-y divide-gray-100">
          {proximosAgendamentos.map((item) => (
            <div key={item.id} className="flex items-center gap-4 py-3">
              <div className="text-xl">{tipoIcons[item.tipo]}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{item.titulo}</p>
                <p className="text-xs text-gray-500">{item.cliente} · {item.horario}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm text-gray-600">
                  {new Date(item.data + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                </p>
                <StatusBadge status={item.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
