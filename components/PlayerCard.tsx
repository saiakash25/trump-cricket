import React, { useState } from 'react';
import { PlayerCard, StatName, CricketFormat } from '../types';

interface PlayerCardProps {
  player: PlayerCard;
  onStatSelect?: (statName: StatName, format: CricketFormat) => void;
  isPlayerTurn: boolean;
  isRevealed: boolean;
  selectedStat: { statName: StatName; format: CricketFormat } | null;
}

const STATS_MAP: { key: StatName; label: string }[] = [
    { key: 'matches', label: 'Matches' },
    { key: 'runs', label: 'Runs' },
    { key: 'highestScore', label: 'Highest Score' },
    { key: 'battingAverage', label: 'Batting Avg' },
    { key: 'centuries', label: '100s' },
    { key: 'fours', label: '4s' },
    { key: 'sixes', label: '6s' },
    { key: 'wickets', label: 'Wickets' },
    { key: 'bowlingAverage', label: 'Bowling Avg' },
    { key: 'fiveWickets', label: '5-Wicket Hauls' },
];

const StatRow: React.FC<{
  label: string;
  value: string | number | undefined;
  onClick?: () => void;
  isClickable: boolean;
  isSelected: boolean;
}> = ({ label, value, onClick, isClickable, isSelected }) => {
  if (value === undefined || value === null || (typeof value === 'number' && isNaN(value))) {
    return null; // Don't render if value is not valid
  }
  const buttonClasses = isClickable
    ? 'hover:bg-emerald-700 cursor-pointer transition-colors duration-200'
    : 'cursor-default';
  
  const selectedClass = isSelected ? 'ring-2 ring-amber-400 bg-emerald-700' : '';

  return (
    <button
      onClick={onClick}
      disabled={!isClickable}
      className={`flex justify-between w-full text-left p-2 rounded ${buttonClasses} ${selectedClass}`}
    >
      <span className="font-semibold text-gray-300">{label}</span>
      <span className="font-bold text-white">{value.toString()}</span>
    </button>
  );
};

const PlayerCardComponent: React.FC<PlayerCardProps> = ({
  player,
  onStatSelect = () => {},
  isPlayerTurn,
  isRevealed,
  selectedStat,
}) => {
  const [activeTab, setActiveTab] = useState<CricketFormat>('odi');
  const cardBackClass = !isRevealed ? '[transform:rotateY(180deg)]' : '';

  const stats = player.stats[activeTab];
  
  const StatDisplay = () => {
    if (!stats || Object.keys(stats).length === 0) {
      return <p className="text-gray-400 text-center p-4">No {activeTab.toUpperCase()} stats available.</p>;
    }
    return (
      <>
        {STATS_MAP.map(({ key, label }) => (
           <StatRow
              key={key}
              label={label}
              value={stats[key]}
              onClick={() => onStatSelect(key, activeTab)}
              isClickable={isPlayerTurn}
              isSelected={selectedStat?.statName === key && selectedStat?.format === activeTab}
            />
        ))}
      </>
    );
  }

  return (
    <div className="w-full max-w-sm h-[530px] [perspective:1000px]">
      <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${cardBackClass}`}>
        {/* Card Front */}
        <div className="absolute w-full h-full bg-emerald-800 rounded-xl shadow-lg border-2 border-emerald-600 p-4 flex flex-col [backface-visibility:hidden]">
          <div className="relative w-full h-48">
            <img
                src={player.imagePath}
                alt={player.name}
                className="w-full h-full object-cover rounded-lg bg-emerald-900"
            />
          </div>
          <div className="text-center pt-3 pb-1">
            <h3 className="text-2xl font-bold text-white">{player.name}</h3>
            <p className="text-sm text-gray-400">{player.country} ({player.span})</p>
          </div>

          <div className="border-b-2 border-emerald-600 mt-1 mb-2">
            <nav className="flex -mb-px">
              {(['test', 'odi', 't20'] as CricketFormat[]).map(format => (
                 <button
                    key={format}
                    onClick={() => setActiveTab(format)}
                    className={`flex-1 py-2 text-sm font-medium text-center border-b-2 transition-colors duration-200 ${
                      activeTab === format
                        ? 'border-emerald-400 text-emerald-300'
                        //: 'border-transparent text-gray-400 hover:border-gray-500'
                        : 'border-transparent text-gray-400 hover:border-gray-500 disabled:opacity-50'
                    }`}
                    disabled={Object.keys(player.stats[format]).length === 0}
                >
                    {format.toUpperCase()}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2">
            <StatDisplay />
          </div>
        </div>
        
        {/* Card Back */}
        <div className="absolute w-full h-full bg-emerald-700 rounded-xl shadow-lg border-2 border-emerald-500 [backface-visibility:hidden] [transform:rotateY(180deg)] flex items-center justify-center">
            <div className="text-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.789 0l-2 4A1 1 0 008 8h4a1 1 0 00.894-1.447l-2-4zM10 12a1 1 0 100 2h.01a1 1 0 100-2H10z"/>
                    <path fillRule="evenodd" d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm2 0a6 6 0 1112 0 6 6 0 01-12 0z" clipRule="evenodd" />
                </svg>
                <p className="mt-4 text-xl font-semibold">Card</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCardComponent;
