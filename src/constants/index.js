




// src/constants/index.js
export const COLUMNS = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  DONE: 'done',
};

export const COLUMN_TITLES = {
  [COLUMNS.TODO]: 'Todo',
  [COLUMNS.IN_PROGRESS]: 'In Progress',
  [COLUMNS.DONE]: 'Done',
};

export const COLUMN_COLORS = {
  [COLUMNS.TODO]: {
    light: 'bg-gray-100 border-gray-300',
    dark: 'dark:bg-gray-800 dark:border-gray-600',
    header: 'bg-gray-200 dark:bg-gray-700',
    dot: 'bg-gray-500',
  },
  [COLUMNS.IN_PROGRESS]: {
    light: 'bg-blue-50 border-blue-200',
    dark: 'dark:bg-blue-900/20 dark:border-blue-800',
    header: 'bg-blue-100 dark:bg-blue-900/40',
    dot: 'bg-blue-500',
  },
  [COLUMNS.DONE]: {
    light: 'bg-green-50 border-green-200',
    dark: 'dark:bg-green-900/20 dark:border-green-800',
    header: 'bg-green-100 dark:bg-green-900/40',
    dot: 'bg-green-500',
  },
};
export const PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export const PRIORITY_LABELS = {
  [PRIORITIES.LOW]: 'Low',
  [PRIORITIES.MEDIUM]: 'Medium',
  [PRIORITIES.HIGH]: 'High',
};

export const PRIORITY_COLORS = {
  [PRIORITIES.LOW]: {
    bg: 'bg-green-100 dark:bg-green-900/40',
    text: 'text-green-700 dark:text-green-400',
    border: 'border-green-300 dark:border-green-700',
  },
  [PRIORITIES.MEDIUM]: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/40',
    text: 'text-yellow-700 dark:text-yellow-400',
    border: 'border-yellow-300 dark:border-yellow-700',
  },
  [PRIORITIES.HIGH]: {
    bg: 'bg-red-100 dark:bg-red-900/40',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-300 dark:border-red-700',
  },
};
export const STORAGE_KEY = 'mini-jira-board';
export const THEME_STORAGE_KEY = 'mini-jira-theme';