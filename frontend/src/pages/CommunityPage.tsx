import React, { useState, useEffect } from 'react';
import { groupAPI } from '../api';

interface CommunityPageProps {
  onBack: () => void;
}

interface Group {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  requiredKcalPerPerson: number;
  coinsPerPerson: number;
  members: number;
  maxMembers: number;
  deadline: string;
  creatorName?: string;
}

const CommunityPage: React.FC<CommunityPageProps> = ({ onBack }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const response = await groupAPI.getAll();
      console.log('小组数据:', response.data);
      setGroups(response.data || []);
    } catch (error) {
      console.error('加载小组失败:', error);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    try {
      await groupAPI.join(groupId);
      alert('加入小组成功！');
      loadGroups();
    } catch (error: any) {
      alert(error.response?.data?.error || '加入小组失败');
    }
  };

  const filteredGroups = filter === 'all' ? groups : groups.filter(g => g.difficulty === filter);

  const difficultyMap: any = {
    easy: { label: '简单', color: '#51cf66', emoji: '🟢' },
    medium: { label: '中等', color: '#ff922b', emoji: '🟡' },
    hard: { label: '困难', color: '#ff6b6b', emoji: '🔴' }
  };

  return (
    <div className="container">
      <div className="page-header">
        <button className="back-button" onClick={onBack}>← 返回</button>
        <h1>社群发现</h1>
      </div>

      {/* 难度过滤 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '8px 16px',
            background: filter === 'all' ? '#667eea' : '#f0f0f0',
            color: filter === 'all' ? 'white' : '#333',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer'
          }}
        >
          全部
        </button>
        <button
          onClick={() => setFilter('easy')}
          style={{
            padding: '8px 16px',
            background: filter === 'easy' ? '#51cf66' : '#f0f0f0',
            color: filter === 'easy' ? 'white' : '#333',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer'
          }}
        >
          🟢 简单
        </button>
        <button
          onClick={() => setFilter('medium')}
          style={{
            padding: '8px 16px',
            background: filter === 'medium' ? '#ff922b' : '#f0f0f0',
            color: filter === 'medium' ? 'white' : '#333',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer'
          }}
        >
          🟡 中等
        </button>
        <button
          onClick={() => setFilter('hard')}
          style={{
            padding: '8px 16px',
            background: filter === 'hard' ? '#ff6b6b' : '#f0f0f0',
            color: filter === 'hard' ? 'white' : '#333',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer'
          }}
        >
          🔴 困难
        </button>
      </div>

      {/* 小组列表 */}
      {loading ? (
        <div className="loading">加载中...</div>
      ) : filteredGroups.length > 0 ? (
        <div style={{ display: 'grid', gap: '16px' }}>
          {filteredGroups.map((group) => (
            <div key={group.id} className="card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px 0' }}>{group.name}</h3>
                  <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                    创建者: {group.creatorName || '未知'}
                  </p>
                </div>
                <div style={{
                  background: difficultyMap[group.difficulty].color,
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap'
                }}>
                  {difficultyMap[group.difficulty].emoji} {difficultyMap[group.difficulty].label}
                </div>
              </div>

              {/* 小组信息 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
                <div style={{ background: '#f5f5f5', padding: '8px', borderRadius: '4px', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#666' }}>人数</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    {group.members}/{group.maxMembers}
                  </div>
                </div>
                <div style={{ background: '#f5f5f5', padding: '8px', borderRadius: '4px', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#666' }}>运动量</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    {group.requiredKcalPerPerson} kcal
                  </div>
                </div>
                <div style={{ background: '#f5f5f5', padding: '8px', borderRadius: '4px', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#666' }}>奖励</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffd700' }}>
                    {group.coinsPerPerson} 币
                  </div>
                </div>
              </div>

              {/* 截止时间 */}
              <div style={{ fontSize: '12px', color: '#999', marginBottom: '12px' }}>
                ⏰ 截止时间: {new Date(group.deadline).toLocaleDateString('zh-CN')}
              </div>

              {/* 加入按钮 */}
              <button
                className="button button-primary"
                onClick={() => handleJoinGroup(group.id)}
                disabled={group.members >= group.maxMembers}
                style={{ width: '100%' }}
              >
                {group.members >= group.maxMembers ? '小组已满' : '加入小组'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#666' }}>暂无符合条件的小组</p>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
