import React, { useState } from 'react';
import { useAppStore } from '../store';
import { PetDrawer } from '../components/PetDrawer';

interface DashboardPageProps {
  onLogout: () => void;
  onBattle: () => void;
  onProfile?: () => void;
  onLeaderboard?: () => void;
  onAchievements?: () => void;
  onCommunity?: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout, onBattle, onProfile, onLeaderboard, onAchievements, onCommunity }) => {
  const { user, pet } = useAppStore();
  const [showGroupModal, setShowGroupModal] = useState(false);

  return (
    <div className="container">
      {/* 头部 */}
      <div className="header">
        <div>
          <h1>🏃 悦动</h1>
          <p style={{ color: '#666', marginTop: '5px' }}>欢迎回来，{user?.username}</p>
        </div>
        <div className="user-info">
          <div className="coin-display">
            💰 {user?.coins || 0}
          </div>
          <button className="button button-secondary" onClick={onLogout}>
            退出登录
          </button>
        </div>
      </div>

      {/* 主要内容 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* 宠物卡片 */}
        <div className="card">
          <h2 style={{ marginBottom: '20px' }}>你的运动搭子</h2>
          {pet ? (
            <div>
              <PetDrawer form={pet.current_form} trustLevel={pet.trust_level} />
              <div style={{ textAlign: 'center' }}>
                <h3>{pet.name}</h3>
                <p style={{ color: '#666', marginBottom: '10px' }}>
                  性格: {getPetPersonalityLabel(pet.personality)}
                </p>
                <p style={{ color: '#666', marginBottom: '15px' }}>
                  总运动: {pet.total_kcal} kcal
                </p>
                <div style={{
                  background: '#f0f0f0',
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#666'
                }}>
                  <p>当前形态: {getPetFormLabel(pet.current_form)}</p>
                  <p>信任度: {pet.trust_level}%</p>
                </div>
              </div>
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#666' }}>还没有宠物，请先创建一个</p>
          )}
        </div>

        {/* 快速操作 */}
        <div className="card">
          <h2 style={{ marginBottom: '20px' }}>快速操作</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              className="button button-primary"
              onClick={onBattle}
              style={{ width: '100%' }}
            >
              🎮 开始冒险
            </button>
            <button
              className="button button-primary"
              onClick={() => setShowGroupModal(true)}
              style={{ width: '100%' }}
            >
              👥 创建小组
            </button>
            <button
              className="button button-secondary"
              onClick={onProfile}
              style={{ width: '100%' }}
            >
              👤 个人资料
            </button>
            <button
              className="button button-secondary"
              onClick={onLeaderboard}
              style={{ width: '100%' }}
            >
              📊 排行榜
            </button>
            <button
              className="button button-secondary"
              onClick={onAchievements}
              style={{ width: '100%' }}
            >
              🎁 成就
            </button>
            <button
              className="button button-secondary"
              onClick={onCommunity}
              style={{ width: '100%' }}
            >
              🌍 社群发现
            </button>
          </div>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="card">
        <h2 style={{ marginBottom: '20px' }}>本周统计</h2>
        <div className="stats">
          <div className="stat-item">
            <div className="stat-label">本周运动</div>
            <div className="stat-value">0 kcal</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">完成小组</div>
            <div className="stat-value">0</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">获得虚拟币</div>
            <div className="stat-value">0</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">连续天数</div>
            <div className="stat-value">0</div>
          </div>
        </div>
      </div>

      {/* 小组创建模态框 */}
      {showGroupModal && (
        <div className="modal" onClick={() => setShowGroupModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowGroupModal(false)}
            >
              ✕
            </button>
            <div className="modal-header">创建小组</div>

            <div className="form-group">
              <label>小组名称</label>
              <input type="text" placeholder="输入小组名称" />
            </div>

            <div className="form-group">
              <label>难度</label>
              <select>
                <option value="easy">简单 (300kcal/人, 5币)</option>
                <option value="medium">中等 (500kcal/人, 10币)</option>
                <option value="hard">困难 (800kcal/人, 20币)</option>
              </select>
            </div>

            <div className="form-group">
              <label>截止时间</label>
              <select>
                <option value="3">3天</option>
                <option value="7">7天</option>
                <option value="14">14天</option>
              </select>
            </div>

            <button
              className="button button-primary"
              style={{ width: '100%' }}
            >
              创建小组
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function getPetPersonalityLabel(personality: string): string {
  const labels: { [key: string]: string } = {
    active: '活泼',
    gentle: '温柔',
    naughty: '调皮',
    lazy: '懒散'
  };
  return labels[personality] || personality;
}

function getPetFormLabel(form: string): string {
  const labels: { [key: string]: string } = {
    lazy_bug: '懒懒虫',
    rabbit: '小兔子',
    deer: '小鹿',
    shiny_rabbit: '闪闪兔'
  };
  return labels[form] || form;
}

export default DashboardPage;
