// Wraps every page with Navbar + Footer

import Navbar from '../../components/Dashboard/DashboardNavbar';
import Footer from '../Footer';
import './PageLayout.css';

export default function PageLayout({ children, sidebar, className = '' }) {
  if (sidebar) {
    return (
      <div className="page-layout">
        <Navbar />
        <div className={`page-layout-body ${className}`}>
          <aside className="page-sidebar">{sidebar}</aside>
          <main className="page-main">{children}</main>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-layout">
      <Navbar />
      <main className={`page-layout-content ${className}`}>{children}</main>
      <Footer />
    </div>
  );
}