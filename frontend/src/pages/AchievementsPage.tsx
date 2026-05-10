import React, { useState, useEffect } from 'react';
import { useAppStore, Achievement } from '../store';
import { achievementAPI } from '../api';
import AchievementCard from '../components/AchievementCard';

interface AchievementsPageProps {
  onBack: () => void;
}

const AchievementsPage: React.FC<AchievementsPageProps> = ({ onBack }) => {
  const { achievements, setAchievements } = useAppStore();
  const [activeType, setActiveType] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      const res = await achievementAPI.getAll();
      setAchievements(res.data);
    } catch (error) {
      console.error('加载成就失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const types = [
    { key: 'all', label: '全部', icon: '⭐' },
    { key: 'battle', label: '战斗', icon: '⚔️' },
    { key: 'exercise', label: '运动', icon: '🏃' },
    { key: 'pet', label: '宠物', icon: '🐾' },
    { key: 'social', label: '社交', icon: '👥' },
    { key: 'daily', label: '每日', icon: '📅' }
  ];

  const filtered = activeType === 'all'
    ? achievements
    : achievements.filter((a: Achievement) => a.type === activeType);

  const unlockedCount = achievements.filter((a: Achievement) => a.unlocked).length;
  const totalReward = achievements
    .filter((a: Achievement) => a.unlocked)
    .reduce((sum, a: Achievement) => sum + (a.reward_coins || 0), 0);

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
    <div className="container">
      <div className="page-header">
        <button className="back-button" onClick={onBack}>← 返回</button>
        <h1>成就系统</h1>
      </div>

      {/* 成就统计 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '20px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏆</div>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>已解锁</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{unlockedCount}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>总数</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{achievements.length}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>💰</div>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>奖励</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffd700' }}>{totalReward}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📈</div>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>进度</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {achievements.length > 0 ? Math.round((unlockedCount / achievements.length) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* 类型过滤 */}
      <div className="achievement-types" style={{ marginBottom: '20px' }}>
        {types.map((type) => (
          <button
            key={type.key}
            className={`type-button ${activeType === type.key ? 'active' : ''}`}
            onClick={() => setActiveType(type.key)}
            style={{
              background: activeType === type.key ? `linear-gradient(135deg, ${getTypeColor(type.key)} 0%, ${getTypeColor(type.key)}dd 100%)` : 'white',
              color: activeType === type.key ? 'white' : '#333',
              border: activeType === type.key ? 'none' : '2px solid #eee'
            }}
          >
            {type.icon} {type.label}
          </button>
        ))}
      </div>

      {/* 成就网格 */}
      <div className="card">
        {loading ? (
          <div className="loading">加载中...</div>
        ) : filtered.length > 0 ? (
          <div className="achievements-grid">
            {filtered.map((achievement: Achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                unlocked={achievement.unlocked || false}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            该分类暂无成就
          </div>
        )}
      </div>

      {/* 成就说明 */}
      <div className="card" style={{ marginTop: '20px', background: '#f9f9f9' }}>
        <h3>成就说明</h3>
        <div style={{ color: '#666', fontSize: '14px', lineHeight: '1.8' }}>
          <p>🎯 <strong>成就系统</strong>：通过完成各种任务和挑战来解锁成就</p>
          <p>💎 <strong>成就奖励</strong>：每个成就解锁时会获得虚拟币奖励</p>
          <p>📈 <strong>成就分类</strong>：包括战斗、运动、宠物、社交、每日等多个分类</p>
          <p>🏆 <strong>成就展示</strong>：已解锁的成就会显示为彩色，未解锁的成就显示为灰色</p>
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;
