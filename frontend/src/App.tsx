import React, { useState } from 'react';
import { useAppStore } from './store';
import { authAPI } from './api';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BattlePage from './pages/BattlePage';
import ProfilePage from './pages/ProfilePage';
import PetDetailPage from './pages/PetDetailPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AchievementsPage from './pages/AchievementsPage';
import CommunityPage from './pages/CommunityPage';
import './index.css';

type Page = 'login' | 'dashboard' | 'battle' | 'pet-creation' | 'profile' | 'pet-detail' | 'leaderboard' | 'achievements' | 'community';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const { user, token, setUser, setToken, setPet } = useAppStore();

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      console.log('登录成功:', response.data);
      setUser(response.data.user);
      setToken(response.data.token);
      setCurrentPage('dashboard');
    } catch (error: any) {
      console.error('登录失败:', error);
      alert(error.response?.data?.error || '登录失败');
      throw error;
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    try {
      const response = await authAPI.register(username, email, password);
      console.log('注册成功:', response.data);
      setUser(response.data.user);
      setToken(response.data.token);
      setCurrentPage('pet-creation');
    } catch (error: any) {
      console.error('注册失败:', error);
      alert(error.response?.data?.error || '注册失败');
      throw error;
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setPet(null);
    setCurrentPage('login');
  };

  return (
    <div>
      {currentPage === 'login' && (
        <LoginPage onLogin={handleLogin} onRegister={handleRegister} />
      )}
      {currentPage === 'dashboard' && user && (
        <DashboardPage
          onLogout={handleLogout}
          onBattle={() => setCurrentPage('battle')}
          onProfile={() => setCurrentPage('profile')}
          onLeaderboard={() => setCurrentPage('leaderboard')}
          onAchievements={() => setCurrentPage('achievements')}
          onCommunity={() => setCurrentPage('community')}
        />
      )}
      {currentPage === 'battle' && (
        <BattlePage onBack={() => setCurrentPage('dashboard')} />
      )}
      {currentPage === 'pet-creation' && (
        <PetCreationPage
          onPetCreated={() => {
            setCurrentPage('dashboard');
          }}
        />
      )}
      {currentPage === 'profile' && (
        <ProfilePage
          onBack={() => setCurrentPage('dashboard')}
          onPetDetail={(petId) => {
            setSelectedPetId(petId);
            setCurrentPage('pet-detail');
          }}
        />
      )}
      {currentPage === 'pet-detail' && (
        <PetDetailPage petId={selectedPetId} onBack={() => setCurrentPage('profile')} />
      )}
      {currentPage === 'leaderboard' && (
        <LeaderboardPage onBack={() => setCurrentPage('dashboard')} />
      )}
      {currentPage === 'achievements' && (
        <AchievementsPage onBack={() => setCurrentPage('dashboard')} />
      )}
      {currentPage === 'community' && (
        <CommunityPage onBack={() => setCurrentPage('dashboard')} />
      )}
    </div>
  );
}

const PetCreationPage: React.FC<{ onPetCreated: () => void }> = ({ onPetCreated }) => {
  const [name, setName] = useState('');
  const [personality, setPersonality] = useState('active');
  const [gender, setGender] = useState('male');
  const [loading, setLoading] = useState(false);
  const { petAPI } = require('./api');

  const handleCreate = async () => {
    if (!name.trim()) {
      alert('请输入宠物名字');
      return;
    }

    try {
      setLoading(true);
      await petAPI.create(name, personality, gender);
      onPetCreated();
    } catch (error: any) {
      alert(error.response?.data?.error || '创建宠物失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '500px', margin: '50px auto' }}>
        <h2 style={{ marginBottom: '30px', textAlign: 'center' }}>创建你的运动搭子</h2>

        <div className="form-group">
          <label>宠物名字</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="给你的宠物起个名字"
          />
        </div>

        <div className="form-group">
          <label>性格</label>
          <select value={personality} onChange={(e) => setPersonality(e.target.value)}>
            <option value="active">活泼</option>
            <option value="gentle">温柔</option>
            <option value="naughty">调皮</option>
            <option value="lazy">懒散</option>
          </select>
        </div>

        <div className="form-group">
          <label>性别</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="male">男</option>
            <option value="female">女</option>
            <option value="unknown">不确定</option>
          </select>
        </div>

        <button
          className="button button-primary"
          onClick={handleCreate}
          disabled={loading}
          style={{ width: '100%' }}
        >
          {loading ? '创建中...' : '创建宠物'}
        </button>
      </div>
    </div>
  );
};

export default App;
