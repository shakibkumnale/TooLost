import { Circle } from 'lucide-react';

const STATUS_MAP = {
  draft: { label: 'Draft', className: 'badge-draft' },
  in_review: { label: 'In Review', className: 'badge-in_review' },
  live: { label: 'Live', className: 'badge-live' },
  takedown_pending: { label: 'Takedown Pending', className: 'badge-takedown_pending' },
  takedown_complete: { label: 'Taken Down', className: 'badge-takedown_complete' },
};

export default function StatusBadge({ status }) {
  const config = STATUS_MAP[status] || { label: status, className: '' };
  return (
    <span className={`badge ${config.className}`}>
      <Circle size={6} fill="currentColor" />
      {config.label}
    </span>
  );
}
