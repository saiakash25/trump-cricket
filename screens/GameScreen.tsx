import React, { useState, useEffect, useCallback } from 'react';
import PlayerCardComponent from '../components/PlayerCard';
import { PlayerCard, StatName, CricketFormat } from '../types';

interface GameScreenProps {
  initialPlayerDeck: PlayerCard[];
  initialComputerDeck: PlayerCard[];
  onRestart: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ initialPlayerDeck, initialComputerDeck, onRestart }) => {
  const [playerDeck, setPlayerDeck] = useState(initialPlayerDeck);
  const [computerDeck, setComputerDeck] = useState(initialComputerDeck);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [selectedStat, setSelectedStat] = useState<{ statName: StatName; format: CricketFormat } | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [roundWinner, setRoundWinner] = useState<'player' | 'computer' | 'draw' | null>(null);
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);

  const playerCard = playerDeck.length > 0 ? playerDeck[0] : null;
  const computerCard = computerDeck.length > 0 ? computerDeck[0] : null;

  const computerSelectsStat = useCallback(() => {
    if (!computerCard) return;

    let bestStat: { statName: StatName; format: CricketFormat } | null = null;
    let bestValue = -1;

    (['odi', 'test', 't20'] as CricketFormat[]).forEach(format => {
      const stats = computerCard.stats[format];
      if (stats && Object.keys(stats).length > 0) {
        for (const key in stats) {
          const statName = key as StatName;
          const value = stats[statName];
          const parsedValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) || -1 : value;

          if (typeof parsedValue === 'number' && parsedValue !== -1) {
            const isHigherBetter = !['bowlingAverage'].includes(statName);
            if (bestStat === null) {
              bestValue = parsedValue;
              bestStat = { statName, format };
            } else if (isHigherBetter) {
                if (parsedValue > bestValue) {
                    bestValue = parsedValue;
                    bestStat = { statName, format };
                }
            } else { // Lower is better
                 if (parsedValue < bestValue) {
                    bestValue = parsedValue;
                    bestStat = { statName, format };
                }
            }
          }
        }
      }
    });
    
    if (bestStat) {
      handleStatSelect(bestStat.statName, bestStat.format);
    } else {
      // Fallback if no numeric stats found
      handleStatSelect('matches', 'odi');
    }
  }, [computerCard]);


  useEffect(() => {
    if (gameOver) return;

    if (isPlayerTurn) {
      setMessage("Your turn! Select a stat.");
    } else {
      setMessage("Computer's turn...");
      const timer = setTimeout(computerSelectsStat, 2000);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, playerDeck, computerDeck, gameOver, computerSelectsStat]);

  useEffect(() => {
    if ((playerDeck.length === 0 || computerDeck.length === 0) && (initialPlayerDeck.length > 0)) {
       setGameOver(true);
       const winner = playerDeck.length > 0 ? "You" : "The Computer";
       setMessage(`${winner} won the game!`);
    }
  }, [playerDeck, computerDeck, initialPlayerDeck]);

  const handleStatSelect = (statName: StatName, format: CricketFormat) => {
    if ((isPlayerTurn && !selectedStat) || !isPlayerTurn) {
        setSelectedStat({ statName, format });
        setTimeout(() => {
          setIsRevealed(true);
          compareStats({ statName, format });
        }, 1000);
    }
  };

  const compareStats = (statInfo: { statName: StatName; format: CricketFormat }) => {
    if (!playerCard || !computerCard) return;

    const playerStatValue = playerCard.stats[statInfo.format]?.[statInfo.statName];
    const computerStatValue = computerCard.stats[statInfo.format]?.[statInfo.statName];

    const parseStat = (value: string | number | undefined): number => {
        if (value === undefined || value === null) return -1;
        if (typeof value === 'number') return value;
        return parseFloat(value.replace(/[^0-9.]/g, '')) || -1;
    }

    const pVal = parseStat(playerStatValue);
    const cVal = parseStat(computerStatValue);
    
    const higherIsBetter = !['bowlingAverage'].includes(statInfo.statName);
    let winner: 'player' | 'computer' | 'draw' = 'draw';

    if (pVal === -1 && cVal === -1) {
        setMessage(`Neither player has this stat. It's a draw.`);
    } else if (pVal === -1) {
        winner = 'computer';
        setMessage(`You don't have this stat. Computer wins.`);
    } else if (cVal === -1) {
        winner = 'player';
        setMessage(`Computer doesn't have this stat. You win.`);
    } else if (pVal === cVal) {
        winner = 'draw';
    } else if (pVal > cVal) {
      winner = higherIsBetter ? 'player' : 'computer';
    } else {
      winner = higherIsBetter ? 'computer' : 'player';
    }

    setRoundWinner(winner);
    if(winner !== 'draw') {
        setMessage(`${winner === 'player' ? 'You win' : 'Computer wins'} the round!`);
    } else {
        setMessage("It's a draw! Cards are returned to the back of the deck.");
    }

    setTimeout(() => setupNextRound(winner), 4000);
  };

  const setupNextRound = (winner: 'player' | 'computer' | 'draw') => {
    const newPlayerDeck = [...playerDeck];
    const newComputerDeck = [...computerDeck];
    const pCard = newPlayerDeck.shift();
    const cCard = newComputerDeck.shift();

    if (pCard && cCard) {
      if (winner === 'player') {
        newPlayerDeck.push(pCard, cCard);
        setIsPlayerTurn(true);
      } else if (winner === 'computer') {
        newComputerDeck.push(cCard, pCard);
        setIsPlayerTurn(false);
      } else { // Draw
        newPlayerDeck.push(pCard);
        newComputerDeck.push(cCard);
        // Turn doesn't change on a draw
      }
    }
    
    setPlayerDeck(newPlayerDeck);
    setComputerDeck(newComputerDeck);
    
    setIsRevealed(false);
    setSelectedStat(null);
    setRoundWinner(null);
  };


  if (gameOver) {
    return (
      <div className="w-screen h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <h2 className="text-4xl font-bold mb-4">{message}</h2>
        <button
          onClick={onRestart}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-lg text-lg"
        >
          Play Again
        </button>
      </div>
    );
  }

  if (!playerCard || !computerCard) {
    return <div className="w-screen h-screen bg-gray-900 flex items-center justify-center text-white text-2xl">Setting up the pitch...</div>;
  }

  return (
    <div className="w-screen min-h-screen bg-gray-900 text-white p-4 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-5xl mx-auto flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold">Computer's Cards</h3>
          <p className="text-lg text-emerald-400">{computerDeck.length}</p>
        </div>
        <div className="text-center">
            <h2 className="text-2xl font-bold text-amber-400 h-8">{message}</h2>
        </div>
        <div className="text-right">
          <h3 className="text-xl font-bold">Your Cards</h3>
          <p className="text-lg text-emerald-400">{playerDeck.length}</p>
        </div>
      </header>
      <main className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col items-center">
          <PlayerCardComponent
            player={computerCard}
            isPlayerTurn={false}
            isRevealed={isRevealed}
            selectedStat={selectedStat}
          />
        </div>
        <div className="flex flex-col items-center">
          <PlayerCardComponent
            player={playerCard}
            onStatSelect={handleStatSelect}
            isPlayerTurn={isPlayerTurn && !selectedStat}
            isRevealed={true}
            selectedStat={selectedStat}
          />
        </div>
      </main>
    </div>
  );
};

export default GameScreen;