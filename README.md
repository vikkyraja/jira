# Mini Jira - Kanban Task Board

A responsive, Jira-inspired Kanban board application built with React, Vite, and Tailwind CSS. This application allows users to manage tasks across "Todo", "In Progress", and "Done" columns with smooth drag-and-drop functionality.



## 🚀 Features

- **Kanban Board Layout**: Three fixed columns (Todo, In Progress, Done).
- **Drag & Drop**: Smooth drag-and-drop experience using `@dnd-kit`.
- **Task Management**:
  - Create new tasks with Title, Description, Priority, and Assignee.
  - Edit existing tasks by clicking on the card.
  - Delete tasks with a confirmation dialog.
- **Search & Filter**:
  - Real-time search by task title.
  - Filter tasks by priority (High, Medium, Low).
- **Theme Support**: Fully functional Dark and Light mode toggle.
- **Data Persistence**: All board state is saved to `localStorage`, persisting across page reloads.
- **Responsive Design**: Optimized for Desktop and Tablet views.
- **Form Validation**: robust validation for required fields.

## 🛠️ Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (v4)
- **Drag & Drop**: @dnd-kit/core, @dnd-kit/sortable
- **State Management**: React Context API
- **Icons**: Pure SVG (No external icon libraries)

## 📦 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## ⚡ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mini-jira

   Install dependencies

npm install
Start the development server

npm run dev
Build for production

npm run build

src/
├── components/
│   ├── Board/          # Column, TaskCard, and Board logic
│   ├── Header/         # Application header with filters/search
│   ├── Modals/         # Task creation/edit and confirmation modals
│   └── UI/             # Reusable UI components (Buttons, Inputs, etc.)
├── context/
│   ├── BoardContext.jsx # Global state for tasks and filters
│   └── ThemeContext.jsx # Dark/Light mode logic
├── hooks/
│   └── useLocalStorage.js # Custom hook for persistence
├── utils/
│   └── helpers.js       # Formatting and filtering logic
├── constants/           # Static config (Colors, Column IDs)
├── App.jsx
├── main.jsx
└── index.css            # Tailwind directives and CSS variables