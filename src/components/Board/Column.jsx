import { memo, useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { COLUMN_TITLES } from '../../constants';
import { useBoard } from '../../context/BoardContext';

const Column = memo(({ id }) => {
  const { getTasksByColumn, getTaskCount } = useBoard();
  const tasks = getTasksByColumn(id);
  const totalCount = getTaskCount(id);

  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { type: 'column', column: id },
  });

  const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);

  return (
    <div className="flex flex-col flex-1 min-w-70">
      {/* Minimal Header */}
      <div className="flex items-center gap-2 px-2 py-3 mb-2">
        <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {COLUMN_TITLES[id]}
        </h2>
        <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
          {tasks.length}
          {tasks.length !== totalCount && (
            <span className="text-gray-300 dark:text-gray-600">/{totalCount}</span>
          )}
        </span>
      </div>

      {/* Task List Container */}
      <div
        ref={setNodeRef}
        className={`
          flex-1 px-1 pb-2 rounded-lg transition-colors duration-150
          min-h-[calc(100vh-200px)] max-h-[calc(100vh-200px)] overflow-y-auto
          ${isOver 
            ? 'bg-blue-50 dark:bg-blue-900/20' 
            : 'bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/30'
          }
        `}
      >
        {/* Drop Indicator */}
        {isOver && (
          <div className="h-0.5 mx-1 mb-2 rounded-full bg-blue-500" />
        )}

        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {tasks.length > 0 ? (
              tasks.map((task) => <TaskCard key={task.id} task={task} />)
            ) : (
              <div 
                className={`
                  flex items-center justify-center h-24 rounded-lg border-2 border-dashed
                  ${isOver 
                    ? 'border-blue-300 dark:border-blue-700' 
                    : 'border-gray-200 dark:border-gray-700'
                  }
                `}
              >
                <span className="text-xs text-gray-400 dark:text-gray-600">
                  Drop tasks here
                </span>
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