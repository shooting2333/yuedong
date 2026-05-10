import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { userAPI, achievementAPI } from '../api';
import StatsCard from '../components/StatsCard';
import AchievementCard from '../components/AchievementCard';
import { PetDrawer } from '../components/PetDrawer';

interface ProfilePageProps {
  onBack: () => void;
  onPetDetail?: (petId: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onBack, onPetDetail }) => {
  const { user, userStats, setUserStats, achievements, setAchievements } = useAppStore();
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const [profileRes, achievementsRes] = await Promise.all([
        userAPI.getProfile(),
        achievementAPI.getAll()
      ]);

      setUserStats(profileRes.data.stats);
      setPets(profileRes.data.pets);
      setAchievements(achievementsRes.data);
    } catch (error) {
      console.error('加载资料失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  const stats = userStats || {
    total_battles: 0,
    total_wins: 0,
    total_kcal: 0,
    current_streak: 0
  };

  const winRate = stats.total_battles > 0 ? Math.round((stats.total_wins / stats.total_battles) * 100) : 0;
  const unlockedCount = achievements.filter((a: any) => a.unlocked).length;
  const recentAchievements = achievements
    .filter((a: any) => a.unlocked)
    .sort((a: any, b: any) => new Date(b.unlocked_at).getTime() - new Date(a.unlocked_at).getTime())
    .slice(0, 6);

  return (
    <div className="container">
      <div className="page-header">
        <button className="back-button" onClick={onBack}>← 返回</button>
        <h1>个人资料</h1>
      </div>

      {/* 用户信息卡片 */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="user-header">
          <div className="user-avatar">👤</div>
          <div className="user-info">
            <h2>{user?.username}</h2>
            <div className="user-level">等级 {user?.level || 1}</div>
            <div style={{ color: '#666', fontSize: '14px', marginTop: '4px' }}>
              经验值: {user?.experience || 0}
            </div>
          </div>
        </div>
      </div>

      {/* 统计数据 */}
      <div className="stats-grid">
        <StatsCard icon="🏃" label="总运动量" value={`${stats.total_kcal} kcal`} color="#51cf66" />
        <StatsCard icon="⚔️" label="完成战斗" value={stats.total_battles} color="#ff6b6b" />
        <StatsCard icon="🎯" label="胜率" value={`${winRate}%`} color="#748ffc" />
        <StatsCard icon="🔥" label="连续签到" value={`${stats.current_streak} 天`} color="#ff922b" />
      </div>

      {/* 宠物列表 */}
      <div className="card" style={{ marginTop: '20px', marginBottom: '20px' }}>
        <h3>我的宠物</h3>
        {pets.length > 0 ? (
          <div className="pets-list">
            {pets.map((pet) => (
              <div
                key={pet.id}
                className="pet-item"
                onClick={() => onPetDetail?.(pet.id)}
                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ width: '100px', height: '100px', margin: '0 auto' }}>
                  <PetDrawer form={pet.current_form} trustLevel={pet.trust_level} />
                </div>
                <div className="pet-details">
                  <div className="pet-name">{pet.name}</div>
                  <div className="pet-stat">信任度: {pet.trust_level}/100</div>
                  <div className="pet-stat">运动量: {pet.total_kcal} kcal</div>
                  <div style={{ fontSize: '12px', color: '#667eea', marginTop: '8px', fontWeight: 'bold' }}>
                    点击查看详情 →
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#666' }}>还没有宠物，快去创建一个吧！</p>
        )}
      </div>

      {/* 成就墙 */}
      <div className="card" style={{ marginTop: '20px' }}>
        <h3>成就 ({unlockedCount}/{achievements.length})</h3>
        {recentAchievements.length > 0 ? (
          <div className="achievements-wall">
            {recentAchievements.map((achievement: any) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                unlocked={true}
              />
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
            还没有解锁任何成就，继续加油！
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
