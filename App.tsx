import React, { useState, useEffect, useCallback } from 'react';
import { players as initialPlayers } from './data/players';
import { PlayerCard as PlayerCardType } from './types';
import GameScreen from './screens/GameScreen';
import MainMenu from './screens/MainMenu';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<'menu' | 'game'>('menu');
  const [playerDeck, setPlayerDeck] = useState<PlayerCardType[]>([]);
  const [computerDeck, setComputerDeck] = useState<PlayerCardType[]>([]);

  const shuffleAndDeal = useCallback(() => {
    const shuffled = [...initialPlayers].sort(() => 0.5 - Math.random());
    const midPoint = Math.floor(shuffled.length / 2);
    setPlayerDeck(shuffled.slice(0, midPoint));
    setComputerDeck(shuffled.slice(midPoint));
  }, []);

  const startGame = () => {
    shuffleAndDeal();
    setGameState('game');
  };

  const restartGame = () => {
    setGameState('menu');
    setPlayerDeck([]);
    setComputerDeck([]);
  };

  if (gameState === 'menu') {
    return <MainMenu onStartGame={startGame} />;
  }

  return (
    <GameScreen
      initialPlayerDeck={playerDeck}
      initialComputerDeck={computerDeck}
      onRestart={restartGame}
    />
  );
};

export default App;
