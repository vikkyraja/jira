import { memo, useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { COLUMN_TITLES } from '../../constants';
import { useBoard } from '../../context/BoardContext';
import { useTheme } from '../../context/ThemeContext';

const Column = memo(({ id }) => {
  const { getTasksByColumn } = useBoard();
  const { theme } = useTheme();
  const tasks = getTasksByColumn(id);
  const { setNodeRef, isOver } = useDroppable({ id, data: { type: 'column', column: id } });
  const taskIds = useMemo(() => tasks.map(t => t.id), [tasks]);
  
  const d = theme === 'dark'; // isDark shorthand

  return (
    <div className={`flex flex-col flex-1 min-w-[280px] h-auto lg:h-[calc(100vh-150px)] border rounded-xl overflow-hidden
      ${d ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
      
      {/* Header */}
      <div className={`flex items-center justify-between px-3 py-2.5 border-b
        ${d ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <span className={`text-xs font-semibold uppercase tracking-wide ${d ? 'text-gray-300' : 'text-gray-600'}`}>
          {COLUMN_TITLES[id]}
        </span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${d ? 'text-gray-400 bg-gray-700' : 'text-gray-500 bg-gray-100'}`}>
          {tasks.length}
        </span>
      </div>

      {/* Tasks */}
      <div ref={setNodeRef} className={`flex-1 p-2 overflow-y-auto min-h-[150px] lg:min-h-0 transition-colors
        ${isOver ? (d ? 'bg-blue-900/20' : 'bg-blue-50') : ''}`}>
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {tasks.map(task => <TaskCard key={task.id} task={task} />)}
            {!tasks.length && (
              <div className={`h-20 flex items-center justify-center border-2 border-dashed rounded-lg text-xs
                ${isOver 
                  ? (d ? 'border-blue-500 text-blue-400' : 'border-blue-400 text-blue-500') 
                  : (d ? 'border-gray-700 text-gray-500' : 'border-gray-300 text-gray-400')}`}>
                Drop tasks here
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
});

Column.displayName = 'Column';
export default Column;