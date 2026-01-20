import { memo } from 'react';
import { PRIORITY_COLORS, PRIORITY_LABELS } from '../../constants';

const Badge = memo(({ priority }) => {
  const colors = PRIORITY_COLORS[priority];
  const label = PRIORITY_LABELS[priority];

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5
        text-xs font-semibold rounded-full
        ${colors.bg} ${colors.text}
        border ${colors.border}
      `}
    >
      {label}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;