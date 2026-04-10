import { ReactElement } from 'react';
import { Outlet, NavLink } from 'react-router-dom';

export default function Layout(): ReactElement {
  return (
    <div className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Internal dev tool</p>
          <h1>FileTree Explorer</h1>
        </div>

        <nav className="nav">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Import
          </NavLink>
          <NavLink to="/tree" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Tree
          </NavLink>
        </nav>
      </header>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
