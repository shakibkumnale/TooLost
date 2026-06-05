import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Disc3, BarChart3, DollarSign,
  Settings, Sliders, LogOut, Menu, X, ChevronRight
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'MAIN', items: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/releases', icon: Disc3, label: 'Releases' },
  ]},
  { label: 'INSIGHTS', items: [
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/sales', icon: DollarSign, label: 'Sales' },
  ]},
  { label: 'ACCOUNT', items: [
    { to: '/preferences', icon: Sliders, label: 'Preferences' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ]},
];

function getBreadcrumbs(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  return parts.map((p, i) => ({
    label: p.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase()),
    path: '/' + parts.slice(0, i + 1).join('/'),
    isLast: i === parts.length - 1,
  }));
}

export default function Layout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const breadcrumbs = getBreadcrumbs(location.pathname);

  const initials = user
    ? `${(user.first_name || '')[0] || ''}${(user.last_name || '')[0] || ''}`.toUpperCase()
    : '?';

  return (
    <div className="app-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">TL</div>
          <div className="sidebar-brand">
            <span>Too Lost</span>
          </div>
          <button
            className="btn-icon btn-ghost mobile-menu-btn"
            onClick={() => setSidebarOpen(false)}
            style={{ marginLeft: 'auto' }}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((section) => (
            <div key={section.label} className="sidebar-nav-section">
              <div className="sidebar-nav-label">{section.label}</div>
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon size={20} className="sidebar-link-icon" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user" onClick={logout} title="Sign out">
            <div className="sidebar-avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.first_name} />
              ) : (
                initials
              )}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">
                {user ? `${user.first_name} ${user.last_name}` : 'Loading...'}
              </div>
              <div className="sidebar-user-type">{user?.type || 'User'}</div>
            </div>
            <LogOut size={16} style={{ marginLeft: 'auto', color: 'var(--text-tertiary)' }} />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="btn-icon btn-ghost mobile-menu-btn"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="topbar-breadcrumb">
              {breadcrumbs.map((crumb, i) => (
                <span key={crumb.path} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {i > 0 && <ChevronRight size={14} className="topbar-breadcrumb-sep" />}
                  <span style={{
                    color: crumb.isLast ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: crumb.isLast ? 600 : 400,
                  }}>
                    {crumb.label}
                  </span>
                </span>
              ))}
            </div>
          </div>
          <div className="topbar-right">
            <div className="sidebar-avatar" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>
              {user?.avatar ? (
                <img src={user.avatar} alt={user.first_name} />
              ) : (
                initials
              )}
            </div>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
