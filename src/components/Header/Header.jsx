import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useBoard } from "../../context/BoardContext";
import TaskModal from "../Modals/TaskModal";
import { PRIORITY_LABELS } from "../../constants";

const Header = () => {
  const {  toggleTheme, isDark } = useTheme();
  const { searchQuery, setSearchQuery, priorityFilter, setPriorityFilter } =
    useBoard();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
<header className="
  sticky top-0 z-40
  border-b border-[hsl(var(--border))]
  bg-[hsl(var(--card))/0.95]
  backdrop-blur
">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
                <span className="text-sm font-bold text-primary-foreground">
                  M
                </span>
              </div>
              <h1 className="text-lg font-semibold text-foreground">
                Mini Jira
              </h1>
            </div>

            {/* Search + Filter */}
            <div className="flex flex-1  gap-3 sm:flex-row sm:items-center sm:max-w-2xl">
              {/* Search */}
              <div className="relative flex-1">
                <svg
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 21l-6-6" />
                  <circle cx="11" cy="11" r="7" />
                </svg>

                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="
  w-full rounded-md px-10 py-2 text-sm
  bg-[hsl(var(--background))]
  text-[hsl(var(--foreground))]
  placeholder-[hsl(var(--muted-foreground))]
  border border-[hsl(var(--input))]
  focus:outline-none
  focus:ring-2 focus:ring-[hsl(var(--ring))]
"
                />
              </div>

              {/* Priority Filter */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="
  rounded-md px-3 py-2 text-sm
  bg-[hsl(var(--background))]
  text-[hsl(var(--foreground))]
  border border-[hsl(var(--input))]
  focus:outline-none
  focus:ring-2 focus:ring-[hsl(var(--ring))]
"
              >
                <option value="">All Priority</option>
                {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
      onClick={toggleTheme}
      className="
        p-2 rounded-lg
        bg-gray-100 dark:bg-gray-800
        text-gray-600 dark:text-gray-300
        hover:bg-gray-200 dark:hover:bg-gray-700
        transition-colors
      "
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? '☀️' : '🌙'}
    </button>

              {/* Add Task */}
              <button
                onClick={() => setIsModalOpen(true)}
className="
  inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium
  bg-[hsl(var(--primary))]
  text-[hsl(var(--primary-foreground))]
  transition-colors
  hover:bg-[hsl(var(--card))]
  hover:text-[hsl(var(--foreground))]
  dark:hover:bg-[hsl(var(--secondary))]
"

              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span className="hidden sm:inline">Add Task</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Header;
