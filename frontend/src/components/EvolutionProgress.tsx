import React from 'react';

interface EvolutionProgressProps {
  currentForm: string;
  totalKcal: number;
}

const EvolutionProgress: React.FC<EvolutionProgressProps> = ({ currentForm, totalKcal }) => {
  const evolutionMap: any = {
    lazy_bug: { name: '懒懒虫', threshold: 100, nextForm: '小兔子', nextThreshold: 100 },
    rabbit: { name: '小兔子', threshold: 300, nextForm: '小鹿', nextThreshold: 300 },
    deer: { name: '小鹿', threshold: 600, nextForm: '闪闪兔', nextThreshold: 600 },
    shiny_rabbit: { name: '闪闪兔', threshold: 600, nextForm: '已进化', nextThreshold: 600 }
  };

  const current = evolutionMap[currentForm];
  if (!current) return null;

  const progress = currentForm === 'shiny_rabbit' ? 100 : (totalKcal / current.nextThreshold) * 100;

  return (
    <div className="evolution-progress">
      <div className="evolution-header">
        <span className="evolution-current">{current.name}</span>
        <span className="evolution-arrow">→</span>
        <span className="evolution-next">{current.nextForm}</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }}></div>
      </div>
      <div className="progress-text">
        {totalKcal} / {current.nextThreshold} kcal
      </div>
    </div>
  );
};

export default EvolutionProgress;
