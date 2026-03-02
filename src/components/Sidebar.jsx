import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  FlaskConical,
  Wrench,
  Satellite,
  FileBarChart,
  Leaf,
  Funnel,
  UserPlus,
} from 'lucide-react';

const sections = [
  {
    title: null,
    links: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/agenda', icon: CalendarDays, label: 'Agenda' },
    ],
  },
  {
    title: 'Comercial',
    links: [
      { to: '/prospeccao', icon: UserPlus, label: 'Prospecção' },
      { to: '/funil-vendas', icon: Funnel, label: 'Funil de Vendas' },
      { to: '/clientes', icon: Users, label: 'Produtores' },
    ],
  },
  {
    title: 'Serviços',
    links: [
      { to: '/coleta-solo', icon: FlaskConical, label: 'Coleta de Solo' },
      { to: '/regulagem', icon: Wrench, label: 'Regulagem' },
      { to: '/tecnologia', icon: Satellite, label: 'Tecnologia' },
    ],
  },
  {
    title: 'Gestão',
    links: [
      { to: '/relatorios', icon: FileBarChart, label: 'Relatórios' },
    ],
  },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-perfil-700 text-white flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-perfil-600">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <Leaf className="w-6 h-6 text-perfil-600" />
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight">Perfil</h1>
            <p className="text-perfil-300 text-xs">Soluções Agronômicas</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
          {sections.map((section, idx) => (
            <div key={idx}>
              {section.title && (
                <p className="text-[10px] uppercase tracking-wider text-perfil-300/70 font-semibold px-4 mb-1.5">
                  {section.title}
                </p>
              )}
              <div className="space-y-0.5">
                {section.links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
                    }
                    end={link.to === '/'}
                  >
                    <link.icon className="w-5 h-5 shrink-0" />
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-perfil-600">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-perfil-500 rounded-full flex items-center justify-center text-sm font-semibold">
              JP
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">João Paulo</p>
              <p className="text-xs text-perfil-300 truncate">Eng. Agrônomo</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
