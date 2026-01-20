import { memo, useEffect, useState, useCallback } from 'react';
import { useBoard } from '../../context/BoardContext';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Select from '../UI/Select';
import { PRIORITIES, PRIORITY_LABELS } from '../../constants';

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const initialFormState = {
  title: '',
  description: '',
  priority: PRIORITIES.MEDIUM,
  assignee: '',
};

const TaskModal = memo(({ isOpen, onClose, task = null, onRequestDelete }) => {
  const { addTask, updateTask } = useBoard();
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(task);

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setFormData({
          title: task.title || '',
          description: task.description || '',
          priority: task.priority || PRIORITIES.MEDIUM,
          assignee: task.assignee || '',
        });
      } else {
        setFormData(initialFormState);
      }
      setErrors({});
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, task]);

  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && onClose();
    if (isOpen) document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [isOpen, onClose]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (formData.title.length > 100) newErrors.title = 'Max 100 characters';
    if (formData.description.length > 500) newErrors.description = 'Max 500 characters';
    if (formData.assignee && formData.assignee.length > 50) newErrors.assignee = 'Max 50 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }, [errors]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      if (isEditing) {
        updateTask(task.id, formData);
      } else {
        addTask(formData);
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, isEditing, updateTask, addTask, task, formData, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold">{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title..."
            error={errors.title}
            required
            autoFocus
          />

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Enter task description..."
              className={`
                w-full px-4 py-2.5 rounded-lg
                bg-white dark:bg-gray-800
                border border-gray-300 dark:border-gray-600
                text-gray-900 dark:text-white
                placeholder-gray-400 dark:placeholder-gray-500
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-all duration-200 resize-none
                ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}
              `}
            />
            {errors.description && <p className="mt-1.5 text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              options={Object.entries(PRIORITY_LABELS).map(([value, label]) => ({ value, label }))}
              placeholder="Select priority"
            />
            <Input
              label="Assignee"
              name="assignee"
              value={formData.assignee}
              onChange={handleChange}
              placeholder="Enter name..."
              error={errors.assignee}
            />
          </div>

          <div className="flex justify-between items-center pt-4">
            {isEditing ? (
              <button
                type="button"
                onClick={onRequestDelete}
                className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
              >
                Delete
              </button>
            ) : <span />}

            <div className="flex gap-3">
              <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
});

TaskModal.displayName = 'TaskModal';

export default TaskModal;