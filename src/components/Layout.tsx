/**
 * Layout component - provides the common page structure for the application.
 * Includes the header with title and navigation, and a content area for page-specific content.
 * Uses React Router's Outlet to render child routes.
 */
import { ReactElement } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import styled from 'styled-components';

const Shell = styled.div`
  width: min(1200px, calc(100% - 32px));
  margin: 0 auto;
  padding: 24px 0 40px;
`;

const Topbar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;

  h1 {
    margin: 0;
    line-height: 1.05;
    padding-left: 28px;
  }

  @media (max-width: 920px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 10px;
`;

const NavItem = styled(NavLink)`
  padding: 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);

  &.active {
    background: rgba(104, 138, 255, 0.22);
    border-color: rgba(136, 165, 255, 0.4);
  }
`;

const Content = styled.main`
  display: grid;
  gap: 20px;
`;

export default function Layout(): ReactElement {
  return (
    <Shell>
      <Topbar>
        <div>
          <h1>FileTree Explorer</h1>
        </div>

        <Nav>
          <NavItem to="/" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Import
          </NavItem>
          <NavItem to="/tree" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Tree
          </NavItem>
        </Nav>
      </Topbar>

      <Content>
        <Outlet />
      </Content>
    </Shell>
  );
}
