import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import './Breadcrumb.css';

// items = [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Skills' }]
export default function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb">
      {items.map((item, index) => (
        <span key={index} className="breadcrumb-item">
          {index > 0 && <FiChevronRight size={14} className="breadcrumb-sep" />}
          {item.path ? (
            <Link to={item.path} className="breadcrumb-link">
              {item.label}
            </Link>
          ) : (
            <span className="breadcrumb-current">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}