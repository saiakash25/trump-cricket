import React from 'react';

interface MainMenuProps {
  onStartGame: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
  return (
    <div className="w-screen h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl md:text-6xl font-extrabold mb-2 text-emerald-400 tracking-tight">Cricket Legends</h1>
      <h2 className="text-3xl md:text-4xl font-bold mb-8">Top Trumps</h2>
      <p className="max-w-xl text-center text-gray-300 mb-12">
        Get ready to pit legendary cricketers against each other. When it's your turn, select a stat from your card.
        If your player's stat is higher, you win the round and take the computer's card. The game ends when one player has all the cards.
      </p>
      <button
        onClick={onStartGame}
        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-10 rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out text-xl"
      >
        Start Game
      </button>
    </div>
  );
};

export default MainMenu;
