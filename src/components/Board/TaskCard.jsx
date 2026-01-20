import { memo, useState, useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskModal from '../Modals/TaskModal';
import ConfirmDialog from '../Modals/ConfirmDialog';
import { useBoard } from '../../context/BoardContext';
import { useTheme } from '../../context/ThemeContext';
import { getInitials, formatDate } from '../../utils/helpers';

const PRIORITY_CONFIG = {
  high: { icon: '↑', light: 'text-red-600 bg-red-50', dark: 'text-red-400 bg-red-900/30' },
  medium: { icon: '=', light: 'text-yellow-600 bg-yellow-50', dark: 'text-yellow-400 bg-yellow-900/30' },
  low: { icon: '↓', light: 'text-green-600 bg-green-50', dark: 'text-green-400 bg-green-900/30' },
};

const TaskCard = memo(({ task, isDragOverlay }) => {
  const { deleteTask } = useBoard();
  const { theme } = useTheme();
  const [modal, setModal] = useState({});
  
  const isDark = theme === 'dark';
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = 
    useSortable({ id: task.id, data: { type: 'task', task } });

  const toggle = useCallback((key, value) => setModal(state => ({ ...state, [key]: value ?? !state[key] })), []);

  if (isDragOverlay) return (
    <div className={`p-3 rounded-md border-2 border-blue-500 shadow-2xl rotate-2 scale-105 ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
      <h3 className="text-sm font-medium line-clamp-2">{task.title}</h3>
    </div>
  );

  return (
    <>
      <div
        ref={setNodeRef}
        style={{ transform: CSS.Transform.toString(transform), transition }}
        className={`group relative rounded-md border shadow-sm select-none touch-manipulation transition-all
          ${isDark ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300'}
          ${isDragging ? 'opacity-50 ring-2 ring-blue-500/50' : 'hover:shadow-md active:scale-[0.98]'}`}
        onContextMenu={event => event.preventDefault()}>

        {/* Drag Handle */}
        <div ref={setActivatorNodeRef} {...attributes} {...listeners}
          className={`absolute left-0 inset-y-0 w-7 flex items-center justify-center cursor-grab active:cursor-grabbing rounded-l-md touch-none
            ${isDark ? 'text-gray-600 hover:bg-gray-700/50' : 'text-gray-300 hover:bg-gray-50'}`}>
          ⋮⋮
        </div>

        {/* Content */}
        <div className="pl-7 pr-2 py-2.5 cursor-pointer" onClick={() => toggle('edit', true)}>
          
          {/* Actions */}
          <div className="absolute top-1.5 right-1.5 z-10 flex gap-0.5">
            <button onClick={event => { event.stopPropagation(); toggle('edit', true); }} 
              className={`p-1 rounded hidden md:block opacity-0 group-hover:opacity-100 
                ${isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-blue-400' : 'hover:bg-gray-100 text-gray-400 hover:text-blue-600'}`}>
              ✏️
            </button>
            <button onClick={event => { event.stopPropagation(); toggle('delete', true); }} 
              className={`p-1 rounded hidden md:block opacity-0 group-hover:opacity-100 
                ${isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-red-400' : 'hover:bg-gray-100 text-gray-400 hover:text-red-600'}`}>
              🗑️
            </button>
            <button onClick={event => { event.stopPropagation(); toggle('menu'); }} 
              className={`p-1.5 md:hidden ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              ⋯
            </button>
          </div>

          {/* Mobile Menu */}
          {modal.menu && <>
            <div className="fixed inset-0 z-20" onClick={() => toggle('menu', false)} />
            <div className={`absolute top-9 right-1 z-30 rounded-lg shadow-lg py-1 min-w-[100px] border 
              ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <button onClick={() => { toggle('edit', true); toggle('menu', false); }} 
                className={`block w-full px-3 py-2 text-left text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                Edit
              </button>
              <button onClick={() => { toggle('delete', true); toggle('menu', false); }} 
                className="block w-full px-3 py-2 text-left text-sm text-red-500">
                Delete
              </button>
            </div>
          </>}

          {/* Title & Description */}
          <h3 className={`text-sm font-medium line-clamp-2 pr-6 mb-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`text-xs line-clamp-1 mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {task.description}
            </p>
          )}

          {/* Footer */}
          <div className={`flex items-center justify-between pt-1.5 border-t ${isDark ? 'border-gray-700/50' : 'border-gray-100'}`}>
            <div className="flex items-center gap-1.5">
              <span className={`w-5 h-5 rounded text-xs font-bold flex items-center justify-center ${isDark ? priority.dark : priority.light}`}>
                {priority.icon}
              </span>
              {task.dueDate && (
                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {formatDate(task.dueDate)}
                </span>
              )}
            </div>
            
            {task.assignee ? (
              <div className={`w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-2 ${isDark ? 'ring-gray-800' : 'ring-white'}`} 
                title={task.assignee}>
                <span className="text-[9px] font-semibold text-white">{getInitials(task.assignee)}</span>
              </div>
            ) : (
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ring-2 text-xs text-gray-400 
                ${isDark ? 'bg-gray-700 ring-gray-800' : 'bg-gray-200 ring-white'}`}>
                ?
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <TaskModal 
        isOpen={modal.edit} 
        onClose={() => toggle('edit', false)} 
        task={task} 
        onRequestDelete={() => toggle('delete', true)} 
      />
      <ConfirmDialog 
        isOpen={modal.delete} 
        onClose={() => toggle('delete', false)} 
        onConfirm={() => { deleteTask(task.id); toggle('delete', false); }} 
        title="Delete Task" 
        message={`Delete "${task.title}"?`} 
        confirmText="Delete" 
        variant="danger" 
      />
    </>
  );
});

TaskCard.displayName = 'TaskCard';
export default TaskCard;