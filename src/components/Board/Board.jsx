import { memo, useCallback, useState } from 'react';
import {
  DndContext, DragOverlay, closestCorners,
  KeyboardSensor, TouchSensor, MouseSensor,
  useSensor, useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import Column from './Column';
import TaskCard from './TaskCard';
import { COLUMNS } from '../../constants';
import { useBoard } from '../../context/BoardContext';

const Board = memo(() => {
  const { moveTask, findTask } = useBoard();
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const onDragStart = useCallback(({ active }) => {
    const task = findTask(active.id);
    if (task) { setActiveTask(task); document.body.style.overflow = 'hidden'; }
  }, [findTask]);

  const onDragOver = useCallback(({ active, over }) => {
    if (!over) return;
    const current = findTask(active.id);
    if (!current) return;
    const targetCol = over.data.current?.type === 'column' ? over.id : over.data.current?.task?.column;
    if (targetCol && current.column !== targetCol) moveTask(active.id, targetCol);
  }, [findTask, moveTask]);

  const onDragEnd = useCallback(() => { setActiveTask(null); document.body.style.overflow = ''; }, []);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd} onDragCancel={onDragEnd}>
      
      {/* Responsive Grid Layout */}
      <div className="
        flex flex-col lg:flex-row 
        gap-4 p-4 
        w-full max-w-7xl mx-auto
        min-h-screen lg:h-screen lg:max-h-screen
        overflow-x-auto
      ">
        {Object.values(COLUMNS).map(columnId => (
          <Column key={columnId} id={columnId} />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 200, easing: 'ease-out' }}>
        {activeTask && <TaskCard task={activeTask} isDragOverlay />}
      </DragOverlay>
    </DndContext>
  );
});

Board.displayName = 'Board';
export default Board;