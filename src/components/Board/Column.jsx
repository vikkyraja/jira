import { memo, useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { COLUMN_TITLES } from '../../constants';
import { useBoard } from '../../context/BoardContext';

const Column = memo(({ id }) => {
  const { getTasksByColumn } = useBoard();
  const tasks = getTasksByColumn(id);
  const { setNodeRef, isOver } = useDroppable({ id, data: { type: 'column', column: id } });
  const taskIds = useMemo(() => tasks.map(t => t.id), [tasks]);

  return (
    <div className="flex flex-col flex-1 min-w-70 h-auto lg:h-[calc(100vh-150px)] bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{COLUMN_TITLES[id]}</span>
        <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 rounded">{tasks.length}</span>
      </div>

      {/* Tasks */}
      <div ref={setNodeRef} className={`flex-1 p-2 overflow-y-auto min-h-[150px] lg:min-h-0 ${isOver ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {tasks.map(task => <TaskCard key={task.id} task={task} />)}
            {!tasks.length && (
              <div className={`h-16 flex items-center justify-center border-2 border-dashed rounded-lg text-xs text-gray-400 ${isOver ? 'border-blue-700' : 'border-gray-700'}`}>
                Drop here
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