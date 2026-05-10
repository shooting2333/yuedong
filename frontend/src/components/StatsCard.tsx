import React from 'react';

interface StatsCardProps {
  icon: string;
  label: string;
  value: number | string;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, label, value, color }) => {
  return (
    <div className="stats-card" style={{ borderLeftColor: color }}>
      <div className="stats-icon" style={{ color }}>
        {icon}
      </div>
      <div className="stats-content">
        <div className="stats-label">{label}</div>
        <div className="stats-value">{value}</div>
      </div>
    </div>
  );
};

export default StatsCard;
