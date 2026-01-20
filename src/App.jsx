
import { ThemeProvider } from './context/ThemeContext';
import { BoardProvider } from './context/BoardContext';
import Header from './components/Header/Header';
import Board from './components/Board/Board';

function App() {
  return (
    <ThemeProvider>
      <BoardProvider>
        <div className="min-h-screen transition-colors duration-300">
          <Header />
          <main className="p-4">
            <Board />
          </main>
        </div>
      </BoardProvider>
    </ThemeProvider>
  );
}

export default App;