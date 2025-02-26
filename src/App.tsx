import './App.css'
import { GameBoard } from './components/GameBoard'

function App() {
  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-8">Pong Game</h1>
      <GameBoard />
      <div className="mt-6 text-gray-300 text-center">
        <p>Use ↑ and ↓ arrow keys to move your paddle</p>
      </div>
    </div>
  )
}

export default App
