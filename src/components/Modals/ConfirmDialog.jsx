import { memo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../../context/ThemeContext';

const WarningIcon = () => (
  <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const ConfirmDialog = memo(({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const handleEscape = (e) => e.key === 'Escape' && onClose();
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Theme-based styles
  const styles = {
    backdrop: isDark ? 'bg-black/60' : 'bg-black/40',
    modal: isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200',
    title: isDark ? 'text-white' : 'text-gray-900',
    message: isDark ? 'text-gray-400' : 'text-gray-600',
    cancelBtn: isDark
      ? 'text-gray-300 bg-gray-800 hover:bg-gray-700 border-gray-700'
      : 'text-gray-600 bg-gray-100 hover:bg-gray-200 border-gray-200',
  };

  // Confirm button styles based on variant
  const confirmBtnStyles = {
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  };

  const dialogContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className={`absolute inset-0 backdrop-blur-sm ${styles.backdrop}`} onClick={onClose} />

      {/* Modal */}
      <div className={`relative w-full max-w-md rounded-2xl shadow-2xl border p-6 text-center ${styles.modal}`}>
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <WarningIcon />
        </div>

        {/* Title */}
        <h3 className={`text-xl font-bold mb-2 ${styles.title}`}>
          {title}
        </h3>

        {/* Message */}
        <p className={`mb-6 ${styles.message}`}>
          {message}
        </p>

        {/* Actions */}
        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className={`px-5 py-2.5 text-sm font-medium rounded-lg border transition-colors ${styles.cancelBtn}`}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors ${confirmBtnStyles[variant] || confirmBtnStyles.danger}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(dialogContent, document.body);
});

ConfirmDialog.displayName = 'ConfirmDialog';
export default ConfirmDialog;