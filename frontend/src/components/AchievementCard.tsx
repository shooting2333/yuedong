import React from 'react';
import { Achievement } from '../store';

interface AchievementCardProps {
  achievement: Achievement;
  unlocked: boolean;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, unlocked }) => {
  const getTypeColor = (type: string) => {
    const colors: any = {
      battle: '#ff6b6b',
      exercise: '#51cf66',
      pet: '#ffd43b',
      social: '#748ffc',
      daily: '#ff922b'
    };
    return colors[type] || '#999';
  };

  return (
    <div className={`achievement-card ${unlocked ? 'unlocked' : 'locked'}`}>
      <div className="achievement-icon" style={{ backgroundColor: getTypeColor(achievement.type) }}>
        {unlocked ? '✓' : '?'}
      </div>
      <div className="achievement-info">
        <div className="achievement-name">{achievement.name}</div>
        <div className="achievement-desc">{achievement.description}</div>
        {unlocked && achievement.unlocked_at && (
          <div className="achievement-time">
            {new Date(achievement.unlocked_at).toLocaleDateString()}
          </div>
        )}
      </div>
      <div className="achievement-reward">+{achievement.reward_coins}</div>
    </div>
  );
};

export default AchievementCard;
