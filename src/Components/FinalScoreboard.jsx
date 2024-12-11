import React, { useMemo } from 'react';
import './styles/Leaderboard.css';

const FinalScoreboard = ({ scores }) => {
  const scoresFromProps = useMemo(() => scores || [], [scores]);

  const topThree = useMemo(() => {
    return [...scoresFromProps]
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, 3);
  }, [scoresFromProps]);

  const maxScore = 5000;

  return (
    <div className="leaderboard-container">
      <h1>Top 3 Final Scores</h1>
      <div className="bars-container">
        {topThree.map((entry, index) => {
          const barWidth = (entry.finalScore / maxScore) * 100;
          return (
            <div key={index} className="bar-wrapper">
              <div className="bar-info">
                <span className="rank">#{index + 1}</span>
                <span className="name">{entry.name}</span>
                <span className="score">{entry.finalScore} pts</span>
              </div>
              <div className="bar" style={{ width: `${barWidth}%` }}></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FinalScoreboard;
