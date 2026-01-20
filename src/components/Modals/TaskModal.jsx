import { memo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useBoard } from '../../context/BoardContext';
import { useTheme } from '../../context/ThemeContext';
import { PRIORITIES, PRIORITY_LABELS } from '../../constants';

const init = { title: '', description: '', priority: PRIORITIES.MEDIUM, assignee: '' };

const TaskModal = memo(({ isOpen, onClose, task = null, onRequestDelete }) => {
  const { addTask, updateTask } = useBoard();
  const { theme } = useTheme();
  const [form, setForm] = useState(init);
  const [error, setError] = useState('');
  const isEdit = Boolean(task);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (isOpen) {
      setForm(task || init);
      setError('');
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, task]);

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose();
    isOpen && addEventListener('keydown', esc);
    return () => removeEventListener('keydown', esc);
  }, [isOpen, onClose]);

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.title?.trim()) return setError('Title required');
    isEdit ? updateTask(task.id, form) : addTask(form);
    onClose();
  };

  if (!isOpen) return null;

  // Theme-based styles
  const styles = {
    backdrop: isDark ? 'bg-black/60' : 'bg-black/30',
    modal: isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200',
    headerBorder: isDark ? 'border-gray-800' : 'border-gray-100',
    title: isDark ? 'text-white' : 'text-gray-900',
    closeBtn: isDark 
      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800' 
      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
    label: isDark ? 'text-gray-300' : 'text-gray-700',
    input: isDark 
      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400',
    inputFocus: isDark ? 'focus:bg-gray-800' : 'focus:bg-white',
    cancelBtn: isDark 
      ? 'text-gray-300 bg-gray-800 hover:bg-gray-700' 
      : 'text-gray-600 bg-gray-100 hover:bg-gray-200',
    deleteBtn: isDark 
      ? 'text-red-400 hover:bg-red-900/20' 
      : 'text-red-600 hover:bg-red-50',
  };

  const inputClass = `
    w-full px-4 py-2.5 rounded-lg outline-none transition-all
    border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
    ${styles.input} ${styles.inputFocus}
  `;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className={`absolute inset-0 backdrop-blur-sm ${styles.backdrop}`} onClick={onClose} />

      {/* Modal */}
      <div className={`relative w-full max-w-lg rounded-2xl shadow-xl border ${styles.modal}`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${styles.headerBorder}`}>
          <h2 className={`text-lg font-semibold ${styles.title}`}>
            {isEdit ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${styles.closeBtn}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${styles.label}`}>
              Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={onChange}
              placeholder="Task title..."
              autoFocus
              className={`${inputClass} ${error ? 'border-red-400' : ''}`}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${styles.label}`}>
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              rows={3}
              placeholder="Description..."
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Priority & Assignee */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${styles.label}`}>
                Priority
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={onChange}
                className={`${inputClass} cursor-pointer`}
              >
                {Object.entries(PRIORITY_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${styles.label}`}>
                Assignee
              </label>
              <input
                name="assignee"
                value={form.assignee}
                onChange={onChange}
                placeholder="Name..."
                className={inputClass}
              />
            </div>
          </div>

          {/* Actions */}
          <div className={`flex justify-between pt-4 border-t ${styles.headerBorder}`}>
            {isEdit ? (
              <button
                type="button"
                onClick={onRequestDelete}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${styles.deleteBtn}`}
              >
                Delete
              </button>
            ) : <span />}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${styles.cancelBtn}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                {isEdit ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
});

TaskModal.displayName = 'TaskModal';
export default TaskModal;