import { memo, useState, useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskModal from '../Modals/TaskModal';
import ConfirmDialog from '../Modals/ConfirmDialog';
import { useBoard } from '../../context/BoardContext';
import { getInitials, formatDate } from '../../utils/helpers';

const PRIORITY_CONFIG = {
  high: { icon: '↑', color: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/30' },
  medium: { icon: '=', color: 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/30' },
  low: { icon: '↓', color: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30' },
};

const TaskCard = memo(({ task, isDragOverlay = false }) => {
  const { deleteTask } = useBoard();
  const [modal, setModal] = useState({ edit: false, delete: false, actions: false });

  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: 'task', task },
  });

  const toggle = useCallback((key, value) => setModal(m => ({ ...m, [key]: value ?? !m[key] })), []);
  const handleDelete = useCallback(() => { deleteTask(task.id); toggle('delete', false); }, [deleteTask, task.id, toggle]);

  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  // Drag Overlay - Simplified render
  if (isDragOverlay) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-md p-3 border-2 border-blue-500 shadow-2xl rotate-2 scale-105">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">{task.title}</h3>
      </div>
    );
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={{ transform: CSS.Transform.toString(transform), transition }}
        className={`group relative bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm transition-all select-none touch-manipulation
          ${isDragging ? 'opacity-50 ring-2 ring-blue-500/50' : 'hover:shadow-md active:scale-[0.98]'}`}
        onContextMenu={e => e.preventDefault()}
      >
        {/* Drag Handle */}
        <div
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          className="absolute left-0 inset-y-0 w-8 flex items-center justify-center cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-l-md touch-none"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4zm6-12a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4z"/>
          </svg>
        </div>

        {/* Content */}
        <div className="pl-8 pr-3 py-3" onClick={() => toggle('edit', true)} role="button" tabIndex={0}>
          
          {/* Desktop Actions */}
          <div className="absolute top-2 right-2 hidden md:flex gap-0.5 opacity-0 group-hover:opacity-100 z-10">
            {[
              { action: () => toggle('edit', true), icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z', hover: 'hover:text-blue-600' },
              { action: () => toggle('delete', true), icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16', hover: 'hover:text-red-600' },
            ].map((btn, i) => (
              <button key={i} onClick={e => { e.stopPropagation(); btn.action(); }} className={`p-1.5 rounded text-gray-400 ${btn.hover} hover:bg-gray-100 dark:hover:bg-gray-700`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={btn.icon}/></svg>
              </button>
            ))}
          </div>

          {/* Mobile Actions */}
          <button onClick={e => { e.stopPropagation(); toggle('actions'); }} className="absolute top-2 right-2 p-2 md:hidden text-gray-400 z-10">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z"/></svg>
          </button>

          {/* Mobile Dropdown */}
          {modal.actions && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => toggle('actions', false)} />
              <div className="absolute top-10 right-2 z-30 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 min-w-[120px]">
                <button onClick={e => { e.stopPropagation(); toggle('edit', true); toggle('actions', false); }} className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-200 active:bg-gray-100">Edit</button>
                <button onClick={e => { e.stopPropagation(); toggle('delete', true); toggle('actions', false); }} className="w-full px-4 py-2.5 text-left text-sm text-red-600 active:bg-red-50">Delete</button>
              </div>
            </>
          )}

          {/* Title & Description */}
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 pr-8 mb-1">{task.title}</h3>
          {task.description && <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-2">{task.description}</p>}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700/50">
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded text-xs font-bold flex items-center justify-center ${priority.color}`}>{priority.icon}</span>
              {task.dueDate && <span className="text-xs text-gray-400">{formatDate(task.dueDate)}</span>}
            </div>
            {task.assignee ? (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-2 ring-white dark:ring-gray-800" title={task.assignee}>
                <span className="text-[10px] font-semibold text-white">{getInitials(task.assignee)}</span>
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/></svg>
              </div>
            )}
          </div>
        </div>
      </div>

      <TaskModal isOpen={modal.edit} onClose={() => toggle('edit', false)} task={task} onRequestDelete={() => toggle('delete', true)} />
      <ConfirmDialog isOpen={modal.delete} onClose={() => toggle('delete', false)} onConfirm={handleDelete} title="Delete Task" message={`Delete "${task.title}"?`} confirmText="Delete" variant="danger" />
    </>
  );
});

TaskCard.displayName = 'TaskCard';
export default TaskCard;