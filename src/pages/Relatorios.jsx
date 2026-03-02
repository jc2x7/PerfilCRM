import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { FileBarChart, Download, Printer, TrendingUp, Users, MapPin, FlaskConical } from 'lucide-react';
import { clientes, coletasSolo, regulagens, tecnologiaAplicacao, faturamentoMensal, servicosPorTipo } from '../data/mockData';

const areasPorEstado = [
  { estado: 'MT', area: 9200, clientes: 2 },
  { estado: 'BA', area: 6300, clientes: 2 },
  { estado: 'GO', area: 3000, clientes: 2 },
  { estado: 'MS', area: 2200, clientes: 1 },
  { estado: 'MG', area: 800, clientes: 1 },
];

const coletasPorMes = [
  { mes: 'Set', coletas: 8, amostras: 120 },
  { mes: 'Out', coletas: 12, amostras: 180 },
  { mes: 'Nov', coletas: 15, amostras: 240 },
  { mes: 'Dez', coletas: 10, amostras: 160 },
  { mes: 'Jan', coletas: 18, amostras: 290 },
  { mes: 'Fev', coletas: 22, amostras: 350 },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(value);

export default function Relatorios() {
  const totalArea = clientes.reduce((sum, c) => sum + c.area, 0);
  const totalAmostras = coletasSolo.reduce((sum, c) => sum + c.amostras, 0);
  const totalRegulagens = regulagens.length;
  const totalMapas = tecnologiaAplicacao.filter((t) => t.mapaGerado).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileBarChart className="w-5 h-5 text-perfil-500" />
          <span className="text-sm text-gray-500">Relatórios consolidados da safra 2025/26</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary flex items-center gap-2 text-sm">
            <Printer className="w-4 h-4" /> Imprimir
          </button>
          <button className="btn-primary flex items-center gap-2 text-sm">
            <Download className="w-4 h-4" /> Exportar PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card text-center">
          <Users className="w-6 h-6 text-perfil-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{clientes.length}</p>
          <p className="text-sm text-gray-500">Produtores</p>
        </div>
        <div className="card text-center">
          <MapPin className="w-6 h-6 text-terra-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{totalArea.toLocaleString('pt-BR')}</p>
          <p className="text-sm text-gray-500">Hectares Atendidos</p>
        </div>
        <div className="card text-center">
          <FlaskConical className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{totalAmostras}</p>
          <p className="text-sm text-gray-500">Amostras Coletadas</p>
        </div>
        <div className="card text-center">
          <TrendingUp className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{totalMapas}</p>
          <p className="text-sm text-gray-500">Mapas Gerados</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Faturamento Mensal</h3>
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
          <h3 className="font-semibold text-gray-800 mb-4">Coletas e Amostras por Mês</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={coletasPorMes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#888' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#888' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#888' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
              <Line yAxisId="left" type="monotone" dataKey="coletas" stroke="#2d8c3c" strokeWidth={2} name="Coletas" dot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="amostras" stroke="#c47d2a" strokeWidth={2} name="Amostras" dot={{ r: 4 }} />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Área Atendida por Estado</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={areasPorEstado} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#888' }} tickFormatter={(v) => `${v.toLocaleString()} ha`} />
              <YAxis type="category" dataKey="estado" tick={{ fontSize: 12, fill: '#888' }} width={40} />
              <Tooltip
                formatter={(value) => [`${value.toLocaleString()} ha`, 'Área']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="area" fill="#c47d2a" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Distribuição de Serviços</h3>
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
                label={({ nome, quantidade }) => `${quantidade}`}
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
        <h3 className="font-semibold text-gray-800 mb-4">Resumo por Produtor</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide py-3 px-4">Produtor</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide py-3 px-4">Fazenda</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide py-3 px-4">Área (ha)</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide py-3 px-4">Coletas</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide py-3 px-4">Regulagens</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide py-3 px-4">Tec. Aplicação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clientes.filter((c) => c.status === 'ativo').map((c) => {
                const nColetas = coletasSolo.filter((col) => col.clienteId === c.id).length;
                const nReg = regulagens.filter((r) => r.clienteId === c.id).length;
                const nTec = tecnologiaAplicacao.filter((t) => t.clienteId === c.id).length;
                return (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-gray-800">{c.nome}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{c.fazenda}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 text-center">{c.area.toLocaleString('pt-BR')}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`badge ${nColetas > 0 ? 'bg-perfil-100 text-perfil-700' : 'bg-gray-100 text-gray-400'}`}>
                        {nColetas}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`badge ${nReg > 0 ? 'bg-terra-100 text-terra-700' : 'bg-gray-100 text-gray-400'}`}>
                        {nReg}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`badge ${nTec > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                        {nTec}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
