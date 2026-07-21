import { useState } from 'react';
import { useIncomes } from '../../context/IncomeContext';

// Category styles for income records
const CATEGORY_STYLES = {
  Salary:     { icon: '💼', color: '#10b981' },
  Freelance:  { icon: '💻', color: '#60a5fa' },
  Investment: { icon: '📈', color: '#f59e0b' },
  Gifts:      { icon: '🎁', color: '#ec4899' },
  Refunds:    { icon: '🔄', color: '#8b5cf6' },
  Other:      { icon: '📦', color: '#94a3b8' },
};

/**
 * IncomeCard
 *
 * Renders a single row for an income transaction.
 *
 * @param {Object}   income - The income data object
 * @param {Function} onEdit - Callback when clicking Edit button
 */
const IncomeCard = ({ income, onEdit }) => {
  const { deleteIncome } = useIncomes();
  const [deleting, setDeleting] = useState(false);

  const style = CATEGORY_STYLES[income.category] || CATEGORY_STYLES.Other;

  const handleDelete = async () => {
    if (!window.confirm(`Delete income "${income.title}"?`)) return;
    setDeleting(true);
    try {
      await deleteIncome(income._id);
    } catch {
      setDeleting(false);
    }
  };

  const formattedDate = new Date(income.date).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem 1.25rem',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '0.75rem',
        transition: 'all 0.2s ease',
        opacity: deleting ? 0.5 : 1,
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
    >
      {/* Category Icon */}
      <div style={{
        width: '44px',
        height: '44px',
        flexShrink: 0,
        background: `${style.color}18`,
        border: `1px solid ${style.color}35`,
        borderRadius: '0.625rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.25rem',
      }}>
        {style.icon}
      </div>

      {/* Info details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          color: '#f1f5f9', fontSize: '0.9375rem', fontWeight: 600,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {income.title}
        </p>
        <div style={{ display: 'flex', gap: '0.625rem', marginTop: '0.2rem', alignItems: 'center' }}>
          <span style={{
            background: `${style.color}18`,
            color: style.color,
            fontSize: '0.7rem', fontWeight: 600,
            padding: '0.1rem 0.5rem', borderRadius: '2rem',
          }}>
            {income.category}
          </span>
          <span style={{ color: '#475569', fontSize: '0.75rem' }}>{formattedDate}</span>
        </div>
        {income.description && (
          <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.15rem',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {income.description}
          </p>
        )}
      </div>

      {/* Amount with Emerald Green for income */}
      <div style={{
        color: '#10b981', fontSize: '1.0625rem', fontWeight: 700,
        flexShrink: 0, marginRight: '0.5rem',
      }}>
        +₹{income.amount.toLocaleString('en-IN')}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
        <button
          id={`edit-income-${income._id}`}
          onClick={() => onEdit(income)}
          title="Edit"
          style={{
            width: '32px', height: '32px', borderRadius: '0.5rem',
            background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)',
            color: '#a78bfa', cursor: 'pointer', fontSize: '0.875rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >✏️</button>
        <button
          id={`delete-income-${income._id}`}
          onClick={handleDelete}
          disabled={deleting}
          title="Delete"
          style={{
            width: '32px', height: '32px', borderRadius: '0.5rem',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
            color: '#f87171', cursor: 'pointer', fontSize: '0.875rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >🗑️</button>
      </div>
    </div>
  );
};

export default IncomeCard;
