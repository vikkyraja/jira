export const generateId = () => {
  return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export const filterTasks = (tasks, searchQuery, priorityFilter) => {
  return tasks.filter((task) => {
    const matchesSearch = searchQuery
      ? task.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesPriority = priorityFilter
      ? task.priority === priorityFilter
      : true;
    return matchesSearch && matchesPriority;
  });
};

