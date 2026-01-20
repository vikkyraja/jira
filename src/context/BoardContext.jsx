
import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { COLUMNS, STORAGE_KEY } from '../constants';
import { generateId, filterTasks } from '../utils/helpers';

const BoardContext = createContext();

export const BoardProvider = ({ children }) => {
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEY, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const addTask = useCallback((taskData) => {
    const newTask = {
      id: generateId(),
      ...taskData,
      column: COLUMNS.TODO,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
  }, [setTasks]);

  const updateTask = useCallback((taskId, updates) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    ));
  }, [setTasks]);

  const deleteTask = useCallback((taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, [setTasks]);

  const moveTask = useCallback((taskId, newColumn) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, column: newColumn } : task
    ));
  }, [setTasks]);

  const getTasksByColumn = useCallback((column) => {
    const columnTasks = tasks.filter(task => task.column === column);
    return filterTasks(columnTasks, searchQuery, priorityFilter);
  }, [tasks, searchQuery, priorityFilter]);

  const getTaskCount = useCallback((column) => {
    return tasks.filter(task => task.column === column).length;
  }, [tasks]);

  const findTask = useCallback((taskId) => {
    return tasks.find(task => task.id === taskId);
  }, [tasks]);

  const value = useMemo(() => ({
    tasks,
    searchQuery,
    setSearchQuery,
    priorityFilter,
    setPriorityFilter,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    getTasksByColumn,
    getTaskCount,
    findTask,
  }), [
    tasks,
    searchQuery,
    priorityFilter,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    getTasksByColumn,
    getTaskCount,
    findTask,
  ]);

  return (
    <BoardContext.Provider value={value}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
};