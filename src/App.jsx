import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Agenda from './pages/Agenda';
import Clientes from './pages/Clientes';
import ColetaSolo from './pages/ColetaSolo';
import Regulagem from './pages/Regulagem';
import Tecnologia from './pages/Tecnologia';
import Relatorios from './pages/Relatorios';
import FunilVendas from './pages/FunilVendas';
import Prospeccao from './pages/Prospeccao';
import AnaliseSolo from './pages/AnaliseSolo';

const pageTitles = {
  '/': 'Dashboard',
  '/agenda': 'Agenda',
  '/prospeccao': 'Prospecção de Clientes',
  '/funil-vendas': 'Funil de Vendas',
  '/clientes': 'Produtores',
  '/coleta-solo': 'Coleta de Solo',
  '/regulagem': 'Regulagem de Máquinas',
  '/tecnologia': 'Tecnologia de Aplicação',
  '/analise-solo': 'Análise de Solo',
  '/relatorios': 'Relatórios',
};

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Perfil CRM';

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64">
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-4 sm:p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/prospeccao" element={<Prospeccao />} />
            <Route path="/funil-vendas" element={<FunilVendas />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/coleta-solo" element={<ColetaSolo />} />
            <Route path="/regulagem" element={<Regulagem />} />
            <Route path="/tecnologia" element={<Tecnologia />} />
            <Route path="/analise-solo" element={<AnaliseSolo />} />
            <Route path="/relatorios" element={<Relatorios />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
