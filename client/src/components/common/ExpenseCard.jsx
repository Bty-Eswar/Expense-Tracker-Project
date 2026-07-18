import { useState } from 'react';
import { useExpenses } from '../../context/ExpenseContext';

// Category colors and icons
const CATEGORY_STYLES = {
  Food:          { icon: '🍔', color: '#f59e0b' },
  Transport:     { icon: '🚗', color: '#3b82f6' },
  Shopping:      { icon: '🛍️', color: '#ec4899' },
  Entertainment: { icon: '🎬', color: '#8b5cf6' },
  Health:        { icon: '❤️', color: '#ef4444' },
  Education:     { icon: '📚', color: '#10b981' },
  Bills:         { icon: '📄', color: '#64748b' },
  Other:         { icon: '📦', color: '#94a3b8' },
};

/**
 * ExpenseCard
 *
 * Displays a single expense row with category icon, title, date,
 * amount, and edit/delete action buttons.
 *
 * @param {Object}   expense  - The expense data object
 * @param {Function} onEdit   - Called with the expense when Edit is clicked
 */
const ExpenseCard = ({ expense, onEdit }) => {
  const { deleteExpense } = useExpenses();
  const [deleting, setDeleting] = useState(false);

  const style = CATEGORY_STYLES[expense.category] || CATEGORY_STYLES.Other;

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${expense.title}"?`)) return;
    setDeleting(true);
    try {
      await deleteExpense(expense._id);
    } catch {
      setDeleting(false);
    }
  };

  const formattedDate = new Date(expense.date).toLocaleDateString('en-IN', {
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
        width: '44px', height: '44px', flexShrink: 0,
        background: `${style.color}18`,
        border: `1px solid ${style.color}35`,
        borderRadius: '0.625rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.25rem',
      }}>
        {style.icon}
      </div>

      {/* Title + Category + Date */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          color: '#f1f5f9', fontSize: '0.9375rem', fontWeight: 600,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {expense.title}
        </p>
        <div style={{ display: 'flex', gap: '0.625rem', marginTop: '0.2rem', alignItems: 'center' }}>
          <span style={{
            background: `${style.color}18`,
            color: style.color,
            fontSize: '0.7rem', fontWeight: 600,
            padding: '0.1rem 0.5rem', borderRadius: '2rem',
          }}>
            {expense.category}
          </span>
          <span style={{ color: '#475569', fontSize: '0.75rem' }}>{formattedDate}</span>
        </div>
        {expense.description && (
          <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.15rem',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {expense.description}
          </p>
        )}
      </div>

      {/* Amount */}
      <div style={{
        color: '#f87171', fontSize: '1.0625rem', fontWeight: 700,
        flexShrink: 0, marginRight: '0.5rem',
      }}>
        −₹{expense.amount.toLocaleString('en-IN')}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
        <button
          id={`edit-${expense._id}`}
          onClick={() => onEdit(expense)}
          title="Edit"
          style={{
            width: '32px', height: '32px', borderRadius: '0.5rem',
            background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)',
            color: '#a78bfa', cursor: 'pointer', fontSize: '0.875rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >✏️</button>
        <button
          id={`delete-${expense._id}`}
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

export default ExpenseCard;
