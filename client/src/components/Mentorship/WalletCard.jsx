import { Link } from 'react-router-dom';
import { FiCreditCard } from 'react-icons/fi';
import './WalletCard.css';

export default function WalletCard({ balance = 0, loading = false }) {
  return (
    <div className="wallet-card">
      <div className="wallet-card-header">
        <span className="wallet-label">Wallet Balance</span>
        <FiCreditCard size={18} className="wallet-icon" />
      </div>

      {loading ? (
        <div className="wallet-loading">
          <div className="wallet-skeleton" />
        </div>
      ) : (
        <div className="wallet-amount">
          <span className="wallet-number">{balance.toLocaleString()}</span>
          <span className="wallet-unit">Skill Wallet</span>
        </div>
      )}

      <div className="wallet-actions">
        <Link to="/mentor-wallet#payout" className="wallet-btn wallet-btn-outline">
          Redeem
        </Link>
        <Link to="/mentor-wallet#recent-activity" className="wallet-btn wallet-btn-outline">
          History
        </Link>
      </div>
    </div>
  );
}