import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface GameState {
  ballPosition: { x: number; y: number };
  ballVelocity: { x: number; y: number };
  paddle1Position: number;
  paddle2Position: number;
  score: { player1: number; player2: number };
}

const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 15;
const BALL_SIZE = 15;
const BALL_SPEED = 5;
const PADDLE_SPEED = 8;

export const GameBoard = () => {
  // State to manage the game state
  const [gameState, setGameState] = useState<GameState>({
    ballPosition: { x: 400, y: 300 },
    ballVelocity: { x: BALL_SPEED, y: BALL_SPEED },
    paddle1Position: 250,
    paddle2Position: 250,
    score: { player1: 0, player2: 0 },
  });

  const gameLoopRef = useRef<number>();
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateGame = () => {
      setGameState(prev => {
        const newBallX = prev.ballPosition.x + prev.ballVelocity.x;
        const newBallY = prev.ballPosition.y + prev.ballVelocity.y;
        let newVelocityX = prev.ballVelocity.x;
        let newVelocityY = prev.ballVelocity.y;

        // Ball collision with top and bottom walls
        if (newBallY <= 0 || newBallY >= 585) {
          newVelocityY = -newVelocityY;
        }

        // Ball collision with paddles
        if (
          (newBallX <= PADDLE_WIDTH && 
           newBallY >= prev.paddle1Position && 
           newBallY <= prev.paddle1Position + PADDLE_HEIGHT) ||
          (newBallX >= 785 - PADDLE_WIDTH && 
           newBallY >= prev.paddle2Position && 
           newBallY <= prev.paddle2Position + PADDLE_HEIGHT)
        ) {
          newVelocityX = -newVelocityX;
        }

        // AI paddle movement
        let newPaddle2Position = prev.paddle2Position;
        if (prev.ballPosition.y > prev.paddle2Position + PADDLE_HEIGHT / 2) {
          newPaddle2Position = Math.min(500, prev.paddle2Position + PADDLE_SPEED / 2);
        } else if (prev.ballPosition.y < prev.paddle2Position + PADDLE_HEIGHT / 2) {
          newPaddle2Position = Math.max(0, prev.paddle2Position - PADDLE_SPEED / 2);
        }

        // Score update
        let newScore = { ...prev.score };
        if (newBallX <= 0) {
          newScore.player2++;
          return {
            ...prev,
            ballPosition: { x: 400, y: 300 },
            ballVelocity: { x: BALL_SPEED, y: BALL_SPEED },
            score: newScore
          };
        } else if (newBallX >= 785) {
          newScore.player1++;
          return {
            ...prev,
            ballPosition: { x: 400, y: 300 },
            ballVelocity: { x: -BALL_SPEED, y: BALL_SPEED },
            score: newScore
          };
        }

        return {
          ...prev,
          ballPosition: { x: newBallX, y: newBallY },
          ballVelocity: { x: newVelocityX, y: newVelocityY },
          paddle2Position: newPaddle2Position
        };
      });
    };

    // Set up the game loop interval
    gameLoopRef.current = setInterval(updateGame, 16);
    return () => {
      // Clear the interval when the component unmounts
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, []); // <-- Closing bracket for useEffect

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        setGameState(prev => ({
          ...prev,
          paddle1Position: Math.max(0, prev.paddle1Position - PADDLE_SPEED)
        }));
      } else if (e.key === 'ArrowDown') {
        setGameState(prev => ({
          ...prev,
          paddle1Position: Math.min(500, prev.paddle1Position + PADDLE_SPEED)
        }));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="relative w-[800px] h-[600px] bg-gray-900 rounded-lg overflow-hidden" ref={boardRef}>
      {/* Score display */}
      <div className="absolute top-4 left-0 w-full flex justify-center gap-8 text-white text-2xl font-bold z-10">
        <span>{gameState.score.player1}</span>
        <span>{gameState.score.player2}</span>
      </div>
    
      {/* Player 1 Paddle */}
      <motion.div
        className="absolute left-0 w-[15px] bg-white rounded"
        style={{
          height: PADDLE_HEIGHT,
          top: gameState.paddle1Position,
        }}
        animate={{ top: gameState.paddle1Position }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    
      {/* Player 2 Paddle (AI) */}
      <motion.div
        className="absolute right-0 w-[15px] bg-white rounded"
        style={{
          height: PADDLE_HEIGHT,
          top: gameState.paddle2Position,
        }}
        animate={{ top: gameState.paddle2Position }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    
      {/* Ball */}
      <motion.div
        className="absolute bg-white rounded-full"
        style={{
          width: BALL_SIZE,
          height: BALL_SIZE,
          top: gameState.ballPosition.y,
          left: gameState.ballPosition.x,
        }}
        animate={{
          top: gameState.ballPosition.y,
          left: gameState.ballPosition.x,
        }}
        transition={{ type: "tween" }}
      />
    </div>
  );
};