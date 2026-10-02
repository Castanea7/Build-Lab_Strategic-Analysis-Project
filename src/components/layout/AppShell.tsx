import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

type NavItem = { label: string; to: string; icon: string; end?: boolean }

const primaryNav: NavItem[] = [
  { label: '今日工作台', to: '/', icon: '⌂', end: true },
  { label: '零售行业图谱', to: '/retail', icon: '◌' },
  { label: 'SaaS 行业图谱', to: '/saas', icon: '◎' },
  { label: '研究工作台', to: '/research', icon: '✦' },
]

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const current = primaryNav.find((item) =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to),
  )

  return (
    <div className="app-shell">
      {mobileOpen && (
        <button
          className="mobile-scrim"
          aria-label="关闭导航"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div>
            <div className="brand-name">Signal / 01</div>
            <div className="brand-subtitle">战略情报工作台</div>
          </div>
        </div>
        <div className="sidebar-section-label">Workspace</div>
        <nav className="sidebar-nav" aria-label="主要导航">
          {primaryNav.map((item) => (
            <NavItemLink
              key={item.to}
              item={item}
              onNavigate={() => setMobileOpen(false)}
            />
          ))}
        </nav>
        <div className="sidebar-spacer" />
        <div className="workspace-status">
          <div className="status-dot" />
          <div>
            <div className="status-title">演示空间已就绪</div>
            <div className="status-copy">数据保存在当前浏览器</div>
          </div>
        </div>
        <div className="profile-card">
          <div className="avatar">S</div>
          <div className="profile-copy">
            <div className="profile-name">Signal Demo</div>
            <div className="profile-role">个人研究空间</div>
          </div>
          <button className="icon-button icon-button-dark" aria-label="演示空间选项">
            ···
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button
            className="mobile-menu-button"
            aria-label="打开导航"
            onClick={() => setMobileOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
          <div className="breadcrumb">
            <span className="breadcrumb-muted">Workspace</span>
            <span className="breadcrumb-slash">/</span>
            <span>{current?.label ?? '今日工作台'}</span>
          </div>
          <div className="topbar-actions">
            <div className="demo-chip">
              <span className="demo-chip-dot" />
              本地演示数据
            </div>
            <button className="topbar-action" aria-label="搜索">
              <span className="search-glyph" />
              <span className="topbar-action-label">搜索</span>
              <kbd>⌘ K</kbd>
            </button>
            <button className="notification-button" aria-label="通知">
              ♢<span className="notification-dot" />
            </button>
          </div>
        </header>
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

function NavItemLink({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
      onClick={onNavigate}
    >
      <span className="nav-item-icon" aria-hidden="true">
        {item.icon}
      </span>
      <span>{item.label}</span>
      {item.to === '/' && <span className="nav-count">10</span>}
    </NavLink>
  )
}
