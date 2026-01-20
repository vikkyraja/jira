import { memo, useCallback, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
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
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback(({ active }) => {
    const task = findTask(active.id);
    if (task) {
      setActiveTask(task);
      document.body.style.overflow = 'hidden';
      if (navigator.vibrate) navigator.vibrate(50);
    }
  }, [findTask]);

  const handleDragOver = useCallback(({ active, over }) => {
    if (!over) return;
    const current = findTask(active.id);
    if (!current) return;

    if (over.data.current?.type === 'column') {
      const newColumn = over.id;
      if (current.column !== newColumn) {
        moveTask(active.id, newColumn);
        if (navigator.vibrate) navigator.vibrate(25);
      }
    } else if (over.data.current?.type === 'task') {
      const overTask = over.data.current.task;
      if (current.column !== overTask.column) {
        moveTask(active.id, overTask.column);
        if (navigator.vibrate) navigator.vibrate(25);
      }
    }
  }, [findTask, moveTask]);

  const handleDragEnd = useCallback(() => {
    setActiveTask(null);
    document.body.style.overflow = '';
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveTask(null);
    document.body.style.overflow = '';
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
    >
      <div 
        className="
          flex flex-col md:flex-row 
          items-stretch md:items-start 
          gap-4 md:gap-6 
          p-4 md:p-6 
          h-full w-full 
          max-w-7xl mx-auto 
          overflow-x-auto
          overscroll-contain
        "
        style={{ 
          touchAction: activeTask ? 'none' : 'pan-x pan-y',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {Object.values(COLUMNS).map((columnId) => (
          <Column key={columnId} id={columnId} />
        ))}
      </div>

      <DragOverlay
        dropAnimation={{
          duration: 200,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}
        style={{ touchAction: 'none' }}
      >
        {activeTask ? (
          <TaskCard task={activeTask} isDragOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
});

Board.displayName = 'Board';

export default Board;