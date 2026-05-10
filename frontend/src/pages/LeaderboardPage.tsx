import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { leaderboardAPI } from '../api';
import { LeaderboardEntry } from '../store';

interface LeaderboardPageProps {
  onBack: () => void;
}

const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ onBack }) => {
  const { user } = useAppStore();
  const [activeTab, setActiveTab] = useState<'kcal' | 'coins'>('kcal');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    loadLeaderboard();
  }, [activeTab]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const res = activeTab === 'kcal'
        ? await leaderboardAPI.getKcalLeaderboard(50, 0)
        : await leaderboardAPI.getCoinsLeaderboard(50, 0);

      setLeaderboard(res.data);

      // 查找当前用户的排名
      const myRank = res.data.find((entry: LeaderboardEntry) => entry.username === user?.username);
      setUserRank(myRank || null);
    } catch (error) {
      console.error('加载排行榜失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankMedal = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getTabTitle = () => {
    return activeTab === 'kcal' ? '🏃 运动量排行' : '💰 虚拟币排行';
  };

  const getValueLabel = () => {
    return activeTab === 'kcal' ? 'kcal' : '币';
  };

  return (
    <div className="container">
      <div className="page-header">
        <button className="back-button" onClick={onBack}>← 返回</button>
        <h1>排行榜</h1>
      </div>

      {/* 标签切换 */}
      <div className="tabs" style={{ marginBottom: '20px' }}>
        <button
          className={`tab ${activeTab === 'kcal' ? 'active' : ''}`}
          onClick={() => setActiveTab('kcal')}
        >
          🏃 运动量排行
        </button>
        <button
          className={`tab ${activeTab === 'coins' ? 'active' : ''}`}
          onClick={() => setActiveTab('coins')}
        >
          💰 虚拟币排行
        </button>
      </div>

      {/* 用户排名卡片 */}
      {userRank && (
        <div className="card" style={{ marginBottom: '20px', background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)', borderLeft: '4px solid #667eea' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>你的排名</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {getRankMedal(userRank.rank)} 第 {userRank.rank} 名
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>成绩</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
                {userRank.value} {getValueLabel()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 排行榜列表 */}
      <div className="card">
        {loading ? (
          <div className="loading">加载中...</div>
        ) : leaderboard.length > 0 ? (
          <div className="leaderboard-list">
            {leaderboard.map((entry) => (
              <div
                key={entry.rank}
                className="leaderboard-item"
                style={{
                  background: entry.username === user?.username ? '#f0f0f0' : 'transparent',
                  borderLeft: entry.username === user?.username ? '4px solid #667eea' : '4px solid #eee'
                }}
              >
                <div className="rank" style={{ fontSize: '28px', minWidth: '50px' }}>
                  {getRankMedal(entry.rank)}
                </div>
                <div className="user-info" style={{ flex: 1 }}>
                  <div className="username" style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    {entry.username}
                    {entry.username === user?.username && ' (你)'}
                  </div>
                  <div className="level" style={{ fontSize: '12px', color: '#666' }}>
                    Lv.{entry.level}
                  </div>
                </div>
                <div className="value" style={{ fontSize: '20px', fontWeight: 'bold', color: '#667eea' }}>
                  {entry.value}
                </div>
                <div style={{ fontSize: '12px', color: '#999', marginLeft: '8px' }}>
                  {getValueLabel()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            暂无排行榜数据
          </div>
        )}
      </div>

      {/* 排行榜说明 */}
      <div className="card" style={{ marginTop: '20px', background: '#f9f9f9' }}>
        <h3>排行榜说明</h3>
        <ul style={{ color: '#666', fontSize: '14px', lineHeight: '1.8' }}>
          <li>🏃 <strong>运动量排行</strong>：根据累计运动消耗的卡路里排名</li>
          <li>💰 <strong>虚拟币排行</strong>：根据拥有的虚拟币数量排名</li>
          <li>🥇 <strong>排名更新</strong>：每次完成战斗后实时更新</li>
          <li>⭐ <strong>等级显示</strong>：根据运动量自动升级</li>
        </ul>
      </div>
    </div>
  );
};

export default LeaderboardPage;
