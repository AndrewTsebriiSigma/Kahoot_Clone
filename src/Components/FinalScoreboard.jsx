import React, { useMemo } from 'react';
import './styles/Leaderboard.css';
import { useLocation } from 'react-router-dom';

const FinalScoreboard = () => {
  const location = useLocation()
  const scores = location.state?.scores;


  const topThree = useMemo(() => {
    return [...scores]
      .sort((a, b) => b.finalscore - a.finalscore)
      .slice(0, 3);
  }, [scores]);

  const maxScore = 5000;

  return (
    <div className="leaderboard-container">
      <h1>Top 3 Final Scores</h1>
      <div className="bars-container">
        {topThree.map((entry, index) => {
          const barWidth = (entry.finalscore / maxScore) * 100;
          return (
            <div key={index} className="bar-wrapper">
              <div className="bar-info">
                <span className="rank">#{index + 1}</span>
                <span className="name">{entry.username}</span>
                <span className="score">{entry.finalscore} pts</span>
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
